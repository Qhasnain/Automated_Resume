import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = '438131038636-7q0lo7vam38bne94olu4q93ca1u9iogb.apps.googleusercontent.com';

function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const mode = searchParams.get('mode') || 'login'
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const googleBtnRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  useEffect(() => {
    setIsLogin(mode === 'login')
    setError('')
  }, [mode])

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        })
      }
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  // Re-render Google button when mode changes
  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      googleBtnRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
      })
    }
  }, [isLogin])

  const handleGoogleResponse = async (response: any) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/google', { credential: response.credential })
      await login(res.data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { full_name: formData.fullName, email: formData.email, password: formData.password }

      const response = await api.post(endpoint, payload)
      
      await login(response.data.access_token)
      
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* LEFT PANEL - Hidden on mobile, 40% width on md+ */}
      <div className="hidden md:flex flex-col justify-between w-[40%] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-12 text-white relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="bg-white p-2 rounded-xl">
              <Sparkles className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-white">ResumeForge AI</span>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
            Build Your Future <br /> With AI
          </h1>
          
          <p className="text-white/80 text-lg mb-12 max-w-md">
            Create professional, eye-catching resumes in minutes with our intelligent platform.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium">ATS-Optimized Resumes</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium">AI-Powered Writing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium">One-Click Export</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - 100% on mobile, 60% on md+ */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#E2E8F0]"
        >
          {/* Mobile Logo (hidden on desktop) */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Sparkles className="text-primary w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 font-display text-[#0F172A]">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-[#64748B] text-center mb-8">
            {isLogin ? 'Enter your details to access your resumes.' : 'Start engineering your premium resume today.'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <div ref={googleBtnRef} className="flex justify-center [&>div]:!w-full" />
          </div>

          <div className="flex items-center gap-4 mb-6 before:flex-1 before:border-t before:border-[#E2E8F0] after:flex-1 after:border-t after:border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] uppercase tracking-widest font-medium">Or continue with email</span>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="input w-full"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input w-full"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[#0F172A]">Password</label>
                {isLogin && <a href="#" className="text-xs text-[#2563EB] hover:text-blue-700 transition-colors font-medium">Forgot password?</a>}
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input w-full"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 flex justify-center items-center gap-2">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/auth?mode=register" : "/auth?mode=login"} className="text-[#2563EB] hover:text-blue-700 transition-colors font-medium">
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
