'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-surface/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold gradient-text">
            SignLapse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="nav-link">
              Products
            </Link>
            <Link href="/pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="/case-studies" className="nav-link">
              Case Studies
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <a 
              href="/files/sign-language-extension.zip" 
              download="SignLanguageExtension.zip"
              className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Get Extension
            </a>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-dark hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-surface border-t border-gray-light">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="block px-3 py-2 nav-link"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 nav-link"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/case-studies"
                className="block px-3 py-2 nav-link"
                onClick={() => setIsOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 nav-link"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <a 
                href="/files/sign-language-extension.zip" 
                download="SignLanguageExtension.zip"
                className="block px-3 py-2 text-accent hover:text-accent/80 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Get Extension
              </a>
              <Link
                href="/contact"
                className="block px-3 py-2 text-primary hover:text-primary-dark"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 