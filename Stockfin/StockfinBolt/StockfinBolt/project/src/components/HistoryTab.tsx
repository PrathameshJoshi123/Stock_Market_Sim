import React, { useState } from "react";
import {
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  Search,
  ChevronDown,
} from "lucide-react";
import { Trade } from "./StocksTab";
import { TradeHistory } from "../types";

interface HistoryTabProps {
  trades: Trade[];
  tradeHistory: TradeHistory[];
}

export function HistoryTab({ trades, tradeHistory }: HistoryTabProps) {
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  // Format date more nicely
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Filter trades based on current filters
  const filteredTrades = trades.filter((trade) => {
    const matchesType =
      filterType === "all" || trade.type.toLowerCase() === filterType;
    const matchesSearch =
      searchTerm === "" ||
      trade.stockName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 bg-black/80 neon-border rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Trade History
          </h2>

          <div className="flex items-center gap-3">
            {/* Filter toggle buttons */}
            <div className="flex items-center bg-black border border-cyan-500/30 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm ${
                  filterType === "all"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-cyan-500/60 hover:text-cyan-400"
                }`}
                onClick={() => setFilterType("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${
                  filterType === "buy"
                    ? "bg-green-500/20 text-green-300"
                    : "text-cyan-500/60 hover:text-cyan-400"
                }`}
                onClick={() => setFilterType("buy")}
              >
                Buy
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${
                  filterType === "sell"
                    ? "bg-red-500/20 text-red-300"
                    : "text-cyan-500/60 hover:text-cyan-400"
                }`}
                onClick={() => setFilterType("sell")}
              >
                Sell
              </button>
            </div>

            {/* Search box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-black border border-cyan-500/30 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500/60" />
            </div>
          </div>
        </div>

        {/* Trade list */}
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-cyan-500/30 mb-2">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-cyan-500/50">No trade history found</p>
            <p className="text-xs text-cyan-500/30 mt-1">
              Start trading to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredTrades.map((trade, index) => (
              <div
                key={trade.id}
                className={`p-4 border rounded-lg ${
                  trade.type === "Buy"
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {trade.type === "Buy" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-400 mr-2" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-400 mr-2" />
                    )}
                    <div>
                      <span
                        className={`font-bold ${
                          trade.type === "Buy"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.type}
                      </span>
                      <span className="text-cyan-300 ml-2">
                        {trade.stockName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ${(trade.quantity * trade.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {trade.quantity} × ${trade.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700/30 text-sm text-gray-400 flex justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-cyan-500/60" />
                    {formatDate(trade.timestamp)}
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-xs ${
                      trade.type === "Buy"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {trade.type === "Buy" ? "PURCHASED" : "SOLD"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-span-4 space-y-4">
        {/* Trade Statistics */}
        <div className="bg-black/80 neon-border rounded-lg p-4">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyan-400" /> Trade Statistics
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/30">
              <div className="text-sm text-cyan-300 mb-1">Total Trades</div>
              <div className="text-2xl font-bold">{trades.length}</div>
            </div>
            <div className="bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/30">
              <div className="text-sm text-cyan-300 mb-1">Buy/Sell Ratio</div>
              <div className="text-2xl font-bold">
                {Math.round(
                  (trades.filter((t) => t.type === "Buy").length /
                    Math.max(1, trades.length)) *
                    100
                )}
                %
              </div>
            </div>
            <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
              <div className="text-sm text-green-300 mb-1">Buy Volume</div>
              <div className="text-2xl font-bold">
                $
                {trades
                  .filter((t) => t.type === "Buy")
                  .reduce((sum, t) => sum + t.price * t.quantity, 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="bg-red-900/20 p-3 rounded-lg border border-red-500/30">
              <div className="text-sm text-red-300 mb-1">Sell Volume</div>
              <div className="text-2xl font-bold">
                $
                {trades
                  .filter((t) => t.type === "Sell")
                  .reduce((sum, t) => sum + t.price * t.quantity, 0)
                  .toFixed(2)}
              </div>
            </div>
          </div>

          {/* Time range selector */}
          <div className="mt-6">
            <label className="block text-sm text-cyan-300 mb-2">
              Time Range
            </label>
            <div className="relative">
              <select
                className="w-full bg-black border border-cyan-500/50 rounded p-2 pl-3 pr-10 appearance-none text-cyan-100"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-cyan-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Most Active Stocks */}
        <div className="bg-black/80 neon-border rounded-lg p-4">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-cyan-400" /> Most Active
            Stocks
          </h2>

          {trades.length === 0 ? (
            <p className="text-cyan-500/50 text-sm italic">
              No trading activity yet
            </p>
          ) : (
            <div className="space-y-3">
              {/* Get unique stock names and count their trades */}
              {Object.entries(
                trades.reduce((acc, trade) => {
                  acc[trade.stockName] = (acc[trade.stockName] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([stockName, count], index) => (
                  <div
                    key={stockName}
                    className="flex justify-between items-center p-2 border-b border-cyan-900/30 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{stockName}</div>
                      <div className="text-xs text-cyan-500/60">
                        {count} trades
                      </div>
                    </div>
                    <div className="text-sm font-mono bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
