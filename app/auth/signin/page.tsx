"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

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
              Join the Revolution
            </h1>
            <p className="text-gray-500 text-sm">Connect with Twitter to get started</p>
          </div>

          {/* Twitter Login */}
          <div className="space-y-6">
            {providers && Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
