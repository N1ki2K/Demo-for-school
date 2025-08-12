import React, { useState, useEffect } from 'react';
import { apiService, ApiError } from '../../src/services/api';
import { useCMS } from '../../context/CMSContext';

interface MediaFile {
  id: string;
  originalName: string;
  filename: string;
  mimeType?: string;
  size: number;
  url: string;
  altText?: string;
  created_at: string;
}

export const MediaManagerDashboard: React.FC = () => {
  const { isLoading } = useCMS();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [currentPage]);

  const loadFiles = async () => {
    try {
      setLocalError(null);
      const response = await apiService.getMediaFiles(currentPage, 12);
      setFiles(response.files || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to load media files:', error);
      setLocalError('Failed to load media files');
      setFiles([]);
    }
  };

  const handleFileUpload = async (uploadFiles: File[]) => {
    if (!uploadFiles.length) return;
    
    setUploading(true);
    setLocalError(null);
    
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        try {
          const result = await apiService.uploadFile(file);
          return result;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r !== null).length;
      
      if (successCount > 0) {
        await loadFiles(); // Reload files to show new uploads
      }
      
      if (successCount < uploadFiles.length) {
        setLocalError(`${successCount}/${uploadFiles.length} files uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setLocalError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
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
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(file.id)) {
      newSelected.delete(file.id);
    } else {
      newSelected.add(file.id);
    }
    setSelectedFiles(newSelected);
  };

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Delete ${file.originalName}?`)) return;
    
    try {
      await apiService.deleteMediaFile(file.id);
      await loadFiles(); // Reload files
    } catch (error) {
      console.error('Delete failed:', error);
      setLocalError('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (mimeType: string | undefined) => mimeType && mimeType.startsWith('image/');

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Media Management</h3>

      {/* Error Display */}
      {localError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          <p className="text-gray-600 mb-4">Drag and drop files here, or click to select</p>
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
            className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </label>
        </div>
      </div>

      {uploading && (
        <div className="p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
          <div className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading files...
          </div>
        </div>
      )}

      {/* Files Grid */}
      {files.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {files.filter(file => file && file.id).map((file) => (
              <div
                key={file.id}
                className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
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
                    onError={(e) => {
                      console.error('Image load error:', e);
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="p-2">
                  <p className="text-xs font-medium truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors text-xs"
                  title="Delete file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No media files yet. Upload your first file to get started!</p>
        </div>
      )}
    </div>
  );
};