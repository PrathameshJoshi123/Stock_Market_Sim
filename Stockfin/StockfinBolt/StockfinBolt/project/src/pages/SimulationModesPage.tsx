import React, { useState } from "react";
import {
  Flame,
  Users,
  Lightbulb,
  AlertTriangle,
  TrendingDown,
  LineChart,
  Clock,
  ArrowRight,
  BarChart,
  Award,
  Radio,
  Brain,
  Briefcase,
  Megaphone,
  Target,
} from "lucide-react";

// Simulation modes data
const simulationModes = [
  {
    id: "mode-1",
    name: "Learn by Burn",
    description:
      "Experience simulated market crashes and FOMO in a risk-free environment. Learn to stay calm under extreme market conditions.",
    icon: <Flame className="w-6 h-6 text-red-400" />,
    benefits: [
      "Experience rapid market downturns without real losses",
      "Learn to recognize FOMO (Fear Of Missing Out) and avoid impulsive decisions",
      "Practice implementing circuit breakers and emergency strategies",
      "Build emotional resilience to market shocks",
    ],
    difficulty: "Advanced",
    category: "Psychology",
    popularity: 87,
  },
  {
    id: "mode-2",
    name: "Peer Pressure Mode",
    description:
      "Gain live trading visibility to simulate real-world social market pressures. See how others trade in real-time and manage your own decisions.",
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    benefits: [
      "Experience the psychological impact of seeing others' trades",
      "Learn to maintain your strategy despite social influences",
      "Practice communicating and defending your trading decisions",
      "Develop immunity to herd mentality",
    ],
    difficulty: "Intermediate",
    category: "Social",
    popularity: 92,
  },
  {
    id: "mode-3",
    name: "Professor Controls",
    description:
      "Participate in instructor-led scenarios where market events are triggered to teach specific lessons and concepts.",
    icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
    benefits: [
      "Learn from guided scenarios designed by trading professionals",
      "Receive real-time feedback on your trading decisions",
      "Understand cause-and-effect relationships in markets",
      "Build knowledge through structured, educational simulations",
    ],
    difficulty: "Beginner to Advanced",
    category: "Educational",
    popularity: 78,
  },
  {
    id: "mode-4",
    name: "Black Swan Events",
    description:
      "Test your portfolio against rare, extreme market events that can cause catastrophic losses or extraordinary gains.",
    icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
    benefits: [
      "Prepare for the unexpected with extreme scenario planning",
      "Test the robustness of your trading strategies",
      "Learn to identify early warning signs of market dislocations",
      "Develop contingency plans for rare events",
    ],
    difficulty: "Expert",
    category: "Risk Management",
    popularity: 65,
  },
  {
    id: "mode-5",
    name: "Market Volatility Lab",
    description:
      "Trade in a high-volatility environment with frequent price swings. Perfect for practicing day trading techniques.",
    icon: <TrendingDown className="w-6 h-6 text-purple-400" />,
    benefits: [
      "Master trading in choppy and unpredictable markets",
      "Practice using volatility indicators effectively",
      "Develop quick decision-making skills under pressure",
      "Learn optimal position sizing during high volatility",
    ],
    difficulty: "Intermediate",
    category: "Technical",
    popularity: 82,
  },
  {
    id: "mode-6",
    name: "News Reaction Simulator",
    description:
      "React to breaking financial headlines that instantly shift stock prices. Test your ability to quickly analyze and act on news.",
    icon: <Radio className="w-6 h-6 text-cyan-400" />,
    benefits: [
      "Improve your ability to quickly assess news impact",
      "Practice news-based trading strategies",
      "Learn to separate market noise from significant events",
      "Develop media literacy for financial information",
    ],
    difficulty: "Intermediate",
    category: "Fundamental",
    popularity: 85,
  },
];

