import React, { useState } from "react";
import {
  ChevronRight,
  Users,
  BarChart3,
  Clock,
  Zap,
  Cpu,
  Trophy,
  BookOpen,
  LineChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = "https://lf32z74w-8000.inc1.devtunnels.ms";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp) {
      try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          // Call onLogin to update parent state instead of navigate
          onLogin();
        }
      } catch (error) {
        console.log("Error while signing up", error);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.access_token);
          console.log(data);
          // Call onLogin to update parent state instead of navigate
          onLogin();
        }
      } catch (error) {
        console.log("Error while logging in", error);
      }
    }
    setIsLoading(false);
  };

  const createGameSession = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiUrl}/session/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration_minutes: parseInt(durationMinutes),
          token : localStorage.getItem("token")
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSessionId(data.session_id);
        // Don't set isCreatingSession to false here, keep the form visible
      }
    } catch (error) {
      console.error("Error creating game session:", error);
      alert("Error creating game session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-2xl"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="w-8 h-8 text-cyan-400" />
              <Cpu className="w-4 h-4 text-cyan-300 absolute bottom-0 right-0" />
            </div>
            <h1 className="text-3xl font-bold glitch-text" data-text="STOCKFIN">
              STOCKFIN
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreatingSession(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-1"
            >
              Create Session
            </button>
            <button
              onClick={() => {
                navigate('/lobby');
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-1"
            >
              Join Session
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded transition-colors"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Master Trading Skills in a{" "}
              <span
                className="text-gradient-blue glitch-text"
                data-text="Risk-Free"
              >
                Risk-Free
              </span>{" "}
              Environment
            </h1>
            <p className="text-xl text-gray-300">
              Real-time, multiplayer stock trading simulator designed to make
              investing education dynamic and competitive
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setIsSignUp(true)}
                className="bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
              <button className="bg-black/40 border border-cyan-500/50 text-cyan-400 font-bold px-6 py-3 rounded-lg hover:bg-black/60 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Auth Card */}
          <div className="md:w-1/2 max-w-md w-full">
            <div className="bg-black/80 neon-border p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">
                {isCreatingSession ? "Create Session" : isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              {isCreatingSession ? (
                <form onSubmit={createGameSession} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Duration Minutes
                    </label>
                    <input
                      type="number"
                      className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      placeholder="10"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-bold py-3 rounded-lg transition-all mt-4 disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Session"}
                  </button>
                  
                  {sessionId && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                      <p className="text-green-400 font-bold">Session Created!</p>
                      <p className="text-cyan-100">Session ID: <span className="font-mono text-cyan-400">{sessionId}</span></p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSession(false);
                      setSessionId("");
                      setDurationMinutes("");
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-all mt-2"
                  >
                    Back
                  </button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      {isSignUp && (
                        <div className="mb-4">
                          <label className="block text-sm text-gray-300 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                          />
                        </div>
                      )}
                      <label className="block text-sm text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                        placeholder="youremail@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {isSignUp && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-bold py-3 rounded-lg transition-all mt-4 disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Login"}
                    </button>
                  </form>
                  <div className="mt-4 text-center text-sm text-gray-400">
                    {isSignUp ? (
                      <p>
                        Already have an account?{" "}
                        <button
                          onClick={() => setIsSignUp(false)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Login
                        </button>
                      </p>
                    ) : (
                      <p>
                        Don't have an account?{" "}
                        <button
                          onClick={() => setIsSignUp(true)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Sign Up
                        </button>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-black/40 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/60 neon-border p-6 rounded-lg">
              <div className="bg-cyan-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Trading</h3>
              <p className="text-gray-300">
                Experience dynamic trading using live market data with sub-500
                ms updates for realistic simulations.
              </p>
            </div>
            <div className="bg-black/60 neon-border p-6 rounded-lg">
              <div className="bg-cyan-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Timed Challenges</h3>
              <p className="text-gray-300">
                Host or join trading sprints that mimic real-world market
                pressures with virtual funds.
              </p>
            </div>
            <div className="bg-black/60 neon-border p-6 rounded-lg">
              <div className="bg-cyan-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboards</h3>
              <p className="text-gray-300">
                Grow virtual portfolios to earn badges and climb leaderboards
                with detailed analytics.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">Why StockFin?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> Learn by Doing
                </h3>
                <p className="text-gray-300">
                  Transform textbook theories into dynamic, gamified trading
                  sessions that build real-world skills.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" /> Competitive &
                  Social
                </h3>
                <p className="text-gray-300">
                  Compete solo or in teams to learn from peers while building
                  your trading confidence.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" /> Detailed
                  Analytics
                </h3>
                <p className="text-gray-300">
                  Receive personalized feedback and detailed performance
                  analytics to improve your skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black py-8 border-t border-cyan-500/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Zap className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold">STOCKFIN</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} StockFin. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}