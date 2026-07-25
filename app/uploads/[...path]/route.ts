import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Wait for params as per Next.js 15 rules
  const pathParams = await params;
  
  if (!pathParams.path || pathParams.path.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Sanitize path to prevent directory traversal
  const safePath = path.normalize(path.join(...pathParams.path)).replace(/^(\.\.(\/|\\|$))+/, '');
  
  const filePath = path.join(process.cwd(), 'public', 'uploads', safePath);
  
  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
