import { NextRequest, NextResponse } from 'next/server';
import { createS3Client } from '../../../../lib/s3Client';
import { S3Config } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const { config, folderName, prefix = '' }: { 
      config: S3Config; 
      folderName: string; 
      prefix?: string;
    } = await request.json();

    if (!config || !folderName) {
      return NextResponse.json({ message: 'Config and folder name are required' }, { status: 400 });
    }

    const s3 = createS3Client(config);
    const key = `${prefix}${folderName}/`;

    await s3.putObject({
      Bucket: config.bucketName,
      Key: key,
      Body: '',
    }).promise();

    return NextResponse.json({
      success: true,
      message: 'Folder created successfully',
      key,
    });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create folder',
    }, { status: 500 });
  }
}