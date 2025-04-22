'use client'

import { motion } from 'framer-motion'
import { useInView, UseInViewOptions } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  highlightWords?: number
  delay?: number
  highlightClassName?: string
  viewMargin?: UseInViewOptions['margin']
}

export default function AnimatedText({
  text,
  className = '',
  once = true,
  highlightWords = 0,
  delay = 0.1,
  highlightClassName = 'text-gray-900',
  viewMargin = "-100px",
}: AnimatedTextProps) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { 
    once: once,
    margin: viewMargin
  })
  
  const words = text.split(' ')
  
  return (
    <div ref={containerRef} className={className}>
      {words.map((word, index) => {
        const isHighlighted = index < highlightWords
        
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isInView ? 1 : 0, 
              y: isInView ? 0 : 20 
            }}
            transition={{ 
              duration: 0.5,
              delay: index * delay
            }}
            className={`inline-block mr-[0.2em] ${
              isHighlighted ? highlightClassName : 'text-gray-400'
            }`}
          >
            {word}
          </motion.span>
        )
      })}
    </div>
  )
}
