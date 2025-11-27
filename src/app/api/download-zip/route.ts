
import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import { PassThrough } from 'stream';

// Helper to get a unique filename
const getUniqueFilename = (url: string, usedNames: Set<string>): string => {
  const baseName = url.substring(url.lastIndexOf('/') + 1).split('?')[0] || 'media-file';
  let finalName = baseName;
  let counter = 1;
  while (usedNames.has(finalName)) {
    const extensionIndex = baseName.lastIndexOf('.');
    if (extensionIndex > 0) {
      const name = baseName.substring(0, extensionIndex);
      const ext = baseName.substring(extensionIndex);
      finalName = `${name}_${counter}${ext}`;
    } else {
      finalName = `${baseName}_${counter}`;
    }
    counter++;
  }
  usedNames.add(finalName);
  return finalName;
};

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return new NextResponse('Se requiere un array de URLs.', { status: 400 });
    }

    const stream = new PassThrough();
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.pipe(stream);
    const usedFilenames = new Set<string>();

    const fetchAndAppend = async (url: string) => {
      try {
        const response = await fetch(url, {
             headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            },
        });
        if (response.ok && response.body) {
          const buffer = await response.arrayBuffer();
          const filename = getUniqueFilename(url, usedFilenames);
          archive.append(Buffer.from(buffer), { name: filename });
        }
      } catch (error) {
        console.error(`Error al obtener la URL para el ZIP: ${url}`, error);
      }
    };
    
    await Promise.all(urls.map(url => fetchAndAppend(url)));

    archive.finalize();

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="media_harvester_archive.zip"');

    // Here we are casting the stream to any because of a type mismatch in Next.js types
    return new NextResponse(stream as any, { headers });

  } catch (error) {
    console.error('Error al crear el archivo ZIP:', error);
    return new NextResponse('Error interno del servidor al crear el ZIP.', { status: 500 });
  }
}
