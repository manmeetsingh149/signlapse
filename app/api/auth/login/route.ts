import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Check credentials
    if (email === 'signlapse@dtu.ac.in' && password === 'admin123') {
      // Set authentication cookie
      cookies().set({
        name: 'isLoggedIn',
        value: 'true',
        httpOnly: false, // Need this to be false so it's accessible via JavaScript
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax'
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred' 
    }, { status: 500 })
  }
} 