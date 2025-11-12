import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Menu,
  X
} from 'lucide-react'

const Introduction = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Customer Support',
      description: 'Intelligent chatbots that provide 24/7 customer assistance with natural language understanding.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Data Analytics Agent',
      description: 'Advanced analytics and insights powered by AI to make data-driven decisions effortlessly.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Megaphone,
      title: 'Marketing Automation',
      description: 'Automate your marketing campaigns with AI-generated content and smart recommendations.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data and compliance-ready infrastructure.',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const benefits = [
    { icon: Zap, text: '10x Faster Response Times' },
    { icon: TrendingUp, text: '95% Customer Satisfaction' },
    { icon: Users, text: '24/7 Automated Support' },
    { icon: Clock, text: 'Save 40+ Hours Weekly' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 dark:opacity-20 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(14, 165, 233, 0.15), transparent 50%)`,
        }}
      />

      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-400/20 dark:bg-primary-500/10 animate-pulse"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav ref={mobileMenuRef} className="relative z-50 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              <span className="hidden sm:inline">AI Automation Suite</span>
              <span className="sm:hidden">AI Suite</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 lg:px-6 py-2 lg:py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs sm:text-sm font-medium text-primary-700 dark:text-primary-300">
                Powered by Advanced AI
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight px-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Transform Your Agency
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                with AI Automation
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Streamline operations, enhance customer experience, and scale your business with intelligent AI agents
              that work around the clock.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4">
              <Link
                to="/signup"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-base sm:text-lg shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base sm:text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
              >
                View Demo
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-4xl mx-auto px-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
                >
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Everything you need to automate and optimize your agency operations
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-transparent shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient border effect on hover */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
                
                <div className={`inline-flex p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} mb-3 sm:mb-4 shadow-lg`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 sm:p-10 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">99.9%</div>
                <div className="text-primary-100 text-base sm:text-lg">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-primary-100 text-base sm:text-lg">Active Users</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-primary-100 text-base sm:text-lg">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 p-8 sm:p-10 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-4">
              Join thousands of agencies already using AI Automation Suite to transform their operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link
                to="/signup"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-lg hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-center"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm sm:text-base">© 2024 AI Automation Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Introduction

