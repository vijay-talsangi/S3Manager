import React, { useState, useEffect, useCallback } from 'react';
import { S3Config, S3Object, UploadProgress as UploadProgressType } from '../types';
import CreateFolderModal from './CreateFolderModal';
import UploadProgress from './UploadProgress';

interface FileManagerProps {
  config: S3Config;
  onDisconnect: () => void;
  username: string;
}

const FileManager: React.FC<FileManagerProps> = ({ config, onDisconnect, username }) => {
  const [objects, setObjects] = useState<(S3Object & { type: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadProgressType[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const fetchFiles = useCallback(async (prefix = '') => {
    setLoading(true);
    try {
      const response = await fetch('/api/s3/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config, prefix }),
      });

      const data = await response.json();
      if (data.success) {
        setObjects(data.objects);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchFiles(currentPrefix);
  }, [fetchFiles, currentPrefix]);

  const handleFileUpload = async (files: FileList) => {
    const formData = new FormData();
    formData.append('config', JSON.stringify(config));
    formData.append('prefix', currentPrefix);

    const newUploads: UploadProgressType[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append(`file-${i}`, file);
      newUploads.push({
        fileName: file.name,
        progress: 1,
        status: 'uploading',
      });
    }

    setUploads(prev => [...prev, ...newUploads]);

    try {
      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUploads(prev => prev.map(upload => 
          newUploads.find(nu => nu.fileName === upload.fileName)
            ? { ...upload, progress: 100, status: 'completed' as const }
            : upload
        ));
        
        // Remove completed uploads after 2 seconds
        setTimeout(() => {
          setUploads(prev => prev.filter(upload => 
            !newUploads.find(nu => nu.fileName === upload.fileName)
          ));
        }, 2000);
        
        fetchFiles(currentPrefix);
      } else {
        setUploads(prev => prev.map(upload => 
          newUploads.find(nu => nu.fileName === upload.fileName)
            ? { ...upload, status: 'error' as const }
            : upload
        ));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => prev.map(upload => 
        newUploads.find(nu => nu.fileName === upload.fileName)
          ? { ...upload, status: 'error' as const }
          : upload
      ));
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      const response = await fetch('/api/s3/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          folderName,
          prefix: currentPrefix,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchFiles(currentPrefix);
      } else {
        alert(data.message || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config, key }),
      });

      const data = await response.json();
      if (data.success) {
        fetchFiles(currentPrefix);
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const handleFolderClick = (folderKey: string) => {
    setCurrentPrefix(folderKey);
  };

  const handleBackClick = () => {
    const parts = currentPrefix.split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length > 0 ? parts.join('/') + '/' : '';
    setCurrentPrefix(newPrefix);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">🔗</span>
            </div>
            <h1 className="text-xl font-semibold text-orange-500">S3 Storage</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-green-400">● {username}</span>
            <button
              onClick={onDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Path Navigation */}
        <div className="flex items-center mb-4">
          <span className="text-gray-400 text-sm">/{currentPrefix}</span>
          {currentPrefix && (
            <button
              onClick={handleBackClick}
              className="ml-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateFolderOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
              <span>📁</span>
              <span>New Folder</span>
            </button>
            
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition-colors">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <span>📤 Upload Files</span>
            </label>
          </div>
          
          <button className="text-gray-400 hover:text-white">
            🔍 Filter
          </button>
        </div>

        {/* Upload Progress */}
        <UploadProgress uploads={uploads} />

        {/* File Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-colors ${
            dragOver 
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-gray-600 bg-gray-800/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <p className="text-gray-400 mb-2">
              📁 Drop files or click to upload
            </p>
            <label className="text-blue-400 hover:text-blue-300 cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              Browse files
            </label>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : objects.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No files or folders found
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              <div className="px-6 py-3 bg-gray-800 text-sm font-medium text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Select All (1 items)</span>
                  <div className="flex space-x-8">
                    <span>Type</span>
                    <span>Size</span>
                    <span>Date</span>
                  </div>
                </div>
              </div>
              
              {objects.map((object, index) => (
                <div
                  key={object.Key || index}
                  className="px-6 py-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-2xl">
                        {object.type === 'folder' ? '📁' : '📄'}
                      </span>
                      <button
                        className="text-white hover:text-blue-400 text-left"
                        onClick={() => {
                          if (object.type === 'folder' && object.Key) {
                            handleFolderClick(object.Key);
                          }
                        }}
                      >
                        {object.type === 'folder' 
                          ? object.Key?.split('/').slice(-2, -1)[0] || 'Folder'
                          : object.Key?.split('/').pop() || 'File'
                        }
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-8 text-sm text-gray-400">
                      <span className="w-16">
                        {object.type === 'folder' ? 'Folder' : 'File'}
                      </span>
                      <span className="w-20">
                        {object.type === 'folder' ? '-' : formatFileSize(object.Size)}
                      </span>
                      <span className="w-24">
                        {formatDate(object.LastModified)}
                      </span>
                      <button
                        onClick={() => object.Key && handleDelete(object.Key)}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default FileManager;