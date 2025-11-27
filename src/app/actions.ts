"use server";

import { z } from "zod";
import puppeteer from "puppeteer";

const FormSchema = z.object({
  url: z.string().url({ message: "Por favor, introduce una URL válida." }),
});

export type MediaResult = {
  images: string[];
  videos: string[];
  audios: string[];
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
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2" });
    
    const media = await page.evaluate((pageUrl) => {
        const resolveUrl = (src: string | null): string | null => {
            if (!src) return null;
            try {
                return new URL(src, pageUrl).href;
            } catch (e) {
                return null;
            }
        };

        const images = new Set<string>();
        document.querySelectorAll("img").forEach((img) => {
            if (img.src) {
                const absoluteSrc = resolveUrl(img.src);
                if (absoluteSrc) images.add(absoluteSrc);
            }
            if (img.dataset.src) {
                const absoluteSrc = resolveUrl(img.dataset.src);
                if (absoluteSrc) images.add(absoluteSrc);
            }
            if (img.srcset) {
                 img.srcset.split(",").forEach(part => {
                    const urlPart = part.trim().split(/\s+/)[0];
                    const absoluteSrc = resolveUrl(urlPart);
                    if (absoluteSrc) images.add(absoluteSrc);
                });
            }
        });

        const videos = new Set<string>();
        document.querySelectorAll("video").forEach((video) => {
            if (video.src) {
                 const absoluteSrc = resolveUrl(video.src);
                 if (absoluteSrc) videos.add(absoluteSrc);
            }
            video.querySelectorAll("source").forEach((source) => {
                if (source.src) {
                    const absoluteSrc = resolveUrl(source.src);
                    if (absoluteSrc) videos.add(absoluteSrc);
                }
            });
        });
        
        const audios = new Set<string>();
        document.querySelectorAll("audio").forEach((audio) => {
            if (audio.src) {
                 const absoluteSrc = resolveUrl(audio.src);
                 if (absoluteSrc) audios.add(absoluteSrc);
            }
            audio.querySelectorAll("source").forEach((source) => {
                if (source.src) {
                    const absoluteSrc = resolveUrl(source.src);
                    if (absoluteSrc) audios.add(absoluteSrc);
                }
            });
        });


        return {
            images: Array.from(images),
            videos: Array.from(videos),
            audios: Array.from(audios),
        };
    }, url);


    if (media.images.length === 0 && media.videos.length === 0 && media.audios.length === 0) {
      return {
        message: "No se encontraron medios.",
        data: { images: [], videos: [], audios: [] },
        timestamp: Date.now(),
      };
    }

    return {
      message: "Extracción completada.",
      data: {
        images: media.images,
        videos: media.videos,
        audios: media.audios,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(error);
    let errorMessage = "Ha ocurrido un error inesperado al procesar la página.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      message: "Error en la extracción.",
      error: errorMessage,
      timestamp: Date.now(),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
