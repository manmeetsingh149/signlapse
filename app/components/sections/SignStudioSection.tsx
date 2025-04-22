'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SignStudioSectionProps {
  id?: string
}

export default function SignStudioSection({ id }: SignStudioSectionProps) {
  const [selectedFileType, setSelectedFileType] = useState('video')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef(null)

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

  // Function to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setRecordedBlob(audioBlob)
        setFile(new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' }))
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start timer
      setRecordingTime(0)
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('Unable to access microphone. Please check your permissions.')
    }
  }

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      audioStream?.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setAudioStream(null)
      
      // Clear timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [audioStream])

  return (
    <motion.section 
      id={id}
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-[#F5F3FF] to-white"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Platform Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Platform Header */}
              <div className="bg-[#1F2937] p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#8B5CF6] rounded p-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">SignStudio</span>
                </div>
              </div>

              {/* Platform Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Upload</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 mb-3">1. Select type of file you are uploading:</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedFileType('video')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          selectedFileType === 'video' 
                            ? 'bg-[#1F2937] text-white' 
                            : 'bg-white text-gray-600 border hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Video</span>
                      </button>
                      <button 
                        onClick={() => setSelectedFileType('document')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          selectedFileType === 'document' 
                            ? 'bg-[#1F2937] text-white' 
                            : 'bg-white text-gray-600 border hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Document</span>
                      </button>
                      <button 
                        onClick={() => setSelectedFileType('audio')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          selectedFileType === 'audio' 
                            ? 'bg-[#1F2937] text-white' 
                            : 'bg-white text-gray-600 border hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span>Audio</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-3">2. Upload your {selectedFileType} here</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {selectedFileType === 'video' && 'You can upload your video file here and subtitle files on the next stage.'}
                      {selectedFileType === 'document' && 'Upload your document for translation into sign language.'}
                      {selectedFileType === 'audio' && 'Choose to upload an audio file or record live using your microphone.'}
                    </p>
                    
                    {selectedFileType === 'audio' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#A78BFA] hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="p-3 bg-[#A78BFA]/10 rounded-full mb-4">
                              <svg className="w-8 h-8 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Upload Audio</span>
                            <span className="text-xs text-gray-500 mt-1">MP3, WAV up to 50MB</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 ${
                              isRecording 
                                ? 'border-red-400 bg-red-50' 
                                : 'border-gray-200 hover:border-[#A78BFA] hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-3 rounded-full mb-4 ${
                              isRecording ? 'bg-red-100' : 'bg-[#A78BFA]/10'
                            }`}>
                              <svg 
                                className={`w-8 h-8 ${
                                  isRecording ? 'text-red-500' : 'text-[#A78BFA]'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                {isRecording ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                )}
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium">
                              {isRecording ? 'Stop Recording' : 'Record Audio'}
                            </span>
                            {isRecording && (
                              <span className="text-red-500 font-medium mt-1">
                                {formatTime(recordingTime)}
                              </span>
                            )}
                          </motion.button>
                        </div>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileChange}
                          accept="audio/*"
                        />
                      </div>
                    ) : (
                      <div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#A78BFA] hover:bg-gray-50 transition-all duration-200"
                        >
                          <div className="p-3 bg-[#A78BFA]/10 rounded-full mb-4">
                            <svg className="w-8 h-8 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <span className="text-gray-700 font-medium">Upload {selectedFileType}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {selectedFileType === 'video'
                              ? 'MP4, MOV up to 100MB'
                              : 'PDF, DOC, DOCX, TXT up to 10MB'}
                          </span>
                          
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept={selectedFileType === 'video' ? 'video/*' : 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'}
                          />
                        </motion.button>
                      </div>
                    )}
                    
                    {/* File Preview */}
                    {file && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <button 
                            onClick={() => setFile(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Upload button */}
                        <div className="mt-4">
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className={`w-full py-2 rounded-lg text-white font-medium ${isUploading ? 'bg-[#A78BFA]' : 'bg-[#8B5CF6] hover:bg-[#7C3AED]'} transition-colors`}
                          >
                            {isUploading ? 'Uploading...' : 'Upload'}
                          </button>
                          
                          {/* Progress bar */}
                          {isUploading && (
                            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#8B5CF6] transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Error message */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    {/* Success message */}
                    {uploadSuccess && (
                      <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                        File uploaded successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Description */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">SignStudio Platform</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our advanced SignStudio platform allows you to easily upload videos, documents, or audio files for translation into Indian Sign Language (ISL).
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#A78BFA]/10 rounded-lg">
                  <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Video Translation</h3>
                  <p className="text-gray-600">Upload videos to get ISL translations overlaid or side-by-side.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#A78BFA]/10 rounded-lg">
                  <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Document Translation</h3>
                  <p className="text-gray-600">Convert text documents into ISL video format for accessibility.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#A78BFA]/10 rounded-lg">
                  <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Audio Translation</h3>
                  <p className="text-gray-600">Convert speech to ISL in real-time or from recorded audio files.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}