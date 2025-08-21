import { NextRequest, NextResponse } from 'next/server';
import { testS3Connection } from '../../../../lib/s3Client';
import { S3Config } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey, region, bucketName }: S3Config = await request.json();

    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const config: S3Config = {
      accessKeyId,
      secretAccessKey,
      region,
      bucketName,
    };

    const isConnected = await testS3Connection(config);
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully connected to S3',
        config 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to S3. Please check your credentials.' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('S3 connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}