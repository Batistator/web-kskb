import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const imagesDir = path.join(process.cwd(), 'public/images/nemes');
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const imageData = imageFiles.map(file => ({
      src: `/images/nemes/${file}`,
      alt: file
    }));
    return NextResponse.json(imageData);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}