// Different simulation scenarios
const scenarios = [
  {
    id: "scenario-1",
    name: "Market Crash 2008",
    description:
      "Experience the conditions of the 2008 financial crisis with rapidly declining prices across sectors.",
    category: "Historical",
    duration: "1 week",
  },
  {
    id: "scenario-2",
    name: "Tech Bubble Burst",
    description:
      "Navigate the dot-com bubble burst with overvalued tech companies experiencing massive corrections.",
    category: "Historical",
    duration: "3 days",
  },
  {
    id: "scenario-3",
    name: "Inflation Surge",
    description:
      "Trade during a period of unexpected inflation spike and the resulting market reactions.",
    category: "Macroeconomic",
    duration: "5 days",
  },
  {
    id: "scenario-4",
    name: "Interest Rate Hike",
    description:
      "Adapt to sudden central bank interest rate increases and the impact on various market sectors.",
    category: "Macroeconomic",
    duration: "2 days",
  },
  {
    id: "scenario-5",
    name: "Supply Chain Crisis",
    description:
      "Deal with market volatility caused by global supply chain disruptions affecting multiple industries.",
    category: "Crisis",
    duration: "4 days",
  },
  {
    id: "scenario-6",
    name: "Cryptocurrency Crash",
    description:
      "React to a major cryptocurrency market correction and its effects on related stocks and sectors.",
    category: "Specialized",
    duration: "36 hours",
  },
];

