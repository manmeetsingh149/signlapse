'use client'

import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  backgroundColor?: string
  containerClassName?: string
  animate?: boolean
}

export default function Section({
  id,
  children,
  className = '',
  backgroundColor = 'bg-white',
  containerClassName = 'container mx-auto px-6 py-20',
  animate = true
}: SectionProps) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-100px" 
  })
  
  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={`${backgroundColor} ${className}`}
    >
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: isInView ? 1 : 0, 
            y: isInView ? 0 : 50 
          }}
          transition={{ duration: 0.7 }}
          className={containerClassName}
        >
          {children}
        </motion.div>
      ) : (
        <div className={containerClassName}>
          {children}
        </div>
      )}
    </section>
  )
}
