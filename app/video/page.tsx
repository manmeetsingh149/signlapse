'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function VideoTranslation() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ rotate: 20 }}
                className="bg-[#A78BFA] p-2 rounded-xl"
              >
                <Image 
                  src="/images/hand-icon.svg"
                  alt="Hand Icon" 
                  width={32} 
                  height={32}
                  className="brightness-0 invert"
                />
              </motion.div>
              <span className="ml-2 text-xl font-bold text-gray-900">Signapse</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* How it Works Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Video Translation</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How it Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Video</h3>
                    <p className="text-gray-600">Upload any video file in MP4 format. Our system supports videos up to 10 minutes in length.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI Processing</h3>
                    <p className="text-gray-600">Our advanced AI system analyzes the video content, extracts speech, and generates accurate ISL translations in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Download Result</h3>
                    <p className="text-gray-600">Get your translated video with synchronized ISL signs. The output includes both the original video and ISL translation.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Video Upload Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Video</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-gray-600">
                  <p className="text-lg font-medium">Video Upload Coming Soon</p>
                  <p className="mt-2">This is a placeholder for the video upload feature.</p>
                  <p className="mt-1 text-sm text-gray-500">Supported formats: MP4 up to 10 minutes</p>
                </div>
                <button disabled className="mt-4 px-6 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed">
                  Upload Feature Coming Soon
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
} 