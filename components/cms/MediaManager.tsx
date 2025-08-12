import React, { useState, useEffect } from 'react';
import { apiService, ApiError } from '../../src/services/api';
import { useCMS } from '../../context/CMSContext';

interface MediaFile {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
  created_at: string;
}

interface MediaManagerProps {
  onSelectImage?: (imageUrl: string) => void;
  allowMultipleSelection?: boolean;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ 
  onSelectImage, 
  allowMultipleSelection = false 
}) => {
  const { isLoading, error } = useCMS();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [currentPage]);

  const loadFiles = async () => {
    try {
      const response = await apiService.getMediaFiles(currentPage, 12);
      setFiles(response.files);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to load media files:', error);
    }
  };

  const handleFileUpload = async (uploadFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of uploadFiles) {
        await apiService.uploadFile(file);
      }
      await loadFiles();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    if (onSelectImage) {
      onSelectImage(file.url);
      return;
    }

    if (allowMultipleSelection) {
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id);
      } else {
        newSelected.add(file.id);
      }
      setSelectedFiles(newSelected);
    } else {
      setSelectedFiles(new Set([file.id]));
    }
  };

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Delete ${file.originalName}?`)) return;
    
    try {
      await apiService.deleteMediaFile(file.id);
      await loadFiles();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Media Manager</h3>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </label>
        </div>
      </div>

      {uploading && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
          Uploading files...
        </div>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {files.map((file) => (
          <div
            key={file.id}
            className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedFiles.has(file.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleFileSelect(file)}
          >
            {isImage(file.mimeType) ? (
              <img
                src={`http://localhost:3001${file.url}`}
                alt={file.altText || file.originalName}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            
            <div className="p-2">
              <p className="text-sm font-medium truncate" title={file.originalName}>
                {file.originalName}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};