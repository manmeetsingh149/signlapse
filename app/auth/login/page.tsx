'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    
    // Check hardcoded credentials directly
    if (email === 'signlapse@dtu.ac.in' && password === 'admin123') {
      // Set auth state
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userName', 'Admin')
      
      // Set cookie
      Cookies.set('isLoggedIn', 'true', { expires: 7 })
      
      // Navigate to dashboard after brief delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      setError('Invalid email or password')
      setIsLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const rotateVariants = {
    initial: { rotateY: 0 },
    animate: {
      rotateY: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* 3D Decorative Elements */}
        <div className="absolute -top-20 -left-20 opacity-70 pointer-events-none">
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-primary opacity-20"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        
        <div className="absolute top-40 -right-16 opacity-70 pointer-events-none">
          <motion.div
            className="w-32 h-32 rounded-full bg-primary opacity-20"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
          />
        </div>

        <div className="absolute -bottom-10 left-20 opacity-70 pointer-events-none">
          <motion.div 
            className="w-24 h-24 rounded-full bg-primary opacity-20"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 2 }}
          />
        </div>

        {/* 3D Rotating Element */}
        <motion.div 
          className="absolute -z-10 opacity-10 w-full h-full pointer-events-none"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="w-full h-full border-4 border-primary rounded-xl"
            variants={rotateVariants}
            initial="initial"
            animate="animate"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ rotate: 20 }}
                className="bg-primary p-2 rounded-xl inline-flex mb-2"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" fill="white"/>
                  <path d="M19.071 4.929C17.9447 3.80276 16.4884 3.04766 14.9116 2.76816C13.3349 2.48867 11.7142 2.69645 10.2739 3.36313C8.83367 4.02981 7.63605 5.12825 6.83447 6.50747C6.03288 7.88668 5.66277 9.48186 5.77103 11.0872C5.87929 12.6925 6.46076 14.2297 7.43799 15.4795C8.41521 16.7293 9.73712 17.6281 11.2307 18.0466C12.7242 18.465 14.3137 18.3817 15.7553 17.8107C17.1969 17.2396 18.4168 16.2144 19.22 14.89" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-secondary mt-2">Signlapse</h2>
            </Link>
            <h2 className="mt-4 text-3xl font-extrabold text-secondary">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-dark">
              Or{' '}
              <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
                create a new account
              </Link>
            </p>
          </motion.div>

          <motion.form variants={itemVariants} className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/10 border border-error text-error rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            
            <div className="rounded-md -space-y-px">
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.02, z: 20 }}
                whileTap={{ scale: 0.98 }}
              >
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, z: 20 }}
                whileTap={{ scale: 0.98 }}
              >
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Sign in
              </button>
            </motion.div>
            
            {/* Demo login info */}
            <div className="mt-4 text-center text-sm text-gray-medium border-t border-gray-100 pt-4">
              <p>Demo Access:</p>
              <p className="font-medium text-primary">signlapse@dtu.ac.in / admin123</p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}