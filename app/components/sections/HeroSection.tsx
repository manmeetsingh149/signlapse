'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Slide {
  title: string
  description: string
  image: string
}

interface HeroSectionProps {
  slides?: Slide[]
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const defaultSlides = [
    {
      title: "Indian Sign Language (ISL) Train Announcements",
      description: "Making train travel accessible for the Deaf community",
      image: "/images/optimized/slide1.jpg"
    },
    {
      title: "Real-time ISL Translation",
      description: "Instant translation of announcements into ISL",
      image: "/images/optimized/slide2.jpg"
    }
  ]

  const slidesToUse = slides || defaultSlides

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToUse.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slidesToUse.length])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3FF]/10 via-[#F5F3FF]/5 to-[#F5F3FF]/0 z-20" />
        
        {/* Images */}
        <div className="absolute inset-0">
          {slidesToUse.map((slide, index) => (
            <motion.div
              key={slide.image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1,
                filter: index === currentSlide ? 'blur(0px)' : 'blur(8px)'
              }}
              transition={{ 
                duration: 2.5,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 1.8 },
                scale: { duration: 3.0 },
                filter: { duration: 2.0 }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: index === currentSlide ? 10 : 0
              }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                quality={75}
                sizes="100vw"
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-30 container mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-left"
          >
            <div className="flex flex-col gap-8">
              <h1 className="text-7xl leading-tight font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent drop-shadow-sm max-w-4xl">
                Sign Language Translation
              </h1>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-4 mt-12 justify-start"
        >
          <Link href="/video">
            <motion.button
              className={`px-6 py-2 rounded-lg shadow-sm ${
                currentSlide === 0 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'bg-white text-gray-800 hover:bg-white/90 transition-colors'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Video Translation
            </motion.button>
          </Link>
          <Link href="http://127.0.0.1:5000">
            <motion.button
              className={`px-6 py-2 rounded-lg shadow-sm ${
                currentSlide === 1 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'bg-white text-gray-800 hover:bg-white/90 transition-colors'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Audio Translation
            </motion.button>
          </Link>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex space-x-2 mt-6">
          {slidesToUse.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-[#8B5CF6]' : 'bg-gray-400/30'
              }`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}