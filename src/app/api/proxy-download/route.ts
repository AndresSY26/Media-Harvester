
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL de imagen requerida', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse('No se pudo obtener la imagen', { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Attempt to get the filename from the URL
    const urlPath = new URL(imageUrl).pathname;
    const filename = urlPath.substring(urlPath.lastIndexOf('/') + 1) || 'media-file';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(imageBuffer, { headers });
  } catch (error) {
    console.error('Error en el proxy de descarga:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
