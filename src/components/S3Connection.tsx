import React, { useState } from 'react';
import { S3Config } from '../types';

interface S3ConnectionProps {
  onConnect: (config: S3Config) => void;
}

const S3Connection: React.FC<S3ConnectionProps> = ({ onConnect }) => {
  const [config, setConfig] = useState<S3Config>({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucketName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/s3/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        onConnect(config);
      } else {
        setError(data.message || 'Failed to connect to S3');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex max-w-6xl w-full">
        {/* Logo Section */}
        <div className="flex-shrink-0 mr-8">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              🔗S3
            </div>
          </div>
        </div>

        {/* Connection Form */}
        <div className="flex-1 max-w-md">
          <div className="bg-gray-900 border border-orange-500 rounded-lg p-6">
            <h2 className="text-orange-500 text-xl font-semibold mb-6">
              AWS S3 Configuration
            </h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Access Key ID
                </label>
                <input
                  type="text"
                  value={config.accessKeyId}
                  onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Enter your access key ID"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Secret Access Key
                  <span className="text-xs text-gray-500 ml-2">Hidden for security</span>
                </label>
                <input
                  type="password"
                  value={config.secretAccessKey}
                  onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Enter your secret access key"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={config.region}
                  onChange={(e) => setConfig({ ...config, region: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="us-east-1"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={config.bucketName}
                  onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Enter bucket name"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded transition-colors"
              >
                {loading ? 'Connecting...' : 'CONNECT TO S3'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default S3Connection;