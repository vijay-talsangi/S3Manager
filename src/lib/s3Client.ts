import AWS from 'aws-sdk';
import { S3Config } from '../types';

export const createS3Client = (config: S3Config) => {
  AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
  });

  return new AWS.S3();
};

export const testS3Connection = async (config: S3Config): Promise<boolean> => {
  try {
    const s3 = createS3Client(config);
    await s3.headBucket({ Bucket: config.bucketName }).promise();
    return true;
  } catch (error) {
    console.error('S3 connection test failed:', error);
    return false;
  }
};