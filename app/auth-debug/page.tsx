'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function AuthDebugPage() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  const [cookieData, setCookieData] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Get localStorage data
    const lsData: Record<string, string> = {}
    
    try {
      if (typeof window !== 'undefined') {
        // Check isLoggedIn specifically
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        lsData['isLoggedIn'] = isLoggedIn || 'null'
        
        // Check userName
        const userName = localStorage.getItem('userName')
        lsData['userName'] = userName || 'null'
      }
    } catch (e) {
      lsData['error'] = String(e)
    }
    
    setLocalStorageData(lsData)
    
    // Get cookie data
    const cookieObj: Record<string, string> = {}
    
    try {
      // Get isLoggedIn cookie
      const isLoggedInCookie = Cookies.get('isLoggedIn')
      cookieObj['isLoggedIn'] = isLoggedInCookie || 'null'
      
      // Get all cookies for debugging
      const allCookies = Cookies.get()
      Object.keys(allCookies).forEach(key => {
        cookieObj[key] = allCookies[key]
      })
    } catch (e) {
      cookieObj['error'] = String(e)
    }
    
    setCookieData(cookieObj)
    setLoaded(true)
  }, [])

  const clearStorage = () => {
    try {
      localStorage.clear()
      Object.keys(Cookies.get()).forEach(key => {
        Cookies.remove(key)
      })
      window.location.reload()
    } catch (e) {
      console.error('Error clearing storage:', e)
    }
  }

  const forceClearAll = async () => {
    try {
      // Clear client-side storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      Object.keys(Cookies.get()).forEach(key => {
        Cookies.remove(key)
        // Also try removing with different paths
        Cookies.remove(key, { path: '/' })
        Cookies.remove(key, { path: '/dashboard' })
        Cookies.remove(key, { path: '/auth' })
      })
      
      // Call server logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }).catch(err => console.error('Error calling logout API:', err))
      
      // Add a status indicator
      setLocalStorageData({ ...localStorageData, cleared: 'true' })
      setCookieData({ ...cookieData, cleared: 'true' })
      
      // Reload after 1 second
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 1000)
    } catch (e) {
      console.error('Error force clearing:', e)
      alert('Error clearing data: ' + e)
    }
  }

  if (!loaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md max-h-60 overflow-auto">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cookie Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md max-h-60 overflow-auto">
            {JSON.stringify(cookieData, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <button 
          onClick={clearStorage}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Clear All Storage
        </button>
        
        <button 
          onClick={forceClearAll}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Force Clear All
        </button>
        
        <div className="mt-6 space-x-4">
          <Link 
            href="/auth/login" 
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg"
          >
            Go to Login
          </Link>
          
          <Link 
            href="/dashboard" 
            className="bg-secondary hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            href="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 