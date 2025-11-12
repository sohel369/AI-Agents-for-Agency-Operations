import { useEffect, useState } from 'react'
import { X, Sparkles, CheckCircle, PartyPopper } from 'lucide-react'

const CongratulationsModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    // Trigger animations
    setTimeout(() => setIsVisible(true), 100)
    setTimeout(() => setShowConfetti(true), 300)

    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                color: ['#0ea5e9', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][
                  Math.floor(Math.random() * 6)
                ],
              }}
            >
              <PartyPopper className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 md:p-8 transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative p-4 sm:p-5 md:p-6 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 shadow-2xl transform animate-bounce">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-2">
              🎉 Congratulations!
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-primary-600 dark:text-primary-400">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-base sm:text-lg font-semibold">Welcome to AI Automation Suite</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-2">
            You've successfully set up your account! Your AI agents are ready to help streamline
            your operations and boost productivity.
          </p>

          {/* Features List */}
          <div className="space-y-2 sm:space-y-3 text-left bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Customer Support Agent activated
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Data Analytics Agent ready
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Marketing Automation enabled
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}

export default CongratulationsModal

