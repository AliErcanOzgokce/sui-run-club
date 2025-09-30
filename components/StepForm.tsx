"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import confetti from "canvas-confetti"

export default function StepForm() {
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    suiAddress: "",
    sbtNumber: ""
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({ show: false, type: 'success', message: '' })
  const [hasAlreadyMinted, setHasAlreadyMinted] = useState(false)

  // Check if user has already minted (both on session change and page refresh)
  useEffect(() => {
    if (session?.user?.name) {
      const mintedUsers = JSON.parse(localStorage.getItem('mintedUsers') || '[]')
      if (mintedUsers.includes(session.user.name)) {
        setHasAlreadyMinted(true)
      } else {
        setHasAlreadyMinted(false)
      }
    } else {
      setHasAlreadyMinted(false)
    }
  }, [session])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' })
    }, 4000)
  }

  const triggerConfetti = () => {
    // Play success sound
    const audioContext = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Create a pleasant success melody
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#059669', '#047857', '#065F46']
    })
  }

  const handleDisconnect = () => {
    signOut({ callbackUrl: '/' })
  }



  const handleNext = () => {
    // Don't allow navigation if user has already minted
    if (hasAlreadyMinted) {
      return
    }
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  const handlePrev = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
      setIsAnimating(false)
    }, 300)
  }


  const handleSuiAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, suiAddress: e.target.value }))
  }

  const handleSbtNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, sbtNumber: e.target.value }))
  }

  const shareOnTwitter = () => {
    const text = `Excited to lace up in Singapore with @SuiRunClub for the #SUIGAPORE4K!
Big thanks to @WalrusProtocol, @CudisWellness, and @SuiCommunity for powering the vibes.

Running together, building together — let’s show what the Sui spirit looks like on the streets of Singapore!`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const claimSBT = async () => {
    // Check if user has already minted
    if (hasAlreadyMinted) {
      showToast('error', 'You have already minted an SBT! Each Twitter account can only mint once.')
      return
    }

    setIsLoading(true)
    
    try {
      // Mint the NFT directly
      const mintResponse = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
            body: JSON.stringify({
              suiAddress: formData.suiAddress,
              sbtNumber: parseInt(formData.sbtNumber)
            })
      })

      if (!mintResponse.ok) {
        const errorData = await mintResponse.json()
        throw new Error(`Failed to mint NFT: ${errorData.error || 'Unknown error'}`)
      }

          await mintResponse.json()
          
          // Save user to localStorage to prevent duplicate minting
          if (session?.user?.name) {
            const mintedUsers = JSON.parse(localStorage.getItem('mintedUsers') || '[]')
            if (!mintedUsers.includes(session.user.name)) {
              mintedUsers.push(session.user.name)
              localStorage.setItem('mintedUsers', JSON.stringify(mintedUsers))
              setHasAlreadyMinted(true)
            }
          }
          
          triggerConfetti()
          showToast('success', `Congratulations! You've successfully minted SBT #${parseInt(formData.sbtNumber)}!`)
    } catch (error) {
      console.error('Error claiming SBT:', error)
      showToast('error', 'Failed to claim SBT. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: "Connect with Twitter",
      description: "Sign in with your Twitter account to get started",
      content: (
        <div className="text-center">
          {status === "loading" ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : session ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img src={session.user?.image || ""} alt={session.user?.name || ""} className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Welcome back</h3>
                <p className="text-gray-500 text-sm">{session.user?.name}</p>
              </div>
              <button 
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200" 
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => signIn('twitter')}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <svg
                  aria-label="X logo"
                  width="20"
                  height="20"
                  viewBox="0 0 300 271"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
                  />
                </svg>
                Sign in with X
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Enter SUI Address",
      description: "Add your SUI wallet address to receive rewards",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your SUI Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={formData.suiAddress}
              onChange={handleSuiAddressChange}
            />
          </div>
          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200" 
              onClick={handlePrev}
            >
              Back
            </button>
            <button 
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed" 
              onClick={handleNext}
              disabled={!formData.suiAddress}
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Share on Twitter",
      description: "Share your journey with the community",
      content: (
        <div className="space-y-6 text-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Share Your Journey</h3>
            <p className="text-gray-500 text-sm">
              Let your followers know you're joining Sui Run Club
            </p>
          </div>
          <button 
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-3"
            onClick={shareOnTwitter}
          >
            <svg
              aria-label="X logo"
              width="20"
              height="20"
              viewBox="0 0 300 271"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
              />
            </svg>
            Share on X
          </button>
          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200" 
              onClick={handlePrev}
            >
              Back
            </button>
            <button 
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200" 
              onClick={handleNext}
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Claim Your SBT",
      description: hasAlreadyMinted ? "You have already minted your SBT!" : "Choose your unique SBT number (1-120)",
      content: hasAlreadyMinted ? (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">SBT Already Minted!</h3>
            <p className="text-gray-500 text-sm mb-4">
              You have already claimed your Sui Run Club SBT. Each Twitter account can only mint once.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your SBT Number
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={formData.sbtNumber}
              onChange={handleSbtNumberChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter number between 1-120"
            />
            {formData.sbtNumber && parseInt(formData.sbtNumber) > 0 && (
              <div className="text-center mt-3">
                <span className="text-2xl font-semibold text-gray-900">#{formData.sbtNumber}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200" 
              onClick={handlePrev}
            >
              Back
            </button>
            <button 
              className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              onClick={claimSBT}
              disabled={isLoading || !formData.sbtNumber || parseInt(formData.sbtNumber) < 1 || parseInt(formData.sbtNumber) > 120}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Minting...
                </>
              ) : (
                <>Claim SBT #{parseInt(formData.sbtNumber)}</>
              )}
            </button>
          </div>
        </div>
      )
    }
  ]

  // If user has already minted, show special screen
  if (hasAlreadyMinted && session?.user?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-6">
                <span className="text-sm font-medium text-gray-600">Sui Run Club</span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-500 text-sm">You've already joined the club</p>
            </div>

            {/* Already Minted Content */}
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">SBT Already Minted!</h3>
                <p className="text-gray-500 text-sm mb-4">
                  You have already claimed your Sui Run Club SBT. Each Twitter account can only mint once.
                </p>
                <p className="text-gray-400 text-xs">
                  Connected as: <span className="font-medium">{session.user.name}</span>
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2" 
                  onClick={handleDisconnect}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Disconnect Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className={`w-full max-w-md bg-white shadow-xl border border-gray-200 transition-all duration-300 rounded-2xl ${
        isAnimating ? 'scale-105 shadow-2xl' : 'scale-100'
      }`}>
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-600">Sui Run Club</span>
              </div>
              {session?.user?.name && (
                <div className="flex gap-2">
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-1"
                    onClick={handleDisconnect}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Disconnect
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Join the Revolution
            </h1>
            <p className="text-gray-500 text-sm">Mint your unique SBT badge</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Step {currentStep} of {steps.length}</span>
              <span className="text-gray-900 font-medium">{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-semibold text-gray-700">{currentStep}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step Form */}
          <div className="space-y-6">
            {steps[currentStep - 1].content}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div className={`px-6 py-4 rounded-xl shadow-lg border backdrop-blur-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {toast.type === 'success' ? (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
