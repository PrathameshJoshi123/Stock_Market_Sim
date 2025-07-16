import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  Users,
  Clock,
  Zap,
  Cpu,
  Copy,
  CheckCircle,
  Play,
  UserPlus,
  Crown,
  Trophy,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Plus,
} from "lucide-react";

export default function LobbyPage() {
  const [mySession, setMySession] = useState(
    localStorage.getItem("mySession") === "true"
  );
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("sessionId") || ""
  );
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Player"
  );

  const navigate = useNavigate();
  const apiUrl = "https://lf32z74w-8000.inc1.devtunnels.ms";

  useEffect(() => {
    if (mySession) {
      localStorage.setItem("mySession", "true");
    } else {
      localStorage.removeItem("mySession");
    }
  }, [mySession]);

  // useEffect(() => {
  //   let interval;
  //   if (mySession && sessionId) {
  //     interval = setInterval(async () => {
  //       try {
  //         const res = await axios.get(`${apiUrl}/session/${sessionId}/players`);
  //         setPlayers(res.data.players || []);
  //       } catch (err) {
  //         console.error("Failed to fetch players", err);
  //       }
  //     }, 3000);
  //   }
  //   return () => clearInterval(interval);
  // }, [mySession, sessionId]);

  // ⚡ Only create socket when mySession becomes true
  useEffect(() => {
    if (mySession && sessionId && !socket) {
      const newSocket = io(apiUrl, {
        path: "/socket",
        transports: ["websocket"],
        query: { session_id: sessionId },
      });

      setSocket(newSocket);

      newSocket.emit("join_session", { session_id: sessionId, username });

      newSocket.on("update_players", (data) => {
        setPlayers(data.players || []);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [mySession, sessionId, username, socket]);

  // Clean up socket connection
  const cleanupSocket = () => {
    if (socket) {
      socket.off("user_joined");
      socket.off("error");
      socket.close();
      setSocket(null);
    }
  };

  // Clean up socket on component unmount
  useEffect(() => {
    return () => {
      cleanupSocket();
    };
  }, []);

  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      alert("Please enter a session ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/session/join`, {
        session_id: sessionId,
        token: localStorage.getItem("token"),
      });
      console.log(response);
      if (response) {
        console.log("i am reaching inside success");
        setIsHost(response.data.isHost || false);
        setPlayers(response.data.players || []);
        setMySession(true);
        setSessionId(sessionId);
        localStorage.setItem("mySession", "true");
        localStorage.setItem("sessionId", sessionId);
      }
    } catch (error) {
      console.log("Failed to join session", error);
      alert(error.response?.data?.message || "Failed to join session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSession = () => {
    // Clean up socket connection
    cleanupSocket();

    // Reset session state
    setMySession(false);
    setSessionId("");
    setPlayers([]);
    setIsHost(false);
    setCountdown(null);

    // Clear localStorage
    localStorage.removeItem("mySession");
    localStorage.removeItem("sessionId");
  };

  const handleStartSession = async () => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startGame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = async () => {
    try {
      await axios.post(`${apiUrl}/sessions/${sessionId}/start`, {
        token: localStorage.getItem("token"),
      });

      navigate(`/game/${sessionId}`);
    } catch (err) {
      alert("Failed to start session");
    }
  };

  const copySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy session ID");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-2xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="w-8 h-8 text-cyan-400" />
                <Cpu className="w-4 h-4 text-cyan-300 absolute bottom-0 right-0" />
              </div>
              <h1 className="text-3xl font-bold">STOCKFIN</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Users className="w-5 h-5" />
              <span>Welcome, {username}!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {mySession ? (
          /* Session Creation/Join Interface */

          <>
            {/* Session Info Card */}
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">
                  {isHost ? "Your Trading Session" : "Joined Session"}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm text-gray-300">
                      Waiting for players
                    </span>
                  </div>
                  <button
                    onClick={handleLeaveSession}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Session ID */}
                <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-300">Session ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xl font-mono text-cyan-400 bg-black/50 px-3 py-1 rounded">
                      {sessionId}
                    </code>
                    <button
                      onClick={copySessionId}
                      className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-cyan-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Share this ID with friends
                  </p>
                </div>

                {/* Players Count */}
                <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-300">Players</span>
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {players.length} players joined
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {isHost ? "You are the host" : "Waiting for host to start"}
                  </p>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cyan-400">
                  Players in Lobby
                </h3>
                <div className="flex items-center gap-2 text-purple-400">
                  <Users className="w-5 h-5" />
                  <span>{players.length} joined</span>
                </div>
              </div>

              <div className="space-y-4">
                {players.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      No players yet. Share the session ID to invite friends!
                    </p>
                  </div>
                ) : (
                  players.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                          <span className="text-xl">
                            {player === username ? "🚀" : "👤"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-100">
                              {player}
                              {player === username && " (You)"}
                            </span>
                            {isHost && player === username && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <span className="text-sm text-gray-400">
                            Ready to trade
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-green-400">Online</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Game Controls */}
            <div className="text-center">
              {countdown ? (
                <div className="mb-8">
                  <div className="text-6xl font-bold text-cyan-400 mb-4">
                    {countdown}
                  </div>
                  <div className="text-xl text-gray-300">
                    Game starting in...
                  </div>
                </div>
              ) : (
                isHost && (
                  <button
                    onClick={handleStartSession}
                    disabled={players.length === 0}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-bold px-8 py-4 rounded-lg transition-all flex items-center gap-2 text-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-6 h-6" />
                    Start Trading Session
                  </button>
                )
              )}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-bold text-cyan-400 mb-4">
                Instructions:
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-400 mt-1">1.</span>
                  <span>Share your Session ID with friends to invite them</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-400 mt-1">2.</span>
                  <span>Wait for all players to join the lobby</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-400 mt-1">3.</span>
                  <span>
                    {isHost
                      ? "Click 'Start Trading Session' when ready"
                      : "Wait for the host to start the game"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-cyan-400 mt-1">4.</span>
                  <span>Compete to build the best portfolio!</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Active Session Interface */
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
                Trading Session Lobby
              </h2>

              {/* Join Session */}
              <div className="border-t border-gray-700 pt-8">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">
                  Join Existing Session
                </h3>
                <div className="flex gap-4">
                  <input
                    placeholder="Enter Session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="flex-1 bg-black border border-cyan-500/50 rounded-lg p-4 text-cyan-100 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={handleJoinSession}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-4 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {isLoading ? "Joining..." : "Join"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
