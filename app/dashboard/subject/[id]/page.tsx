'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

// Subject data with random class attendance
const subjects = {
  'english': {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: 'bg-blue-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30,
    description: 'Learn English language with sign language integration. Master vocabulary, grammar, and communication skills.',
    teacherName: 'Mrs. Sarah Johnson',
    nextClass: 'Monday, 10:00 AM'
  },
  'hindi': {
    id: 'hindi',
    name: 'Hindi',
    icon: '🔤',
    color: 'bg-orange-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30,
    description: 'Explore Hindi language through sign language. Develop reading, writing, and conversation abilities.',
    teacherName: 'Mr. Rajesh Sharma',
    nextClass: 'Wednesday, 11:30 AM'
  },
  'science': {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    color: 'bg-green-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30,
    description: 'Discover the wonders of science with accessible sign language explanations of key scientific concepts.',
    teacherName: 'Dr. Michael Chen',
    nextClass: 'Tuesday, 9:15 AM'
  },
  'maths': {
    id: 'maths',
    name: 'Maths',
    icon: '🔢',
    color: 'bg-purple-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30,
    description: 'Master mathematical concepts through visual sign language instruction. From algebra to geometry and beyond.',
    teacherName: 'Ms. Jessica Miller',
    nextClass: 'Thursday, 1:00 PM'
  },
  'social-science': {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: 'bg-red-500',
    classesAttended: Math.floor(Math.random() * 20) + 5,
    totalClasses: 30,
    description: 'Explore history, geography, civics and economics with inclusive sign language instruction methods.',
    teacherName: 'Mr. David Wilson',
    nextClass: 'Friday, 10:45 AM'
  }
}

export default function SubjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [userName, setUserName] = useState('User')
  
  // Get subject data
  const subject = subjects[params.id as keyof typeof subjects]
  
  // If subject doesn't exist, redirect to dashboard
  useEffect(() => {
    if (!subject) {
      router.push('/dashboard')
    }
    
    // Get username from localStorage
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
    }
  }, [subject, router])
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    Cookies.remove('isLoggedIn')
    
    // Navigate back to login
    router.push('/auth/login')
  }
  
  // Generate random past classes data
  const generateClassData = () => {
    const classes = []
    for (let i = 1; i <= subject.classesAttended; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (i * 2))
      classes.push({
        id: i,
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        topic: `${subject.name} - Chapter ${Math.floor(Math.random() * 10) + 1}`,
        attended: Math.random() > 0.1 // 90% chance of having attended
      })
    }
    return classes
  }
  
  const classData = generateClassData()

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

  if (!subject) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header section */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
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
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/video" className="nav-link">Videos</Link>
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
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Subject Header */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-secondary">{subject.name} Class</h1>
          </div>

          {/* Subject Overview */}
          <motion.div 
            variants={itemVariants}
            className={`${subject.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{subject.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{subject.name}</h2>
                <p className="opacity-80">Teacher: {subject.teacherName}</p>
              </div>
            </div>
            <p className="mb-6">{subject.description}</p>
            
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Class Attendance</h3>
              <div className="flex justify-between mb-2">
                <span>Classes Attended:</span>
                <span className="font-medium">{subject.classesAttended} / {subject.totalClasses}</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 mb-1">
                <div 
                  className="bg-white h-2 rounded-full" 
                  style={{width: `${(subject.classesAttended / subject.totalClasses) * 100}%`}}
                ></div>
              </div>
              <p className="text-sm opacity-80">
                Attendance Rate: {Math.round((subject.classesAttended / subject.totalClasses) * 100)}%
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Next Class</p>
                <p>{subject.nextClass}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="http://127.0.0.1:5050/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-secondary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors text-lg"
                >
                  Enter Classroom
                </a>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Class History */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-secondary mb-4">Class History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2 text-left text-gray-dark">Date</th>
                    <th className="py-3 px-2 text-left text-gray-dark">Topic</th>
                    <th className="py-3 px-2 text-left text-gray-dark">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.map(classItem => (
                    <tr key={classItem.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">{classItem.date}</td>
                      <td className="py-3 px-2">{classItem.topic}</td>
                      <td className="py-3 px-2">
                        {classItem.attended ? (
                          <span className="text-green-500 font-medium flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Attended
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Missed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Enter Classroom Button (Large Mobile-Friendly Version) */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 text-center md:hidden"
          >
            <h3 className="text-xl font-bold text-secondary mb-4">Ready for Class?</h3>
            <a 
              href="http://127.0.0.1:5050/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-colors text-lg"
            >
              Enter Classroom
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
} 