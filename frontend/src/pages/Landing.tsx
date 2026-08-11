import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wand2, CheckCircle2, FileText, Download, Target, Briefcase, 
  ChevronDown, Star, Sparkles, LayoutTemplate, Bot, Shield,
  ArrowRight, Menu, X, Cpu, BarChart, PenTool
} from 'lucide-react';
import { cn } from '../utils/cn';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Will my resume pass Applicant Tracking Systems (ATS)?",
      answer: "Yes, our resumes are specifically formatted and structured to be 100% readable by modern ATS software used by Fortune 500 companies."
    },
    {
      question: "How does the AI writing assistant work?",
      answer: "Our AI is trained on millions of successful resumes. It analyzes your job title and brief experience, then generates professional, action-oriented bullet points tailored to your industry."
    },
    {
      question: "Is there a free version available?",
      answer: "Yes! You can build and download your first resume completely free. We also offer Pro and Enterprise plans for advanced features like AI generation and unlimited resumes."
    },
    {
      question: "What formats can I export my resume in?",
      answer: "You can download your resume as a perfectly formatted PDF, which is the industry standard and recommended for all job applications to preserve formatting."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data. We never sell your personal information to third parties."
    }
  ];

  const features = [
    { icon: <Bot className="w-6 h-6 text-blue-600" />, title: "AI Resume Writer", desc: "Generate tailored bullet points and summaries instantly with advanced AI." },
    { icon: <Target className="w-6 h-6 text-blue-600" />, title: "ATS Optimization", desc: "Ensure your resume gets past the robots with ATS-friendly formatting." },
    { icon: <LayoutTemplate className="w-6 h-6 text-blue-600" />, title: "Real-time Preview", desc: "See your resume update instantly in a beautiful, professional format as you type." },
    { icon: <Download className="w-6 h-6 text-blue-600" />, title: "One-Click Export", desc: "Download as a pixel-perfect PDF ready for your next application." },
    { icon: <Briefcase className="w-6 h-6 text-blue-600" />, title: "Job Matching", desc: "Compare your resume against any job description to see what's missing." },
    { icon: <PenTool className="w-6 h-6 text-blue-600" />, title: "Cover Letters", desc: "Automatically generate matching cover letters for your applications." }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* 1. STICKY GLASS NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight">ResumeForge AI</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/auth?mode=login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
              <Link to="/auth?mode=register" className="btn-primary px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200"
            >
              <div className="px-4 pt-2 pb-4 space-y-3">
                <a href="#features" className="block text-base font-medium text-slate-600">Features</a>
                <a href="#pricing" className="block text-base font-medium text-slate-600">Pricing</a>
                <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                  <Link to="/auth?mode=login" className="block text-center text-base font-medium text-slate-600 py-2">Login</Link>
                  <Link to="/auth?mode=register" className="block text-center text-base font-medium bg-blue-600 text-white rounded-lg py-2">Get Started Free</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">ResumeForge AI 2.0 is now live</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Build Resumes That <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Get You Hired</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
              Create professional, ATS-optimized resumes in minutes with our advanced AI writing assistant. Stand out from the crowd and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth?mode=register" className="btn-primary w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 mx-auto max-w-5xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="bg-slate-50 border-r border-slate-200 w-full md:w-64 p-4 flex flex-col gap-4 hidden md:flex">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3 mt-4"></div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-2 bg-slate-200 rounded w-2/3"></div>
              </div>
              <div className="flex-1 p-8 bg-white flex flex-col items-center">
                {/* A4 Resume Representation */}
                <div className="w-full max-w-md aspect-[1/1.4] bg-white border border-slate-200 shadow-sm rounded p-6 flex flex-col gap-4">
                  <div className="border-b border-slate-200 pb-4 text-center">
                    <div className="h-6 bg-slate-800 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-2 bg-slate-400 rounded w-1/3 mx-auto"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-3 bg-blue-600 rounded w-1/4 mb-1"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="h-3 bg-blue-600 rounded w-1/4 mb-1"></div>
                    <div className="flex justify-between items-end mb-1">
                      <div className="h-2 bg-slate-800 rounded w-1/3"></div>
                      <div className="h-2 bg-slate-400 rounded w-1/4"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TRUSTED BY SECTION */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Using text representation for logos as requested */}
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800">Google</span>
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800">Microsoft</span>
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800">Amazon</span>
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800">Meta</span>
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800">Apple</span>
            <span className="font-display font-bold text-xl md:text-2xl text-slate-800 text-red-600">NETFLIX</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Powerful features designed to help you create the perfect resume and land more interviews.</p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn} className="card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-500">Three simple steps to your new professional resume.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: 1, title: "Fill Details", desc: "Enter your basic info and experience." },
                { step: 2, title: "AI Generates", desc: "Our AI optimizes your content." },
                { step: 3, title: "Download & Apply", desc: "Export as PDF and start applying." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center bg-white md:bg-transparent p-6 md:p-0 rounded-2xl shadow-sm md:shadow-none border border-slate-100 md:border-none"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg ring-4 ring-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI SECTION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center space-x-2 text-blue-600 font-semibold mb-4">
                <Wand2 className="w-5 h-5" />
                <span>Powered by AI</span>
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                AI That Writes Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pro</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Stop struggling with writer's block. Our AI analyzes your job title and generates impactful, measurable bullet points that highlight your achievements.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Generates action-oriented bullet points",
                  "Suggests relevant industry keywords",
                  "Fixes grammar and tone automatically",
                  "Tailors content to specific job descriptions"
                ].map((point, i) => (
                  <li key={i} className="flex items-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 relative z-10"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                    <PenTool className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Generating</span>
                </div>
                <div className="space-y-3 font-mono text-sm text-slate-700">
                  <p className="text-slate-400">Prompt: Write bullet points for Software Engineer focusing on React and performance.</p>
                  <p className="border-l-2 border-blue-500 pl-4 py-2 bg-slate-50">
                    • Spearheaded the migration of legacy frontend to React 18, improving page load speeds by 40% and user retention by 15%.<br/><br/>
                    • Implemented virtualized lists and lazy loading, reducing initial bundle size by 2.5MB.
                  </p>
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full blur-3xl -z-10 opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ATS SECTION */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-lg font-semibold text-slate-200">ATS Match Score</h4>
                  <div className="flex items-center space-x-1 text-green-400">
                    <Shield className="w-5 h-5" />
                    <span className="font-bold">Optimized</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" className="stroke-slate-700" strokeWidth="8" fill="none" />
                      <motion.circle 
                        cx="64" cy="64" r="60" 
                        className="stroke-green-500" 
                        strokeWidth="8" fill="none"
                        strokeDasharray="377"
                        initial={{ strokeDashoffset: 377 }}
                        whileInView={{ strokeDashoffset: 377 * 0.15 }} // 85%
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold">85%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Keyword Match", status: "High", color: "text-green-400" },
                    { label: "Formatting", status: "Perfect", color: "text-green-400" },
                    { label: "Readability", status: "Good", color: "text-blue-400" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <span className="text-slate-300">{item.label}</span>
                      <span className={`font-semibold ${item.color} flex items-center`}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center space-x-2 text-blue-400 font-semibold mb-4">
                <Cpu className="w-5 h-5" />
                <span>ATS Optimization</span>
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Beat Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ATS</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Did you know 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them? Our templates are engineered to parse perfectly every time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mt-1 mr-3 bg-blue-500/20 p-1 rounded text-blue-400"><CheckCircle2 className="w-4 h-4" /></div>
                  <p className="text-slate-300"><strong className="text-white font-semibold">Clean Formatting:</strong> No complex tables or hidden characters that break parsers.</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 bg-blue-500/20 p-1 rounded text-blue-400"><CheckCircle2 className="w-4 h-4" /></div>
                  <p className="text-slate-300"><strong className="text-white font-semibold">Standardized Headers:</strong> Sections that ATS algorithms instantly recognize.</p>
                </li>
                <li className="flex items-start">
                  <div className="mt-1 mr-3 bg-blue-500/20 p-1 rounded text-blue-400"><CheckCircle2 className="w-4 h-4" /></div>
                  <p className="text-slate-300"><strong className="text-white font-semibold">Keyword Density:</strong> AI ensures you naturally hit the required keywords.</p>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by job seekers</h2>
            <p className="text-lg text-slate-500">Join thousands who landed their dream jobs using ResumeForge AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Product Manager", company: "TechCorp", quote: "I was struggling to get interviews for months. Used this AI builder, updated my resume in 20 mins, and got 3 interviews the next week." },
              { name: "David Chen", role: "Frontend Developer", company: "StartupX", quote: "The ATS optimization feature is a game changer. It perfectly formatted my diverse experience into a clean, professional template." },
              { name: "Emily Rodriguez", role: "Marketing Director", company: "GlobalMedia", quote: "The AI suggestions were incredibly accurate. It helped me rephrase my achievements to sound significantly more impactful." }
            ].map((testimonial, i) => (
              <div key={i} className="card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">Choose the plan that fits your career goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Perfect for trying out our basic features.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> 1 Resume</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Basic Templates</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> PDF Export</li>
                <li className="flex items-center text-sm text-slate-400"><X className="w-5 h-5 mr-3" /> AI Writing Assistant</li>
              </ul>
              <Link to="/register" className="btn-secondary w-full py-3 text-center rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Get Started</Link>
            </div>

            {/* Pro */}
            <div className="card bg-white rounded-2xl border-2 border-blue-600 p-8 flex flex-col relative shadow-xl transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$12</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Everything you need to land interviews fast.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Unlimited Resumes</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Premium Templates</li>
                <li className="flex items-center text-sm text-slate-700 font-semibold"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Full AI Writing Assistant</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> ATS Score Checking</li>
              </ul>
              <Link to="/register" className="btn-primary w-full py-3 text-center rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700 transition-colors shadow-md">Upgrade to Pro</Link>
            </div>

            {/* Enterprise / Lifetime */}
            <div className="card bg-white rounded-2xl border border-slate-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lifetime</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$29</span>
                <span className="text-slate-500">/once</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">Pay once, use forever. Best value.</p>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Everything in Pro</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Cover Letter Builder</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Priority Support</li>
                <li className="flex items-center text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3" /> Early Access Features</li>
              </ul>
              <Link to="/register" className="btn-secondary w-full py-3 text-center rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Get Lifetime</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-slate-600 border-t border-slate-100 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-xl text-slate-900 tracking-tight">ResumeForge</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Build professional, ATS-friendly resumes in minutes with the power of AI. Land your dream job faster.
              </p>
              <div className="flex space-x-4">
                {/* Social placeholders */}
                <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Cover Letter Builder</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Resume Examples</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Career Blog</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">How to Write a Resume</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              <span>Made with ❤️ for job seekers</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
