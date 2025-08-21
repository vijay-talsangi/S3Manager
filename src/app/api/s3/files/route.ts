import { NextRequest, NextResponse } from 'next/server';
import { createS3Client } from '../../../../lib/s3Client';
import { S3Config } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const { config, prefix = '' }: { config: S3Config; prefix?: string } = await request.json();

    if (!config) {
      return NextResponse.json({ message: 'S3 config is required' }, { status: 400 });
    }

    const s3 = createS3Client(config);
    
    const params = {
      Bucket: config.bucketName,
      Prefix: prefix,
      Delimiter: '/',
    };

    const data = await s3.listObjectsV2(params).promise();
    
    const folders = data.CommonPrefixes?.map(prefix => ({
      Key: prefix.Prefix,
      type: 'folder',
      LastModified: new Date(),
      Size: 0,
    })) || [];

    const files = data.Contents?.filter(item => item.Key !== prefix).map(item => ({
      ...item,
      type: 'file',
    })) || [];

    return NextResponse.json({
      success: true,
      objects: [...folders, ...files],
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch files',
    }, { status: 500 });
  }
}