import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Home</a></li>
              <li><a>About</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Sui Run Club</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a>Home</a></li>
            <li><a>About</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <AuthButton />
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary-content">Welcome to Sui Run Club</h1>
            <p className="py-6 text-primary-content">
              Join the ultimate running community on the Sui blockchain. Track your runs, earn rewards, and connect with fellow runners worldwide.
            </p>
            <button className="btn btn-accent btn-lg">Start Running</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Track Runs</h3>
                <p>Record your running sessions and track your progress with detailed analytics.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Earn Rewards</h3>
                <p>Get rewarded with SUI tokens for your running achievements and milestones.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Community</h3>
                <p>Connect with other runners, join challenges, and share your achievements.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats shadow w-full bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-title">Total Runners</div>
          <div className="stat-value">1,234</div>
          <div className="stat-desc">Active members</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Distance</div>
          <div className="stat-value">45,678 km</div>
          <div className="stat-desc">Distance covered</div>
        </div>
        <div className="stat">
          <div className="stat-title">Rewards Distributed</div>
          <div className="stat-value">12,345 SUI</div>
          <div className="stat-desc">Tokens earned</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <aside>
          <p className="font-bold">Sui Run Club</p>
          <p>Building the future of fitness on blockchain</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">About</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Privacy</a>
            <a className="link link-hover">Terms</a>
          </div>
        </nav>
      </footer>
    </div>
  );
}
