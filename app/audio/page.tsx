'use client'

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AudioTranslation() {
  // Create refs for scroll animations
  const titleRef = useRef(null);
  const howItWorksRef = useRef(null);
  const uploadSectionRef = useRef(null);
  
  // Check if sections are in view
  const isTitleVisible = useInView(titleRef, { once: true, margin: "-100px" });
  const isHowItWorksVisible = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const isUploadSectionVisible = useInView(uploadSectionRef, { once: true, margin: "-100px" });
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
          <motion.section 
            ref={howItWorksRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: isHowItWorksVisible ? 1 : 0, 
              y: isHowItWorksVisible ? 0 : 50 
            }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <motion.h1 
              ref={titleRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isTitleVisible ? 1 : 0, 
                y: isTitleVisible ? 0 : 30 
              }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-8"
            >
              Audio Translation
            </motion.h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How it Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Audio</h3>
                    <p className="text-gray-600">Upload any audio file in MP3 or WAV format. Our system supports audio clips up to 10 minutes in length.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI Processing</h3>
                    <p className="text-gray-600">Our advanced AI system analyzes the audio content, extracts speech, and generates accurate ISL translations in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                    <span className="text-[#8B5CF6] font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Download Result</h3>
                    <p className="text-gray-600">Get your translated audio with synchronized ISL signs. The output includes both the original audio and ISL translation.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Audio Upload Section */}
          <motion.section 
            ref={uploadSectionRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: isUploadSectionVisible ? 1 : 0, 
              y: isUploadSectionVisible ? 0 : 50 
            }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Your Audio</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="text-gray-600">
                  <p className="text-lg font-medium">Audio Upload Coming Soon</p>
                  <p className="mt-2">This is a placeholder for the audio upload feature.</p>
                  <p className="mt-1 text-sm text-gray-500">Supported formats: MP3 or WAV up to 10 minutes</p>
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