export function SimulationModesPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  // Filter simulation modes based on current filter
  const filteredModes =
    filter === "all"
      ? simulationModes
      : simulationModes.filter(
          (mode) => mode.category.toLowerCase() === filter.toLowerCase()
        );

  const handleLaunchSimulation = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    setSelectedScenario(scenario);
    setShowLaunchModal(true);
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
            <LineChart className="w-7 h-7 text-cyan-400" /> Simulation Modes
          </h1>
          <p className="text-gray-300">
            Special simulation environments designed to build specific trading
            skills and responses
          </p>
        </div>

        {/* Simulation modes filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "all"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("all")}
            >
              All Modes
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "psychology"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("psychology")}
            >
              Psychology
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "social"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("social")}
            >
              Social
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "technical"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("technical")}
            >
              Technical
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "fundamental"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("fundamental")}
            >
              Fundamental
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "risk management"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("risk management")}
            >
              Risk Management
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                filter === "educational"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-black/60 text-cyan-400 border border-cyan-500/30"
              }`}
              onClick={() => setFilter("educational")}
            >
              Educational
            </button>
          </div>
        </div>

        {/* Simulation modes grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredModes.map((mode) => (
            <div
              key={mode.id}
              className={`bg-black/80 neon-border rounded-lg p-6 hover:bg-black/60 cursor-pointer transition-all ${
                selectedMode === mode.id ? "border-cyan-400 bg-cyan-900/10" : ""
              }`}
              onClick={() =>
                setSelectedMode(selectedMode === mode.id ? null : mode.id)
              }
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-black/60 p-3 rounded-lg">{mode.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{mode.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 border border-cyan-500/30 text-cyan-300">
                      {mode.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 border border-cyan-500/30 text-cyan-300">
                      {mode.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">{mode.description}</p>

              {selectedMode === mode.id && (
                <div className="mt-4 pt-4 border-t border-cyan-900/30">
                  <h4 className="font-semibold mb-2 text-cyan-300">
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {mode.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-400">
                      <BarChart className="w-4 h-4 mr-1 text-cyan-500" />
                      <span>{mode.popularity}% user rating</span>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold px-4 py-2 rounded transition-all text-sm">
                      Launch Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Simulation scenarios section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Simulation Scenarios</h2>
            <button className="bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-4 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400">
              Create Custom Scenario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-black/80 neon-border rounded-lg">
              <thead>
                <tr className="bg-cyan-900/20">
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Scenario Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Duration
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <tr
                    key={scenario.id}
                    className={`border-b border-cyan-900/20 ${
                      index % 2 === 1 ? "bg-cyan-900/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{scenario.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {scenario.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/60 border border-cyan-500/30 text-cyan-300">
                        {scenario.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-4 h-4 mr-1.5 text-cyan-400" />{" "}
                        {scenario.duration}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1 rounded"
                        onClick={() => handleLaunchSimulation(scenario.id)}
                      >
                        Launch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skills development */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills You'll Develop</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/60 neon-border rounded-lg p-5">
              <Brain className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">Trading Psychology</h3>
              <p className="text-gray-300 text-sm">
                Master emotional discipline under market pressure and develop
                resilience against common psychological biases.
              </p>
            </div>
            <div className="bg-black/60 neon-border rounded-lg p-5">
              <Target className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">Risk Management</h3>
              <p className="text-gray-300 text-sm">
                Learn effective position sizing, stop-loss placement, and
                portfolio diversification techniques.
              </p>
            </div>
            <div className="bg-black/60 neon-border rounded-lg p-5">
              <Briefcase className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">
                Strategic Decision Making
              </h3>
              <p className="text-gray-300 text-sm">
                Develop frameworks for making calculated trading decisions based
                on diverse market information.
              </p>
            </div>
            <div className="bg-black/60 neon-border rounded-lg p-5">
              <Megaphone className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">News Interpretation</h3>
              <p className="text-gray-300 text-sm">
                Build the ability to quickly assess news impact on markets and
                separate signal from noise.
              </p>
            </div>
          </div>
        </div>

        {/* Your badges section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Your Simulation Achievements
          </h2>
          <div className="bg-black/80 neon-border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-12 h-12 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">Simulation Badges</h3>
                <p className="text-gray-300">
                  Earn badges by successfully completing simulation challenges
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Earned badge */}
              <div className="bg-gradient-to-b from-cyan-900/20 to-black/40 border border-cyan-500/50 rounded-lg p-4 text-center">
                <div className="bg-cyan-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">Crash Survivor</h4>
                <p className="text-xs text-gray-400">
                  Maintained positive returns during market crash
                </p>
              </div>

              {/* Earned badge */}
              <div className="bg-gradient-to-b from-cyan-900/20 to-black/40 border border-cyan-500/50 rounded-lg p-4 text-center">
                <div className="bg-cyan-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">News Master</h4>
                <p className="text-xs text-gray-400">
                  Successfully traded 5 major news events
                </p>
              </div>

              {/* Locked badge */}
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center opacity-60">
                <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-gray-600" />
                </div>
                <h4 className="font-bold text-sm mb-1">Team Leader</h4>
                <p className="text-xs text-gray-500">
                  Lead a team to top 10% in competition
                </p>
              </div>

              {/* Locked badge */}
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center opacity-60">
                <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-gray-600" />
                </div>
                <h4 className="font-bold text-sm mb-1">Volatility Surfer</h4>
                <p className="text-xs text-gray-500">
                  Complete Volatility Lab with 30%+ returns
                </p>
              </div>

              {/* Locked badge */}
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center opacity-60">
                <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-gray-600" />
                </div>
                <h4 className="font-bold text-sm mb-1">Black Swan Hunter</h4>
                <p className="text-xs text-gray-500">
                  Profit during extreme market events
                </p>
              </div>

              {/* Locked badge */}
              <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center opacity-60">
                <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-10 h-10 text-gray-600" />
                </div>
                <h4 className="font-bold text-sm mb-1">Master Simulator</h4>
                <p className="text-xs text-gray-500">
                  Complete all simulation modes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Modal */}
        {showLaunchModal && selectedScenario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 neon-border rounded-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowLaunchModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Launch Simulation</h2>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">
                  {selectedScenario.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {selectedScenario.description}
                </p>
              </div>

              <div className="bg-black/60 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Simulation Settings</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Initial Portfolio Value
                    </label>
                    <select className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100">
                      <option>$10,000</option>
                      <option>$25,000</option>
                      <option>$50,000</option>
                      <option>$100,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Difficulty Level
                    </label>
                    <select className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100">
                      <option>Easy</option>
                      <option selected>Medium</option>
                      <option>Hard</option>
                      <option>Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Time Compression
                    </label>
                    <select className="w-full bg-black border border-cyan-500/50 rounded p-2 text-cyan-100">
                      <option>Real-time</option>
                      <option>2x Speed</option>
                      <option selected>4x Speed</option>
                      <option>8x Speed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                  onClick={() => setShowLaunchModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold py-2 rounded transition-all"
                  onClick={() => {
                    // Handle launch logic
                    setShowLaunchModal(false);
                  }}
                >
                  Launch Simulation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
