"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="btn btn-ghost loading">Loading...</div>
  }

  if (session) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={session.user?.image || ""} alt={session.user?.name || ""} />
            </div>
          </div>
          <span className="ml-2">{session.user?.name}</span>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <button onClick={() => signOut()} className="btn btn-ghost">
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="btn btn-primary"
    >
      <svg
        aria-label="X logo"
        width="16"
        height="16"
        viewBox="0 0 300 271"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <path
          fill="currentColor"
          d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
        />
      </svg>
      Sign In with X
    </button>
  )
}
