"use server";

import * as cheerio from "cheerio";
import { z } from "zod";

const FormSchema = z.object({
  url: z.string().url({ message: "Por favor, introduce una URL válida." }),
});

export type MediaResult = {
  images: string[];
  videos: string[];
};

export type ActionState = {
  message: string;
  data?: MediaResult;
  error?: string;
  timestamp?: number;
};

export async function extractMedia(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = FormSchema.safeParse({
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error de validación.",
      error: validatedFields.error.flatten().fieldErrors.url?.join(", "),
      timestamp: Date.now(),
    };
  }

  const { url } = validatedFields.data;
  let baseUrl: URL;

  try {
    baseUrl = new URL(url);
  } catch (error) {
     return {
      message: "URL inválida.",
      error: "La URL proporcionada no es válida.",
      timestamp: Date.now(),
    };
  }


  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const images = new Set<string>();
    const videos = new Set<string>();

    const resolveUrl = (src: string | undefined): string | null => {
      if (!src) return null;
      try {
        // Use the URL constructor for robust resolving of relative/absolute paths
        return new URL(src, baseUrl.href).href;
      } catch (e) {
        // Ignore invalid URLs
        return null;
      }
    };

    // Extract images from <img> tags
    $("img").each((_, element) => {
      const src = $(element).attr("src") || $(element).attr("data-src");
      const srcset = $(element).attr("srcset") || $(element).attr("data-srcset");
      
      if (src) {
        const absoluteSrc = resolveUrl(src);
        if (absoluteSrc) images.add(absoluteSrc);
      }

      if (srcset) {
        srcset.split(",").forEach(part => {
          const urlPart = part.trim().split(/\s+/)[0];
          const absoluteSrc = resolveUrl(urlPart);
          if (absoluteSrc) images.add(absoluteSrc);
        });
      }
    });

    // Extract videos from <video> tags
    $("video").each((_, element) => {
      const src = $(element).attr("src");
      const poster = $(element).attr("poster");

      if (src) {
        const absoluteSrc = resolveUrl(src);
        if (absoluteSrc) videos.add(absoluteSrc);
      }
      if (poster) {
        const absolutePoster = resolveUrl(poster);
        if (absolutePoster) images.add(absolutePoster); // Posters are images
      }
      
      $(element).find("source").each((_, sourceElement) => {
         const sourceSrc = $(sourceElement).attr("src");
         if (sourceSrc) {
            const absoluteSourceSrc = resolveUrl(sourceSrc);
            if (absoluteSourceSrc) videos.add(absoluteSourceSrc);
         }
      });
    });

    const imageData = Array.from(images);
    const videoData = Array.from(videos);

    if (imageData.length === 0 && videoData.length === 0) {
      return {
        message: "No se encontraron medios.",
        data: { images: [], videos: [] },
        timestamp: Date.now(),
      };
    }

    return {
      message: "Extracción completada.",
      data: {
        images: imageData,
        videos: videoData,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    let errorMessage = "Ha ocurrido un error inesperado al procesar la página.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      message: "Error en la extracción.",
      error: errorMessage,
      timestamp: Date.now(),
    };
  }
}
