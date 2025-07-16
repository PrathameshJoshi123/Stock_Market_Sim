import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { StocksTab, Trade } from "./components/StocksTab";
import { HistoryTab } from "./components/HistoryTab";
import { PerformanceTab } from "./components/PerformanceTab";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CompetitionsPage } from "./pages/CompetitionsPage";
import { LearningPage } from "./pages/LearningPage";
import { SimulationModesPage } from "./pages/SimulationModesPage";
import {
  Stock,
  Portfolio,
  NewsItem,
  TradeHistory,
  PerformanceData,
} from "./types";
import {
  updateStockPrices as updatePrices,
  saveTrades,
  loadTrades,
  savePortfolio,
  loadPortfolio,
} from "./utils/stockUtils";
import { Terminal, Github, User, DollarSign, X, Radio } from "lucide-react";
import { debugLog, createTrackedFetch } from "./utils/debugging";
import LobbyPage from "./pages/Lobby";

// Initialize fetch tracking
const restoreOriginalFetch = createTrackedFetch();

// Component to show debug info
function DebugPanel({ show = false }) {
  const [apiCalls, setApiCalls] = useState({});
  
  useEffect(() => {
    if (!show) return;
    
    // Update API call counts every second
    const interval = setInterval(() => {
      // Import needs to be dynamic to avoid circular dependencies
      const { APICallTracker } = require('./utils/debugging');
      setApiCalls(APICallTracker.getSummary());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white text-xs p-2 z-50">
      <h4>API Calls:</h4>
      <pre>{JSON.stringify(apiCalls, null, 2)}</pre>
    </div>
  );
}

// Initial stock data - will be replaced with API data
const initialStocks: Record<string, Stock> = {};

// Initial news items - will be replaced with API data
const initialNews: NewsItem[] = [];

// Layout component that includes navigation for all main pages
function AppLayout() {
  return (
    <div className="min-h-screen p-6 relative">
      {/* Background grid effect */}
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

      {/* Glowing orb effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-2xl"></div>

      {/* App content */}
      <div className="relative z-10 max-w-[1440px] mx-auto">
        <Navigation />

        <main className="mb-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 pt-4 mt-8 text-sm text-cyan-500/60 font-mono">
          <div className="flex justify-between items-center">
            <div>StockFin v1.0 - Real-time Multiplayer Trading Simulator</div>
            <a
              href="https://github.com"
              className="flex items-center gap-2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" /> Source
            </a>
          </div>
        </footer>
      </div>
      
      {/* Debug panel (only in development) */}
      <DebugPanel show={(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false} />
    </div>
  );
}

// Breaking news display component
function BreakingNewsDisplay({ news, onClose }) {
  useEffect(() => {
    // Auto close after 10 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Added null and empty array check to avoid errors
  if (!news || !Array.isArray(news) || news.length === 0) {
    return null;
  }
  
  // Use the first news item for the breaking display
  const topNews = news[0];
  
  // Add check for all required properties
  if (!topNews || !topNews.headline || topNews.market_impact_score === undefined) {
    console.error("Invalid news item:", topNews);
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="bg-black/80 border-2 border-cyan-500 rounded-lg p-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Radio className="w-6 h-6 text-red-500 animate-pulse" />
            <h2 className="text-3xl font-bold uppercase tracking-widest text-red-500">
              Breaking News
            </h2>
          </div>
          
          <h3 className="text-4xl font-bold mb-6 text-white">
            {topNews.headline}
          </h3>
          
          <div className="flex justify-center items-center mb-6">
            <div className={`text-xl px-4 py-2 rounded-lg font-mono ${
              topNews.market_impact_score > 0
                ? "bg-green-500/30 text-green-300 border border-green-500"
                : "bg-red-500/30 text-red-300 border border-red-500"
            }`}>
              MARKET IMPACT: {topNews.market_impact_score > 0 ? "+" : ""}
              {(topNews.market_impact_score * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="text-2xl font-semibold mb-4 text-cyan-300">
            {topNews.company}
          </div>
          
          <div className="text-xl italic font-serif text-gray-300 mb-8 max-w-2xl mx-auto">
            {topNews.global_economic_context}
          </div>
          
          <div className="text-sm text-gray-400">
            This breaking news will impact the market. Prepare your trading strategy accordingly.
          </div>
          
          <div className="mt-6 text-gray-500">
            Auto-closing in a few seconds...
          </div>
        </div>
      </div>
    </div>
  );
}

// Username entry modal component
function SessionInitModal({ onStartSession }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    onStartSession(username);
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-black/80 neon-border rounded-lg">
        <div className="text-center mb-6">
          <Terminal className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cyan-500 mb-2">
            STOCKFIN TERMINAL
          </h2>
          <p className="text-cyan-300 font-mono">
            Initialize your trading session
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              <User className="w-4 h-4 inline mr-2" />
              Enter Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your trading name"
              className="w-full bg-black border border-cyan-500 rounded p-3 text-cyan-100"
              autoFocus
            />
            {error && <p className="mt-1 text-red-400 text-sm">{error}</p>}
          </div>
          
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-green-400">Initial Balance</h3>
            </div>
            <p className="text-gray-300">
              You will receive ₹10,000 in virtual currency to start trading.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-black bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all"
          >
            START SESSION
          </button>
        </form>
        
        <div className="mt-6 text-xs text-center text-gray-500">
          This is a simulated trading environment. No real money is involved.
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  // State management
  const [stocks, setStocks] = useState<Record<string, Stock>>(initialStocks);
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [trades, setTrades] = useState<Trade[]>([]);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [activeTab, setActiveTab] = useState<
    "stocks" | "history" | "performance"
  >("stocks");
  const [cash, setCash] = useState(10000);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  // Restore the performanceData state
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsHistory, setNewsHistory] = useState<NewsItem[]>([]);
  const [serverConnected, setServerConnected] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [showBreakingNews, setShowBreakingNews] = useState(false);

  // Define fetchAllData first before using it in initializeSession
  const fetchStocks = async () => {
    console.log("Fetching stocks...");
    try {
      const response = await fetch("http://localhost:8008/stocks");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStocks(data);
      setServerConnected(true);
      return data;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setServerConnected(false);
      throw error; // Re-throw to let Promise.allSettled catch it
    }
  };

  const fetchPortfolio = async () => {
    try {
      // Don't fetch portfolio if we're still in loading state after reset
      if (loading && cash === 10000 && portfolioValue === 0) {
        console.log("Skipping portfolio fetch during initialization");
        return {
          portfolio: {},
          cash_balance: 10000,
          portfolio_value: 0
        };
      }
      
      console.log("Fetching portfolio data from server...");
      const response = await fetch("http://localhost:8008/portfolio");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      console.log("Portfolio data received from server:", data);
      
      // Only update state if we're not in the initialization process
      if (!loading) {
        // Update portfolio holdings
        setPortfolio(data.portfolio || {});
        
        // Update cash balance 
        setCash(data.cash_balance);
        
        // Update portfolio value
        setPortfolioValue(data.portfolio_value || 0);
        
        console.log("Updated financial state after portfolio fetch:", {
          portfolio: data.portfolio,
          cash: data.cash_balance,
          portfolioValue: data.portfolio_value,
          totalValue: data.cash_balance + data.portfolio_value
        });
      } else {
        console.log("Got portfolio data but not updating state during loading:", data);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  };

  const fetchNews = async () => {
    console.log("Fetching news...");
    try {
      const response = await fetch("http://localhost:8008/news");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNews(data);
      setServerConnected(true);
      return data;
    } catch (error) {
      console.error("Error fetching news:", error);
      setServerConnected(false);
      throw error; // Re-throw to let Promise.allSettled catch it
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const response = await fetch("http://localhost:8008/trading-history");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTradeHistory(data);
      return data;
    } catch (error) {
      console.error("Error fetching trade history:", error);
      return null;
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch("http://localhost:8008/performance");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // No longer setting unused performance data state
      setPerformanceData(data);
      return data;
    } catch (error) {
      console.error("Error fetching performance:", error);
      return null;
    }
  };

  const fetchNewsHistory = async () => {
    try {
      const response = await fetch("http://localhost:8008/news-history");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNewsHistory(data);
      return data;
    } catch (error) {
      console.error("Error fetching news history:", error);
      return null;
    }
  };

  // Modify fetchAllData to handle errors more gracefully
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Skip portfolio fetch during initialization
      if (sessionInitialized && cash === 10000 && portfolioValue === 0) {
        console.log("Recently initialized session - using selective fetch");
        await Promise.allSettled([
          fetchStocks(),
          fetchNews(),
          fetchTradeHistory(),
          fetchPerformance(),
          fetchNewsHistory(),
        ]);
      } else {
        // Normal fetch for established session
        const results = await Promise.allSettled([
          fetchStocks(),
          fetchPortfolio(),
          fetchNews(),
          fetchTradeHistory(),
          fetchPerformance(),
          fetchNewsHistory(),
        ]);
        
        console.log("All data fetch results:", results.map(r => r.status));
        
        // Check if any critical requests failed
        const criticalRequests = [results[0], results[1], results[2]];
        const anyFailed = criticalRequests.some(r => r.status === 'rejected');
        
        setServerConnected(!anyFailed);
        
        // Initialize with defaults for any failed fetches
        if (results[0].status === 'rejected') {
          console.warn("Stock fetch failed, using empty object");
          setStocks({});
        }
        
        if (results[1].status === 'rejected') {
          console.warn("Portfolio fetch failed, using empty object");
          setPortfolio({});
        }
        
        if (results[2].status === 'rejected') {
          console.warn("News fetch failed, using empty array");
          setNews([]);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setServerConnected(false);
      // Set defaults for critical data to prevent UI issues
      setStocks({});
      setPortfolio({});
      setNews([]);
    } finally {
      // Log current financial state
      console.log("Financial state after data fetch:", {
        cash,
        portfolioValue,
        total: cash + portfolioValue
      });
      
      // Show loading effect for at least 1 second for UX purposes
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // Function to reset all session data
  const resetSessionData = useCallback(() => {
    console.log("RESETTING SESSION DATA - START");
    
    // Reset all trading and portfolio data
    setStocks(initialStocks);
    setSelectedStock("");
    setQuantity(1);
    setPortfolio({});
    setTrades([]);
    setNews(initialNews);
    setActiveTab("stocks");
    
    // Force reset these financial values with explicit values
    setCash(10000);
    setPortfolioValue(0);
    
    setTradeHistory([]);
    setPerformanceData(null);
    setNewsHistory([]);
    
    // Clear local storage data to prevent persisting between sessions
    localStorage.removeItem('stockfin_trades');
    localStorage.removeItem('stockfin_portfolio');
    
    console.log("RESETTING SESSION DATA - COMPLETE");
  }, []);

  // Initialize session with username - now fetchAllData is defined before this
  const initializeSession = useCallback(async (name: string) => {
    console.log("========= INITIALIZING NEW SESSION =========");
    setLoading(true);
    
    // Reset all state first before doing anything else
    resetSessionData();
    
    // Set username after reset
    setUsername(name);
    
    try {
      // Make hard reset call to server first - this is a new endpoint we should implement
      try {
        console.log("Requesting hard reset from server");
        const resetResponse = await fetch("http://localhost:8008/reset-server-state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reset_type: "hard"
          }),
        });
        
        if (resetResponse.ok) {
          console.log("Server state reset successful");
        } else {
          console.warn("Server state reset failed, will continue with local reset only");
        }
      } catch (error) {
        console.error("Failed to reset server state:", error);
        // Continue with initialization even if server reset fails
      }
      
      // Explicit delay to ensure reset takes effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new session with explicit values
      try {
        console.log(`Initializing session for ${name} with initial balance 10000`);
        const response = await fetch("http://localhost:8008/initialize-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            initial_balance: 10000, // ₹10,000 initial balance
            force_reset: true  // Add a flag to force reset on server side
          }),
        });
        
        if (!response.ok) {
          throw new Error("Session initialization failed");
        }
        
        console.log("Session initialized successfully with server");
        
        // For extra safety, set the values again after server initialization
        setCash(10000);
        setPortfolioValue(0);
        
      } catch (error) {
        console.error("Error initializing session with server:", error);
        // Continue with client-side only
        setCash(10000);
        setPortfolioValue(0);
      }
      
      // Give time for initial values to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch initial data but don't use portfolio data
      try {
        // Only fetch stocks and news first, skip portfolio to avoid overriding our reset values
        await Promise.all([
          fetchStocks(),
          fetchNews(),
          fetchTradeHistory(),
          fetchPerformance(),
          fetchNewsHistory()
        ]);
        
        console.log("Initial stock and news data fetched");
        
        // Verify values weren't changed
        console.log("Cash and portfolio after initial fetch:", {
          cash,
          portfolioValue
        });
        
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setServerConnected(false);
      }
      
      setSessionInitialized(true);
      
      // Show breaking news after initializing session
      if (news && news.length > 0) {
        setShowBreakingNews(true);
      }
    } catch (error) {
      console.error("Session initialization failed completely:", error);
      setSessionInitialized(true); // Still show the UI
      setServerConnected(false);
    } finally {
      // Force the values one more time before removing loading state
      setCash(10000);
      setPortfolioValue(0);
      
      console.log("Final values before showing UI:", {
        cash: 10000, 
        portfolioValue: 0, 
        total: 10000
      });
      
      setLoading(false);
      console.log("========= SESSION INITIALIZATION COMPLETE =========");
    }
  }, [resetSessionData, fetchStocks, fetchNews, fetchTradeHistory, fetchPerformance, fetchNewsHistory]);

  // Function to end the current session - moved up to maintain consistent hook order
  const endSession = useCallback(() => {
    console.log("========= ENDING SESSION =========");
    
    // First attempt to tell server to reset
    fetch("http://localhost:8008/reset-server-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reset_type: "hard"
      }),
    }).catch(error => {
      console.error("Error resetting server state:", error);
    });
    
    // Reset all session data including financial values
    resetSessionData();
    
    // Set sessionInitialized to false to show the login screen again
    setSessionInitialized(false);
    setUsername("");
    
    console.log("========= SESSION ENDED =========");
  }, [resetSessionData]);

  // Load saved data on component mount
  useEffect(() => {
    // Don't load data until session is initialized
    if (!sessionInitialized) return;
    
    // Don't load saved trades/portfolio from localStorage anymore
    // Each session starts fresh
    
    // Initial data fetch
    fetchAllData();

    // Add logging to track interval creation
    console.log("Setting up API call intervals");
    
    // Store interval IDs so they can be properly cleared
    const stocksInterval = setInterval(() => {
      console.log("Stock interval triggered");
      fetchStocks();
    }, 30000);     // Every 30 seconds
    
    const newsInterval = setInterval(() => {
      console.log("News interval triggered");
      fetchNews();
    }, 60000);         // Every 60 seconds
    
    const newsHistoryInterval = setInterval(() => {
      console.log("News history interval triggered");
      fetchNewsHistory();
    }, 30000); // Every 30 seconds
    
    const performanceInterval = setInterval(() => {
      console.log("Performance interval triggered");
      fetchPerformance();
    }, 300000); // Every 5 minutes

    // Clean up all intervals on unmount with logging
    return () => {
      console.log("Clearing all intervals");
      clearInterval(stocksInterval);
      clearInterval(newsInterval);
      clearInterval(newsHistoryInterval);
      clearInterval(performanceInterval);
    };
  }, [sessionInitialized]);

  // Add a new trade and update portfolio
  const addTrade = useCallback((trade: Trade) => {
    setTrades((prevTrades) => {
      const newTrades = [trade, ...prevTrades];
      saveTrades(newTrades);
      return newTrades;
    });
  }, []);

  // Enhanced executeTrade with better error handling and UI feedback
  const executeTrade = useCallback(
    async (type: "Buy" | "Sell", stock: string, quantity: number, price: number) => {
      if (!stock) return;

      try {
        // First fetch the latest portfolio data to ensure we have current cash balance
        let currentCash = cash;
        let currentPortfolio = { ...portfolio };
        
        try {
          console.log("Fetching latest portfolio data before trade execution");
          const response = await fetch("http://localhost:8008/portfolio");
          if (response.ok) {
            const data = await response.json();
            currentCash = data.cash_balance;
            currentPortfolio = data.portfolio || {};
            
            // Update local state with these values
            setCash(currentCash);
            setPortfolio(currentPortfolio);
            
            console.log("Updated cash balance before trade:", currentCash);
          }
        } catch (error) {
          console.warn("Failed to fetch latest portfolio data, using cached values:", error);
        }
        
        // Client-side validation before making API call with LATEST data
        const totalCost = quantity * price;
        
        // Validate trade parameters with more details
        if (type === "Buy") {
          // Don't allow buying if cost exceeds available cash - use currentCash
          if (totalCost > currentCash) {
            const formattedTotal = totalCost.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2
            });
            
            const formattedCash = currentCash.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 2
            });
            
            console.error(`Insufficient funds. Required: ${formattedTotal}, Available: ${formattedCash}`);
            
            // Show a nicer error message
            alert(`You have insufficient funds to complete this trade.\n\nRequired: ${formattedTotal}\nAvailable: ${formattedCash}`);
            return null;
          }
        } else if (type === "Sell") {
          // Don't allow selling more than owned - use currentPortfolio
          const ownedQuantity = currentPortfolio[stock] || 0;
          if (quantity > ownedQuantity) {
            alert(`You can't sell ${quantity} shares of ${stock} as you only own ${ownedQuantity} shares.`);
            return null;
          }
        }
        
        console.log(`Executing ${type} trade: ${quantity} shares of ${stock} at ₹${price}`);
        
        // Call the API to execute the trade
        const response = await fetch("http://localhost:8008/trade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: stock,
            quantity: quantity,
            trade_type: type,
          }),
        });

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Trade failed with server error:", errorData);
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        // Trade successful
        const tradeResult = await response.json();
        console.log("Trade result from server:", tradeResult);

        // Create a trade record to display in UI
        const newTrade: Trade = {
          id: tradeResult.timestamp || Date.now().toString(),
          type: type,
          stockName: stock,
          quantity: quantity,
          price: price,
          timestamp: new Date(tradeResult.timestamp || Date.now()),
        };

        // Add to local trade history
        addTrade(newTrade);
        
        // Immediately update local state to reflect the trade while waiting for server
        if (type === "Buy") {
          // Update cash (decrease)
          setCash(prevCash => {
            const newCash = prevCash - totalCost;
            console.log(`Updated cash after buy: ${prevCash.toFixed(2)} -> ${newCash.toFixed(2)}`);
            return newCash;
          });
          
          // Update portfolio (add shares)
          setPortfolio(prevPortfolio => {
            const updatedPortfolio = { ...prevPortfolio };
            updatedPortfolio[stock] = (updatedPortfolio[stock] || 0) + quantity;
            console.log(`Updated portfolio after buy:`, updatedPortfolio);
            return updatedPortfolio;
          });
          
          // Update portfolio value - make sure we're actually adding to it
          setPortfolioValue(prevValue => {
            const newValue = prevValue + totalCost;
            console.log(`Updated portfolio value after buy: ${prevValue.toFixed(2)} -> ${newValue.toFixed(2)}`);
            return newValue;
          });
        } else if (type === "Sell") {
          // Update cash (increase)
          setCash(prevCash => {
            const newCash = prevCash + totalCost;
            console.log(`Updated cash after sell: ${prevCash.toFixed(2)} -> ${newCash.toFixed(2)}`);
            return newCash;
          });
          
          // Update portfolio (remove shares)
          setPortfolio(prevPortfolio => {
            const updatedPortfolio = { ...prevPortfolio };
            updatedPortfolio[stock] = (updatedPortfolio[stock] || 0) - quantity;
            // Remove stock from portfolio if quantity is 0
            if (updatedPortfolio[stock] <= 0) {
              delete updatedPortfolio[stock];
            }
            console.log(`Updated portfolio after sell:`, updatedPortfolio);
            return updatedPortfolio;
          });
          
          // Update portfolio value
          setPortfolioValue(prevValue => {
            const newValue = Math.max(0, prevValue - totalCost);
            console.log(`Updated portfolio value after sell: ${prevValue.toFixed(2)} -> ${newValue.toFixed(2)}`);
            return newValue;
          });
        }
        
        // Now fetch from the server to ensure our data is synced with backend
        console.log("Refreshing portfolio data from server after trade");
        await fetchPortfolio();
        
        // Also update the stocks data to ensure all calculations are accurate
        await fetchStocks();
        
        return tradeResult;
      } catch (error) {
        console.error("Error executing trade:", error);
        
        // Create a more user-friendly error message
        let errorMessage = "An unknown error occurred while executing the trade.";
        
        // Check if this is a server connection issue
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          setServerConnected(false);
          errorMessage = 'Server disconnected. Unable to execute trade.';
        } else if (error instanceof Error) {
          // Extract the most useful part of the error message
          // If it's the insufficient funds error, format it nicely
          if (error.message.includes("Insufficient funds")) {
            const matches = error.message.match(/Required: ₹([\d.]+), Available: ₹([\d.]+)/);
            if (matches && matches.length >= 3) {
              const required = parseFloat(matches[1]);
              const available = parseFloat(matches[2]);
              errorMessage = `Insufficient funds for this trade.\n\nRequired: ${required.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}\nAvailable: ${available.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}`;
            } else {
              errorMessage = error.message;
            }
          } else {
            errorMessage = error.message;
          }
        }
        
        // Show a formatted alert with the error
        alert(`Trade failed: ${errorMessage}`);
        
        return null;
      }
    },
    [cash, portfolio, addTrade, fetchPortfolio, fetchStocks]
  );

  const updateStockPrices = useCallback(async () => {
    console.log("Manual stock price update requested");
    await fetchStocks();
  }, []);

  const generateNews = useCallback(async () => {
    console.log("Manual news generation requested");
    try {
      await fetchNews();
      // Short delay before fetching stocks to ensure news impact is applied
      setTimeout(async () => {
        await fetchStocks();
      }, 500);
    } catch (error) {
      console.error("Error generating news:", error);
      setServerConnected(false);
    }
  }, []);

  // If session not initialized, show session init modal
  if (!sessionInitialized) {
    return <SessionInitModal onStartSession={initializeSession} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4">
            <Terminal className="w-16 h-16 text-cyan-500 animate-pulse mx-auto" />
          </div>
          <h1
            className="text-3xl font-bold text-cyan-500 mb-2 glitch-text"
            data-text="STOCKFIN"
          >
            STOCKFIN
          </h1>
          <p className="text-cyan-300 font-mono">
            Initializing trading system for {username}...
          </p>
          <div className="mt-4 w-64 h-1 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-cyan-500 animate-[pulse_1.5s_ease-in-out_infinite]"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Add a server disconnection banner
  if (!serverConnected && !loading) {
    return (
      <div>
        <Header
          cash={cash}
          portfolioValue={portfolioValue}
          totalValue={cash + portfolioValue}
        />
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 text-center">
          <h2 className="text-xl font-bold text-red-200 mb-2">Server Disconnected</h2>
          <p className="text-red-100 mb-4">
            Unable to connect to the stock market server. Please check your connection and try again.
          </p>
          <button
            onClick={fetchAllData}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Retry Connection
          </button>
        </div>

        {/* Still show tab navigation, but disable functionality */}
        <div className="mb-6 opacity-50">
          <div className="flex gap-1">
            <button
              className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "stocks"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("stocks")}
            >
              <span>Stocks</span>
            </button>

            <button
              className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("history")}
            >
              <span>History</span>
            </button>

            <button
              className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
                activeTab === "performance"
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                  : "bg-black/60 text-cyan-400 hover:bg-black/40"
              }`}
              onClick={() => setActiveTab("performance")}
            >
              <span>Performance</span>
            </button>
          </div>
        </div>

        <div className="bg-black/80 neon-border p-8 rounded-lg text-center text-gray-400">
          <p className="mb-4">Stock market data is currently unavailable.</p>
          <p>Please check if the server is running or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showBreakingNews && news && news.length > 0 && (
        <BreakingNewsDisplay 
          news={news} 
          onClose={() => setShowBreakingNews(false)} 
        />
      )}
      
      <Header
        cash={cash}
        portfolioValue={portfolioValue}
        totalValue={cash + portfolioValue}
        username={username}
        onEndSession={endSession}
      />

      <div className="mb-6">
        <div className="flex gap-1">
          <button
            className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "stocks"
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                : "bg-black/60 text-cyan-400 hover:bg-black/40"
            }`}
            onClick={() => setActiveTab("stocks")}
          >
            <span>Stocks</span>
          </button>

          <button
            className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                : "bg-black/60 text-cyan-400 hover:bg-black/40"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <span>History</span>
          </button>

          <button
            className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "performance"
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
                : "bg-black/60 text-cyan-400 hover:bg-black/40"
            }`}
            onClick={() => setActiveTab("performance")}
          >
            <span>Performance</span>
          </button>
        </div>
      </div>

      {activeTab === "stocks" && (
        <StocksTab
          stocks={stocks}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          quantity={quantity}
          setQuantity={setQuantity}
          executeTrade={executeTrade}
          news={news}
          newsHistory={newsHistory}
          onGenerateNews={generateNews}
          trades={trades}
          addTrade={addTrade}
          updateStockPrices={updateStockPrices}
          serverConnected={serverConnected}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab trades={trades} tradeHistory={tradeHistory} />
      )}

      {activeTab === "performance" && (
        <PerformanceTab
          stocks={stocks}
          updateStockPrices={updateStockPrices}
          serverConnected={serverConnected}
        />
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication - in real app would use proper auth
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LandingPage onLogin={handleLogin} />
            )
          }
        />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage 
            username="Trader"
            joinDate={new Date().toLocaleDateString()}
            portfolioValue={0}
            cashBalance={10000}
            trades={[]}
            stocks={{}}
            newsHistory={[]}
          />} />
          <Route path='/lobby' element={<LobbyPage/>}/>
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/simulations" element={<SimulationModesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
