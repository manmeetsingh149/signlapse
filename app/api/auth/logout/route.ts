import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().set({
      name: 'isLoggedIn',
      value: '',
      httpOnly: false,
      path: '/',
      maxAge: 0, // Expire immediately
      sameSite: 'lax'
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    })
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred during logout' 
    }, { status: 500 })
  }
} 