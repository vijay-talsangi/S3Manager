import { NextRequest, NextResponse } from 'next/server';
import { createS3Client } from '../../../../lib/s3Client';
import { S3Config } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const s3Config = JSON.parse(formData.get('config') as string) as S3Config;
    const prefix = formData.get('prefix') as string || '';
    
    if (!s3Config.accessKeyId) {
      return NextResponse.json({ message: 'S3 config is required' }, { status: 400 });
    }

    const s3 = createS3Client(s3Config);
    const uploadPromises = [];

    // Get all file entries
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        const file = value as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileKey = prefix ? `${prefix}${file.name}` : file.name;

        uploadPromises.push(
          s3.upload({
            Bucket: s3Config.bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
          }).promise()
        );
      }
    }

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${results.length} file(s)`,
      results,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to upload files',
    }, { status: 500 });
  }
}