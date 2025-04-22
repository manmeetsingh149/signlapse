'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface NavbarProps {
  onScrollToSection?: (sectionId: string) => void
}

export default function Navbar({ onScrollToSection }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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
            <span className="text-xl font-semibold text-gray-900">Signapse</span>
          </Link>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => onScrollToSection && onScrollToSection('process')}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => onScrollToSection && onScrollToSection('mission')}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Our mission
            </button>
            <Link 
              href="/signapse-extension.zip"
              className="border border-[#8B5CF6] text-[#8B5CF6] px-4 py-2 rounded-lg hover:bg-[#8B5CF6] hover:text-white transition-colors"
              download="signapse-extension.zip"
            >
              Get Extension
            </Link>
            <Link 
              href="/auth/login"
              className="bg-[#8B5CF6] text-white px-5 py-2.5 rounded-lg hover:bg-[#7C3AED] transition-colors font-medium shadow-md"
              prefetch={true}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}