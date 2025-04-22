'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'

interface Slide {
  title: string
  description: string
  image: string
}

interface AnimatedHeroProps {
  slides: Slide[]
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export default function AnimatedHero({
  slides,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}: AnimatedHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3FF]/10 via-[#F5F3FF]/5 to-[#F5F3FF]/0 z-20" />
        
        {/* Images */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1
              }}
              transition={{ 
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1]
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
            className="mb-12"
          >
            <div className="flex flex-col gap-8">
              <h1 className="text-7xl leading-tight font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent drop-shadow-sm max-w-4xl">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl text-gray-800 max-w-2xl">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {(primaryButtonText || secondaryButtonText) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-4 mt-12"
          >
            {primaryButtonText && primaryButtonLink && (
              <Button href={primaryButtonLink} variant="primary">
                {primaryButtonText}
              </Button>
            )}
            
            {secondaryButtonText && secondaryButtonLink && (
              <Button href={secondaryButtonLink} variant="secondary">
                {secondaryButtonText}
              </Button>
            )}
          </motion.div>
        )}

        {/* Slide indicators */}
        <div className="flex space-x-2 mt-6">
          {slides.map((_, index) => (
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
