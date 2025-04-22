import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const runtime = 'edge';
export const maxDuration = 60;

const ALLOWED_FILE_TYPES = {
  video: ['video/mp4', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/x-m4a'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
};

const MAX_FILE_SIZES = {
  video: 100 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
  document: 10 * 1024 * 1024,
  default: 10 * 1024 * 1024,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    if (!fileType || !['video', 'audio', 'document'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type.' },
        { status: 400 }
      );
    }

    const allowedMimeTypes = ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES] || [];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file format. Allowed formats for ${fileType}: ${allowedMimeTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const maxSize = MAX_FILE_SIZES[fileType as keyof typeof MAX_FILE_SIZES] || MAX_FILE_SIZES.default;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed size for ${fileType}: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const typeDir = join(uploadDir, fileType);
    if (!existsSync(typeDir)) {
      mkdirSync(typeDir, { recursive: true });
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${Date.now()}-${sanitizedName}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = join(typeDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileType}/${uniqueFilename}`;
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filePath: fileUrl,
      url: fileUrl,
      fileName: sanitizedName,
      fileSize: file.size,
      mimeType: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred during file upload.';
      
    return NextResponse.json(
      { 
        error: 'Failed to upload file.', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}