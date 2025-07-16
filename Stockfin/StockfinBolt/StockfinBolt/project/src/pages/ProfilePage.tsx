import React from "react";
import {
  User,
  Award,
  BookOpen,
  BarChart2,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Shield,
  TrendingUp,
  Medal,
} from "lucide-react";
import { Trade } from "../components/StocksTab";
import { Stock, NewsItem } from "../types";

// Define interface for component props
interface ProfilePageProps {
  username: string;
  joinDate: string;
  portfolioValue: number;
  cashBalance: number;
  trades: Trade[];
  stocks: Record<string, Stock>;
  newsHistory: NewsItem[];
}

export function ProfilePage({
  username = "Trader",
  joinDate = new Date().toLocaleDateString(),
  portfolioValue = 0,
  cashBalance = 0,
  trades = [],
  stocks = {},
  newsHistory = []
}: ProfilePageProps) {
  // Helper functions from other components
  const formatIndianRupees = (amount: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };
  
  // Calculate derived data
  const totalValue = portfolioValue + cashBalance;
  const totalTrades = trades.length;
  
  // Calculate win rate (trades with profit)
  const profitableTrades = trades.filter(trade => {
    if (trade.type === "Buy") return false; // Can't determine profit for buys
    // For sells, we could compare with original buy price, but we don't have that data
    // For demo, let's randomize this
    return Math.random() > 0.3; // 70% win rate for demo
  });
  const winRate = totalTrades > 0 ? Math.round((profitableTrades.length / totalTrades) * 100) : 0;
  
  // Calculate performance percentages (simulated)
  const allTimePerformance = totalValue > 10000 ? ((totalValue - 10000) / 10000) * 100 : 0;
  const dayPerformance = (Math.random() * 6) - 3; // Random between -3% and +3%
  const weekPerformance = (Math.random() * 10) - 2; // Random between -2% and +8% 
  const monthPerformance = allTimePerformance * (Math.random() * 0.5 + 0.5); // Random portion of all-time
  
  // Create recent activity from trades and news
  const recentActivity = [
    // Get 5 most recent trades
    ...trades.slice(0, 5).map(trade => ({
      type: "trade" as const,
      name: `${trade.type} ${trade.stockName}`,
      date: new Date(trade.timestamp).toLocaleDateString(),
      description: `${trade.type} ${trade.quantity} shares at ${formatIndianRupees(trade.price)}`,
      profit: trade.type === "Sell" ? 12.5 : 0, // Placeholder profit value
    })),
    
    // Add some processed news items
    ...newsHistory.slice(0, 3).map(news => ({
      type: "news" as const,
      name: news.company,
      date: news.timestamp ? new Date(news.timestamp).toLocaleDateString() : "Recently",
      description: news.headline,
    })),
  ].sort(() => Math.random() - 0.5).slice(0, 5); // Randomize and take 5 items
  
  // Create badges from achievements (simulated)
  const earnedBadges = [
    {
      name: "Market Explorer",
      description: "Traded over 10 different stocks",
      icon: <Award className="w-8 h-8 text-yellow-400" />,
    },
    {
      name: "Fast Trader",
      description: "Made multiple trades in a single day",
      icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
    },
    {
      name: "Portfolio Builder",
      description: "Portfolio value exceeds ₹15,000",
      icon: <BookOpen className="w-8 h-8 text-yellow-400" />,
    },
    {
      name: "Active Trader",
      description: "Completed more than 10 trades",
      icon: <Clock className="w-8 h-8 text-yellow-400" />,
    },
  ];
  
  // Find best performing stock (simulated)
  const favoriteStock = Object.values(stocks).sort((a, b) => 
    b.confidence_index - a.confidence_index
  )[0]?.name || "None";
  
  // Best return (simulated)
  const bestReturn = "+23%";

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
        {/* Profile header */}
        <div className="bg-black/80 neon-border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-cyan-900/30 flex items-center justify-center">
              <User className="w-12 h-12 text-cyan-400" />
            </div>

            <div className="flex-1">
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold mb-1">{username}</h1>
                <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-1" /> Joined {joinDate}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-black/60 border border-cyan-500/30 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-400 mb-1">Trades</div>
                  <div className="text-xl font-bold">
                    {totalTrades}
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/30 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                  <div className="text-xl font-bold text-green-400">
                    {winRate}%
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/30 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-400 mb-1">Badges</div>
                  <div className="text-xl font-bold text-yellow-400">
                    {earnedBadges.length}
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/30 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-400 mb-1">Active Stocks</div>
                  <div className="text-xl font-bold text-cyan-400">
                    {Object.keys(stocks).length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/80 border border-cyan-500/30 p-4 rounded-lg min-w-[200px]">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">
                  All-Time Performance
                </div>
                <div className={`text-3xl font-bold ${allTimePerformance >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {allTimePerformance >= 0 ? "+" : ""}{allTimePerformance.toFixed(1)}%
                </div>
                <div className="flex justify-center gap-4 mt-3">
                  <div>
                    <div className="text-xs text-gray-400">Portfolio Value</div>
                    <div className="font-bold">
                      {formatIndianRupees(portfolioValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Cash</div>
                    <div className="font-bold">
                      {formatIndianRupees(cashBalance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Performance */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-black/80 neon-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" /> Performance
                Summary
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">1 Day</div>
                  <div
                    className={`text-lg font-bold flex items-center ${
                      dayPerformance >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {dayPerformance >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(dayPerformance).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">1 Week</div>
                  <div
                    className={`text-lg font-bold flex items-center ${
                      weekPerformance >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {weekPerformance >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(weekPerformance).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">1 Month</div>
                  <div
                    className={`text-lg font-bold flex items-center ${
                      monthPerformance >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {monthPerformance >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(monthPerformance).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">All Time</div>
                  <div
                    className={`text-lg font-bold flex items-center ${
                      allTimePerformance >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {allTimePerformance >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(allTimePerformance).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Placeholder for chart */}
              <div className="w-full h-48 bg-cyan-900/10 border border-cyan-900/30 rounded-lg flex items-center justify-center">
                <p className="text-cyan-500/50">
                  Portfolio Performance Chart
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">
                    Most Active Stock
                  </div>
                  <div className="font-bold">{favoriteStock}</div>
                </div>
                <div className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Best Return</div>
                  <div className="font-bold text-green-400">
                    {bestReturn}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-black/80 neon-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" /> Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="border-b border-cyan-900/20 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex gap-3">
                        <div className="bg-cyan-900/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                          {activity.type === "trade" && (
                            <Briefcase className="w-5 h-5 text-green-400" />
                          )}
                          {activity.type === "news" && (
                            <Award className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold">{activity.name}</h3>
                            <span className="text-xs text-gray-400">
                              {activity.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">
                            {activity.description}
                          </p>

                          {activity.type === "trade" && activity.profit > 0 && (
                            <div className="mt-2 text-xs inline-block px-2 py-0.5 bg-green-900/20 text-green-300 rounded-full">
                              +{activity.profit}% return
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </div>

              {recentActivity.length > 0 && (
                <button className="w-full mt-4 bg-black border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 font-medium py-2 rounded transition-colors text-sm">
                  View All Activity
                </button>
              )}
            </div>
          </div>

          {/* Right column - Badges and achievements */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="bg-black/80 neon-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" /> Badges &
                Achievements
              </h2>

              <div className="space-y-4">
                {earnedBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-black/60 border border-cyan-500/20 p-3 rounded-lg flex items-center gap-3"
                  >
                    <div className="bg-cyan-900/20 w-12 h-12 rounded-full flex items-center justify-center">
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-xs text-gray-400">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="bg-black/40 border border-gray-700 p-3 rounded-lg flex items-center gap-3 opacity-60">
                  <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Stock Expert</h3>
                    <p className="text-xs text-gray-500">
                      Achieve 85% win rate on trades
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-black border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 font-medium py-2 rounded transition-colors text-sm">
                View All Badges ({earnedBadges.length})
              </button>
            </div>

            {/* Learning Progress */}
            <div className="bg-black/80 neon-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" /> Trading Stats
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Market Participation</div>
                    <div className="text-xs text-cyan-300">
                      {Math.min(100, totalTrades * 2)}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full"
                      style={{ width: `${Math.min(100, totalTrades * 2)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Portfolio Diversity</div>
                    <div className="text-xs text-cyan-300">
                      {Math.min(100, Object.keys(stocks).length * 5)}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full"
                      style={{ width: `${Math.min(100, Object.keys(stocks).length * 5)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm">Risk Management</div>
                    <div className="text-xs text-cyan-300">{winRate}%</div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full rounded-full"
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-semibold py-2 rounded transition-all text-sm">
                Analyze Your Trading
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
