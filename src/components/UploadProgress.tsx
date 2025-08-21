import React from 'react';
import { UploadProgress as UploadProgressType } from '../types';

interface UploadProgressProps {
  uploads: UploadProgressType[];
}

const UploadProgress: React.FC<UploadProgressProps> = ({ uploads }) => {
  if (uploads.length === 0) return null;

  return (
    <div className="bg-gray-800 border border-green-500 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-green-400 text-sm font-medium">
          📁 Uploading files ({uploads.length})
        </span>
      </div>
      
      <div className="space-y-2">
        {uploads.map((upload, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 truncate">{upload.fileName}</span>
              <span className="text-orange-400">
                {upload.status === 'completed' ? '✓' : `${upload.progress}%`}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${
                  upload.status === 'completed' 
                    ? 'bg-green-500' 
                    : upload.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-orange-500'
                }`}
                style={{ width: `${upload.progress}%` }}
              />
            </div>
            
            {upload.status === 'uploading' && (
              <div className="text-orange-400 text-xs">Preparing upload...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadProgress;