'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'text'
  className?: string
  onClick?: () => void
}

export default function Button({ 
  children, 
  href, 
  variant = 'primary',
  className = '',
  onClick
}: ButtonProps) {
  const baseStyles = "rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center"
  
  const variantStyles = {
    primary: "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2 shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 shadow-sm",
    text: "text-gray-700 hover:text-gray-900 px-4 py-2 hover:scale-105"
  }
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`
  
  // With framer motion animation
  const MotionComponent = motion.div
  
  if (href) {
    return (
      <Link href={href} className={styles}>
        <MotionComponent 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="w-full h-full flex items-center justify-center"
        >
          {children}
        </MotionComponent>
      </Link>
    )
  }
  
  return (
    <button className={styles} onClick={onClick}>
      <MotionComponent 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </MotionComponent>
    </button>
  )
}
