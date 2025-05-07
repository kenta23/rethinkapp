import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const videoPath = path.resolve(process.cwd(), "screen-capture (1).webm");
    const videoBuffer =  fs.readFile(videoPath, (err, data) => { 
         if(err) {
            console.error('Error serving video:', err);
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
         }
         return new NextResponse(data, {
            headers: {
                'Content-Type': 'video/webm',
                'Content-Length': data.length.toString(),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=31536000',
            },
         })
    });

  } catch (error) {
    console.error('Error serving video:', error);
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }
} 