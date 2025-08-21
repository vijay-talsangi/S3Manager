'use client';

import React, { useState, useEffect } from 'react';
import { S3Config } from '../types';
import { getS3Config, saveS3Config, removeS3Config } from '../lib/cookies';
import S3Connection from '../components/S3Connection';
import FileManager from '../components/FileManager';

export default function HomePage() {
  const [config, setConfig] = useState<S3Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedConfig = getS3Config();
    setConfig(savedConfig);
    setLoading(false);
  }, []);

  const handleConnect = (newConfig: S3Config) => {
    saveS3Config(newConfig);
    setConfig(newConfig);
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/disconnect', { method: 'POST' });
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      removeS3Config();
      setConfig(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!config) {
    return <S3Connection onConnect={handleConnect} />;
  }

  return (
    <FileManager
      config={config}
      onDisconnect={handleDisconnect}
      username={config.bucketName}
    />
  );
}