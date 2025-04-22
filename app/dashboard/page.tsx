'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

// Subject data with random class attendance
const subjects = [
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: 'bg-blue-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30
  },
  {
    id: 'hindi',
    name: 'Hindi',
    icon: '🔤',
    color: 'bg-orange-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    color: 'bg-green-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30
  },
  {
    id: 'maths',
    name: 'Maths',
    icon: '🔢',
    color: 'bg-purple-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30
  },
  {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: 'bg-red-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30
  }
]

export default function Dashboard() {
  const [userName, setUserName] = useState('User')
  const router = useRouter()
  
  // Statistics data
  const [stats, setStats] = useState({
    translations: 24,
    favorites: 12,
    recentActivity: 8,
    progress: 65
  })
  
  // Get username from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
  }, [])
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    Cookies.remove('isLoggedIn')
    
    // Navigate back to login
    router.push('/auth/login')
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header section */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl inline-flex">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" fill="white"/>
                <path d="M19.071 4.929C17.9447 3.80276 16.4884 3.04766 14.9116 2.76816C13.3349 2.48867 11.7142 2.69645 10.2739 3.36313C8.83367 4.02981 7.63605 5.12825 6.83447 6.50747C6.03288 7.88668 5.66277 9.48186 5.77103 11.0872C5.87929 12.6925 6.46076 14.2297 7.43799 15.4795C8.41521 16.7293 9.73712 17.6281 11.2307 18.0466C12.7242 18.465 14.3137 18.3817 15.7553 17.8107C17.1969 17.2396 18.4168 16.2144 19.22 14.89" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-secondary">Signlapse Dashboard</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/video" className="nav-link">Videos</Link>
              <Link href="/audio" className="nav-link">Audio</Link>
              <Link href="/upload" className="nav-link">Upload</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-secondary">Welcome, {userName}</p>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Logout
                </button>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {userName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main dashboard content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome card */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-primary rounded-xl p-6 text-white shadow-lg"
          >
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="mb-4">Please select a subject to continue your learning.</p>
          </motion.div>
          
          {/* Subjects Grid */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Your Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  variants={itemVariants} 
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className={`${subject.color} p-4 flex items-center justify-between`}>
                    <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                    <span className="text-3xl">{subject.icon}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-dark">Classes Attended:</span>
                      <span className="font-medium">{subject.classesAttended} / {subject.totalClasses}</span>
                    </div>
                    <div className="w-full bg-gray-light rounded-full h-2 mb-4">
                      <div 
                        className={`${subject.color} h-2 rounded-full`} 
                        style={{width: `${(subject.classesAttended / subject.totalClasses) * 100}%`}}
                      ></div>
                    </div>
                    <Link 
                      href={`/dashboard/subject/${subject.id}`}
                      className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-2 rounded-lg transition-colors font-medium"
                    >
                      View Subject
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 