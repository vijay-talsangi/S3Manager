import Cookies from 'js-cookie';
import { S3Config } from '../types';

const S3_CONFIG_COOKIE = 's3-config';

export const saveS3Config = (config: S3Config) => {
  // Encrypt or encode the config before storing (basic base64 encoding)
  const encoded = btoa(JSON.stringify(config));
  Cookies.set(S3_CONFIG_COOKIE, encoded, { expires: 7 });
};

export const getS3Config = (): S3Config | null => {
  try {
    const encoded = Cookies.get(S3_CONFIG_COOKIE);
    if (!encoded) return null;
    
    const decoded = atob(encoded);
    return JSON.parse(decoded) as S3Config;
  } catch (error) {
    console.error('Error parsing S3 config from cookies:', error);
    return null;
  }
};

export const removeS3Config = () => {
  Cookies.remove(S3_CONFIG_COOKIE);
};