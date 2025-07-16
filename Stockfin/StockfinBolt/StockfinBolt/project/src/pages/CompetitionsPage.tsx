import React, { useState } from "react";
import {
  Users,
  Trophy,
  Clock,
  Star,
  Zap,
  Filter,
  PlusCircle,
  Search,
  Shield,
  CalendarClock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Mock data for competitions
const mockCompetitions = [
  {
    id: "comp-1",
    name: "24h Speed Trading Sprint",
    description:
      "Quickly grow your portfolio in just 24 hours with limited initial capital. Test your quick decision-making skills.",
    startTime: new Date(Date.now() + 3600000),
    duration: "24 hours",
    participants: 32,
    maxParticipants: 50,
    prize: "$2,500 virtual",
    difficulty: "Medium",
    tags: ["timed", "beginner-friendly"],
  },
  {
    id: "comp-2",
    name: "Market Volatility Challenge",
    description:
      "Navigate through extreme market fluctuations and maintain profitability. Prepare for surprising news events!",
    startTime: new Date(Date.now() + 7200000),
    duration: "48 hours",
    participants: 47,
    maxParticipants: 100,
    prize: "$5,000 virtual + badges",
    difficulty: "Hard",
    tags: ["volatility", "advanced"],
  },
  {
    id: "comp-3",
    name: "Long-Term Investment Simulation",
    description:
      "Build a sustainable portfolio over a simulated 3-month period. Focus on fundamentals and steady growth.",
    startTime: new Date(Date.now() + 86400000),
    duration: "2 weeks",
    participants: 65,
    maxParticipants: 200,
    prize: "$10,000 virtual + Gold Investor badge",
    difficulty: "Easy",
    tags: ["long-term", "beginner-friendly"],
  },
  {
    id: "comp-4",
    name: "Team Trading Tournament",
    description:
      "Form teams of 3 and compete against other groups. Coordinate strategies and maximize combined returns.",
    startTime: new Date(Date.now() + 259200000),
    duration: "72 hours",
    participants: 78,
    maxParticipants: 150,
    prize: "$7,500 virtual per team",
    difficulty: "Medium",
    tags: ["team", "collaborative"],
  },
  {
    id: "comp-5",
    name: "News Response Challenge",
    description:
      "React quickly to breaking market news. Your ability to adapt to sudden changes will be heavily tested.",
    startTime: new Date(Date.now() + 432000000),
    duration: "36 hours",
    participants: 24,
    maxParticipants: 50,
    prize: "$4,000 virtual + News Master badge",
    difficulty: "Hard",
    tags: ["news-driven", "advanced"],
  },
];

// Top performers mock data
const topPerformers = [
  {
    id: 1,
    name: "CyberTrader72",
    profit: "+245%",
    competitions: 24,
    badges: 8,
  },
  { id: 2, name: "NeonBull99", profit: "+192%", competitions: 18, badges: 5 },
  {
    id: 3,
    name: "QuantumInvest",
    profit: "+156%",
    competitions: 31,
    badges: 12,
  },
  { id: 4, name: "DarkStonks", profit: "+121%", competitions: 15, badges: 6 },
  { id: 5, name: "CryptoWhale", profit: "+118%", competitions: 22, badges: 9 },
];

// Upcoming competitions that you've joined
const joinedCompetitions = [
  {
    id: "joined-1",
    name: "Crypto Boom Challenge",
    startTime: new Date(Date.now() + 2 * 3600000), // 2 hours from now
    timeLeft: "2h 0m",
    participants: 42,
  },
  {
    id: "joined-2",
    name: "Weekend Warriors Trading",
    startTime: new Date(Date.now() + 24 * 3600000), // 24 hours from now
    timeLeft: "1d 0h",
    participants: 87,
  },
];

export function CompetitionsPage() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);

  // Filter competitions based on current filter and search term
  const filteredCompetitions = mockCompetitions.filter((comp) => {
    const matchesFilter = filter === "all" || comp.tags.includes(filter);
    const matchesSearch =
      searchTerm === "" ||
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleJoinCompetition = (competition: any) => {
    setSelectedCompetition(competition);
    setShowJoinModal(true);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Background effects */}
      <div className="fixed inset-0 bg-black z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Trophy className="w-7 h-7 text-cyan-400" /> Trading Competitions
          </h1>
          <p className="text-gray-300">
            Compete with traders around the world in timed challenges to test
            your skills and climb the leaderboards
          </p>
        </div>

        {/* Your upcoming competitions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Your Upcoming Competitions
            </h2>
            <button
              className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle className="w-4 h-4" /> Create Competition
            </button>
          </div>

          {joinedCompetitions.length === 0 ? (
            <div className="bg-black/80 neon-border rounded-lg p-8 text-center">
              <div className="mb-4">
                <AlertTriangle className="w-12 h-12 text-cyan-500/50 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No Upcoming Competitions
              </h3>
              <p className="text-gray-400">
                You haven't joined any competitions yet. Browse available
                competitions below.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-black/60 neon-border p-4 rounded-lg pulse-glow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{comp.name}</h3>
                    <div className="bg-cyan-900/30 text-cyan-300 text-xs px-2 py-1 rounded-full">
                      Joined
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center text-yellow-400">
                      <Clock className="w-4 h-4 mr-1" /> {comp.timeLeft}
                    </div>
                    <div className="flex items-center text-cyan-300">
                      <Users className="w-4 h-4 mr-1" /> {comp.participants}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-xs text-gray-400">
                      Starts: {formatDate(comp.startTime)}
                    </div>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1 rounded">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              <div
                className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 border-dashed p-4 rounded-lg flex flex-col items-center justify-center min-h-[180px] cursor-pointer hover:bg-black/40 transition-all"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusCircle className="w-10 h-10 text-cyan-500/50 mb-2" />
                <p className="text-cyan-500/70 font-medium">
                  Create or Join a Competition
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Browse Competitions Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Browse Competitions</h2>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search competitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-black border border-cyan-500/30 rounded-lg text-sm focus:border-cyan-500 focus:outline-none w-full md:w-64"
                />
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500/60" />
              </div>
              <div className="flex items-center bg-black border border-cyan-500/30 rounded-lg overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-sm ${
                    filter === "all"
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-cyan-500/60 hover:text-cyan-400"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${
                    filter === "beginner-friendly"
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-cyan-500/60 hover:text-cyan-400"
                  }`}
                  onClick={() => setFilter("beginner-friendly")}
                >
                  Beginner
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${
                    filter === "advanced"
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-cyan-500/60 hover:text-cyan-400"
                  }`}
                  onClick={() => setFilter("advanced")}
                >
                  Advanced
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${
                    filter === "team"
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-cyan-500/60 hover:text-cyan-400"
                  }`}
                  onClick={() => setFilter("team")}
                >
                  Team
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCompetitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-black/80 neon-border rounded-lg p-4 hover:bg-black/60 transition-all"
              >
                <div className="md:flex justify-between">
                  <div className="md:w-2/3">
                    <div className="flex items-start gap-3">
                      <div className="bg-cyan-900/30 p-3 rounded-lg">
                        <Trophy className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">
                          {competition.name}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1">
                          {competition.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {competition.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-black/60 text-cyan-300 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/3 mt-4 md:mt-0 flex flex-col justify-between md:items-end">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                        <div className="text-xs text-gray-400">Prize</div>
                        <div className="text-sm font-semibold text-cyan-300">
                          {competition.prize}
                        </div>
                      </div>
                      <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                        <div className="text-xs text-gray-400">Difficulty</div>
                        <div className="text-sm font-semibold text-cyan-300">
                          {competition.difficulty}
                        </div>
                      </div>
                      <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                        <div className="text-xs text-gray-400">Duration</div>
                        <div className="text-sm font-semibold text-cyan-300">
                          {competition.duration}
                        </div>
                      </div>
                      <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                        <div className="text-xs text-gray-400">
                          Participants
                        </div>
                        <div className="text-sm font-semibold text-cyan-300">
                          {competition.participants}/
                          {competition.maxParticipants}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 w-full md:w-auto">
                      <div className="text-sm text-gray-400 mb-2">
                        Starts: {formatDate(competition.startTime)}
                      </div>
                      <button
                        className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold px-6 py-2 rounded transition-all"
                        onClick={() => handleJoinCompetition(competition)}
                      >
                        Join Competition
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
          <div className="bg-black/80 neon-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 text-sm text-gray-400 bg-cyan-900/20 p-3">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Trader</div>
              <div className="col-span-2 text-center">Best Profit</div>
              <div className="col-span-2 text-center">Competitions</div>
              <div className="col-span-2 text-center">Badges</div>
            </div>

            {topPerformers.map((trader, index) => (
              <div
                key={trader.id}
                className="grid grid-cols-12 items-center p-3 border-b border-cyan-900/20 last:border-0 hover:bg-cyan-900/10"
              >
                <div className="col-span-1 font-bold">
                  {index === 0 ? (
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black">
                      1
                    </div>
                  ) : index === 1 ? (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-black">
                      2
                    </div>
                  ) : index === 2 ? (
                    <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-black">
                      3
                    </div>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="col-span-5">
                  <div className="font-medium flex items-center gap-2">
                    {trader.name}
                    {index < 3 && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-center text-green-400 font-semibold">
                  {trader.profit}
                </div>
                <div className="col-span-2 text-center">
                  {trader.competitions}
                </div>
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    {trader.badges}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Competition Modal */}
        {showJoinModal && selectedCompetition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 neon-border rounded-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowJoinModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Join Competition</h2>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">
                  {selectedCompetition.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {selectedCompetition.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/40 p-2 rounded">
                  <div className="text-xs text-gray-400">Starting</div>
                  <div className="text-sm flex items-center gap-1">
                    <CalendarClock className="w-4 h-4 text-cyan-400" />
                    {formatDate(selectedCompetition.startTime)}
                  </div>
                </div>
                <div className="bg-black/40 p-2 rounded">
                  <div className="text-xs text-gray-400">Duration</div>
                  <div className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {selectedCompetition.duration}
                  </div>
                </div>
                <div className="bg-black/40 p-2 rounded">
                  <div className="text-xs text-gray-400">Participants</div>
                  <div className="text-sm flex items-center gap-1">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {selectedCompetition.participants}/
                    {selectedCompetition.maxParticipants}
                  </div>
                </div>
                <div className="bg-black/40 p-2 rounded">
                  <div className="text-xs text-gray-400">Prize</div>
                  <div className="text-sm flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    {selectedCompetition.prize}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded mb-6">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />{" "}
                  Competition Rules
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Starting capital: $10,000 virtual funds</li>
                  <li>• All participants start with identical portfolios</li>
                  <li>• Trading fees of 0.1% per transaction apply</li>
                  <li>• Winners determined by total portfolio value at end</li>
                  <li>• Competition cannot be joined after start time</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  onClick={() => setShowJoinModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold py-2 rounded transition-all"
                  onClick={() => {
                    // Handle join logic
                    setShowJoinModal(false);
                  }}
                >
                  Confirm & Join
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Competition Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 neon-border rounded-lg max-w-lg w-full p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowCreateModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-6">Create New Competition</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Competition Name
                  </label>
                  <input className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100" />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100 h-24"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Duration
                    </label>
                    <select className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100">
                      <option>6 hours</option>
                      <option>12 hours</option>
                      <option>24 hours</option>
                      <option>48 hours</option>
                      <option>1 week</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Initial Capital
                    </label>
                    <input
                      type="number"
                      className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Competition Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/40 border border-cyan-500/30 rounded p-3 cursor-pointer hover:bg-cyan-900/20">
                      <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
                      <h4 className="font-medium">Standard</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Regular trading with standard market conditions
                      </p>
                    </div>
                    <div className="bg-black/40 border border-cyan-500/30 rounded p-3 cursor-pointer hover:bg-cyan-900/20">
                      <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                      <h4 className="font-medium">Volatility</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Extreme price swings and market uncertainty
                      </p>
                    </div>
                    <div className="bg-black/40 border border-cyan-500/30 rounded p-3 cursor-pointer hover:bg-cyan-900/20">
                      <Users className="w-6 h-6 text-cyan-400 mb-2" />
                      <h4 className="font-medium">Team</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Form teams and compete with collaborative strategy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold py-2 rounded transition-all"
                    onClick={() => {
                      // Handle create logic
                      setShowCreateModal(false);
                    }}
                  >
                    Create Competition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
