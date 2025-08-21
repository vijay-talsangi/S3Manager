import { NextRequest, NextResponse } from 'next/server';
import { createS3Client } from '../../../../lib/s3Client';
import { S3Config } from '../../../../types';

export async function DELETE(request: NextRequest) {
  try {
    const { config, key }: { config: S3Config; key: string } = await request.json();

    if (!config || !key) {
      return NextResponse.json({ message: 'Config and key are required' }, { status: 400 });
    }

    const s3 = createS3Client(config);
    
    await s3.deleteObject({
      Bucket: config.bucketName,
      Key: key,
    }).promise();

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete file',
    }, { status: 500 });
  }
}