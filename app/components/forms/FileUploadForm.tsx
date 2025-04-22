'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

type FileType = 'video' | 'audio' | 'document'

interface FileUploadFormProps {
  defaultType?: FileType
  onUploadComplete?: (filePath: string) => void
}

export default function FileUploadForm({ 
  defaultType = 'video',
  onUploadComplete
}: FileUploadFormProps) {
  const [selectedFileType, setSelectedFileType] = useState<FileType>(defaultType)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type based on selectedFileType
    let validTypes: string[] = [];
    let maxSize = 100 * 1024 * 1024; // 100MB default

    switch (selectedFileType) {
      case 'video':
        validTypes = ['video/mp4', 'video/quicktime'];
        break;
      case 'document':
        validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        maxSize = 10 * 1024 * 1024; // 10MB for documents
        break;
      case 'audio':
        validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a'];
        maxSize = 50 * 1024 * 1024; // 50MB for audio
        break;
    }

    if (!validTypes.includes(selectedFile.type)) {
      setError(`Please upload a valid ${selectedFileType} file`);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', selectedFileType);

      // Show initial progress
      setUploadProgress(20);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Show progress during server processing
      setUploadProgress(60);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Show completion progress
      setUploadProgress(100);
      setUploadSuccess(true);
      
      if (onUploadComplete && data.filePath) {
        onUploadComplete(data.filePath);
      }
      
      // Reset after 2 seconds
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        <button
          onClick={() => setSelectedFileType('video')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedFileType === 'video'
              ? 'bg-[#8B5CF6] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setSelectedFileType('audio')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedFileType === 'audio'
              ? 'bg-[#8B5CF6] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => setSelectedFileType('document')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedFileType === 'document'
              ? 'bg-[#8B5CF6] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Document
        </button>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={
            selectedFileType === 'video'
              ? 'video/*'
              : selectedFileType === 'audio'
              ? 'audio/*'
              : 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'
          }
        />
        
        {!file ? (
          <div>
            <svg 
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Click to select a {selectedFileType} file
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {selectedFileType === 'video'
                ? 'MP4, MOV up to 100MB'
                : selectedFileType === 'audio'
                ? 'MP3, WAV, M4A up to 50MB'
                : 'PDF, DOC, DOCX, TXT up to 10MB'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-md text-gray-800 font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      {file && !isUploading && !uploadSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button onClick={handleUpload} variant="primary">
            Upload {selectedFileType}
          </Button>
        </motion.div>
      )}

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#8B5CF6] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-500 text-center"
        >
          <svg 
            className="w-6 h-6 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p>Upload successful!</p>
        </motion.div>
      )}
    </div>
  )
}
