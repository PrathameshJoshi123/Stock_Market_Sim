import { useState, useEffect } from "react";
import {
  Terminal,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  Radio,
  History,
  X,
} from "lucide-react";
import { Stock, NewsItem } from "../types";

// Define a new Trade type to track transactions
export interface Trade {
  id: string; // Unique identifier
  type: "Buy" | "Sell";
  stockName: string;
  quantity: number;
  price: number;
  timestamp: Date;
}

interface StocksTabProps {
  stocks: Record<string, Stock>;
  selectedStock: string;
  setSelectedStock: (stock: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  executeTrade: (
    type: "Buy" | "Sell",
    stock: string,
    quantity: number,
    price: number
  ) => void;
  news: NewsItem[];
  newsHistory: NewsItem[];  // Add news history prop
  onGenerateNews: () => void;
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  updateStockPrices: () => void; // Function to update stock prices
  serverConnected?: boolean; // Optional prop to show server status
}

// Enhance the trading panel to show better information
export function TradingPanel({ 
  stock, 
  quantity, 
  setQuantity, 
  executeTrade, 
  cash, 
  portfolio 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tradeSuccess, setTradeSuccess] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Always ensure cash is treated as a number and has a valid value
  const safeBalance = typeof cash === 'number' && !isNaN(cash) ? cash : 10000;
  
  // Calculate if user can afford the trade
  const totalCost = stock?.price * quantity;
  const canAffordBuy = safeBalance >= totalCost;
  const hasEnoughToSell = (portfolio[stock?.name] || 0) >= quantity;
  
  // Log current values for debugging
  useEffect(() => {
    if (stock) {
      console.log("TradingPanel values:", {
        stockName: stock.name,
        quantity,
        price: stock.price,
        totalCost,
        availableCash: safeBalance,
        canAfford: canAffordBuy,
        ownedShares: portfolio[stock.name] || 0,
        hasEnoughToSell
      });
    }
  }, [stock, quantity, safeBalance, portfolio, totalCost, canAffordBuy, hasEnoughToSell]);
  
  // Display a warning if user can't afford the buy
  const showBuyWarning = !canAffordBuy && quantity > 0;
  // Display a warning if user doesn't have enough shares to sell
  const showSellWarning = !hasEnoughToSell && quantity > 0;
  
  const handleTrade = async (type) => {
    if (!stock) return;
    
    // Clear any previous status
    setStatusMessage("");
    setTradeSuccess(null);
    
    // Validation before even trying to execute - use safeBalance to ensure accuracy
    if (type === "Buy" && !canAffordBuy) {
      setStatusMessage(`Cannot buy - insufficient funds (need ₹${totalCost.toLocaleString('en-IN')})`);
      return;
    } else if (type === "Sell" && !hasEnoughToSell) {
      setStatusMessage(`Cannot sell - you only own ${portfolio[stock.name] || 0} shares`);
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Log trade attempt with all relevant values
      console.log(`Attempting ${type} trade:`, {
        stock: stock.name,
        quantity,
        price: stock.price,
        totalCost,
        availableCash: safeBalance
      });
      
      const result = await executeTrade(type, stock.name, quantity, stock.price);
      
      if (result) {
        // Success
        setTradeSuccess(true);
        setStatusMessage(`${type} order executed successfully`);
        
        // Reset quantity after successful trade
        setQuantity(1);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setTradeSuccess(null);
          setStatusMessage("");
        }, 3000);
      } else {
        // The executeTrade function returned null, meaning client-side validation failed
        setTradeSuccess(false);
        // Don't set status message here, as the executeTrade function already shows an alert
      }
    } catch (error) {
      // Something went wrong during execution
      setTradeSuccess(false);
      setStatusMessage(`Trade failed: ${error.message}`);
      console.error("Trade execution error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!stock) {
    return (
      <div className="bg-black/60 p-6 rounded-lg flex items-center justify-center">
        <p className="text-cyan-400/60 text-center">Select a stock to trade</p>
      </div>
    );
  }
  
  return (
    <div className="bg-black/60 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">
        Trade {stock.name}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 mb-1">Current Price</p>
          <p className="text-xl font-bold text-cyan-300">
            ₹{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 mb-1">Your Position</p>
          <p className="text-xl font-bold text-cyan-300">
            {portfolio[stock.name] || 0} shares
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="text-gray-300 mb-2 block">Quantity</label>
        <div className="flex items-center">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-800 text-white p-2 rounded-l"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-gray-800 text-center text-white p-2 w-full"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-800 text-white p-2 rounded-r"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-400 mb-1">Total Cost</p>
        <p className="text-2xl font-bold text-cyan-300">
          ₹{(stock.price * quantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
        
        {/* Available Cash Display */}
        <p className="text-gray-400 text-sm mt-1">
          Available: ₹{cash.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </p>
        
        {/* Warnings */}
        {showBuyWarning && (
          <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-red-300 text-sm">
            Insufficient funds for this purchase. You need ₹{(totalCost - cash).toLocaleString('en-IN')} more.
          </div>
        )}
        
        {showSellWarning && (
          <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-red-300 text-sm">
            You only own {portfolio[stock.name] || 0} shares of this stock.
          </div>
        )}
      </div>
      
      {/* Status message */}
      {statusMessage && (
        <div className={`mb-4 p-3 rounded ${
          tradeSuccess ? 'bg-green-900/30 border border-green-500/50 text-green-300' : 
          'bg-red-900/30 border border-red-500/50 text-red-300'
        }`}>
          {statusMessage}
        </div>
      )}
      
      {/* Added a neon boundary around the trading buttons */}
      <div className="border-2 border-cyan-500/30 rounded-lg p-4 bg-black/40 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
        <h3 className="text-cyan-400 text-sm font-mono mb-3 text-center uppercase tracking-wider">Execute Trade</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTrade("Buy")}
            disabled={isProcessing || !canAffordBuy}
            className={`py-3 rounded-lg font-bold ${
              canAffordBuy 
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            } ${isProcessing ? 'opacity-50' : ''}`}
          >
            {isProcessing ? 'Processing...' : 'Buy'}
          </button>
          
          <button
            onClick={() => handleTrade("Sell")}
            disabled={isProcessing || !hasEnoughToSell}
            className={`py-3 rounded-lg font-bold ${
              hasEnoughToSell
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            } ${isProcessing ? 'opacity-50' : ''}`}
          >
            {isProcessing ? 'Processing...' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StocksTab({
  stocks,
  selectedStock,
  setSelectedStock,
  quantity,
  setQuantity,
  executeTrade,
  news,
  newsHistory,
  onGenerateNews,
  trades,
  addTrade,
  updateStockPrices,
  serverConnected = true,
}: StocksTabProps) {
  const [tradeType, setTradeType] = useState<"Buy" | "Sell">("Buy");
  const [showNewsHistory, setShowNewsHistory] = useState(false);
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<{
    message: string;
    type: "success" | "error" | "info" | null;
  }>({ message: "", type: null });
  
  // New state variables for stock display
  const [displayedStocks, setDisplayedStocks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stocksToShow, setStocksToShow] = useState(5);
  
  // Add cash and portfolio to the props for better validation
  const [cash, setCash] = useState(10000);
  const [portfolio, setPortfolio] = useState({});
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Set up the fetch portfolio function to use in both effects
  const fetchPortfolioData = async () => {
    try {
      console.log("Fetching fresh portfolio data...");
      const response = await fetch("http://localhost:8008/portfolio");
      if (response.ok) {
        const data = await response.json();
        
        // Log what we're receiving from the server
        console.log("Portfolio data received from server:", {
          cash_balance: data.cash_balance,
          portfolio: data.portfolio,
          portfolio_value: data.portfolio_value,
          total_value: data.total_value
        });
        
        // Force cash to be a number and handle potential undefined/null values
        const newCash = typeof data.cash_balance === 'number' ? data.cash_balance : 10000;
        
        // Only update if the cash balance is valid
        if (!isNaN(newCash)) {
          setCash(newCash);
          console.log(`Updated cash balance to: ${newCash}`);
        } else {
          console.warn(`Received invalid cash balance: ${data.cash_balance}, using 10000 instead`);
          setCash(10000);
        }
        
        setPortfolio(data.portfolio || {});
        setLastRefresh(Date.now());
      } else {
        console.error("Error fetching portfolio: server returned", response.status);
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };
  
  // Immediate fetch on session init or component mount
  useEffect(() => {
    fetchPortfolioData();
  }, []);
  
  // Force refresh when selectedStock changes
  useEffect(() => {
    fetchPortfolioData();
  }, [selectedStock]);
  
  // Setup periodic refresh with cancellation on unmount
  useEffect(() => {
    console.log("Setting up portfolio refresh interval");
    const intervalId = setInterval(() => {
      console.log("Periodic portfolio refresh triggered");
      fetchPortfolioData();
    }, 10000); // Every 10 seconds
    
    return () => {
      console.log("Clearing portfolio refresh interval");
      clearInterval(intervalId);
    };
  }, []);
  
  // Completely remove any interval logic
  useEffect(() => {
    console.log("StocksTab mounted");
    // Get initial random stocks when the component mounts
    if (Object.keys(stocks).length > 0) {
      setDisplayedStocks(getRandomStocks(5));
    }
    return () => console.log("StocksTab unmounted");
  }, []);
  
  // Update displayed stocks when the stocks object changes
  useEffect(() => {
    if (Object.keys(stocks).length > 0 && displayedStocks.length === 0) {
      setDisplayedStocks(getRandomStocks(5));
    }
  }, [stocks]);
  
  // Function to get random stocks
  const getRandomStocks = (count: number) => {
    const stockIds = Object.keys(stocks);
    if (stockIds.length <= count) return stockIds;
    
    // Fisher-Yates shuffle
    const shuffled = [...stockIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  };
  
  // Function to handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, show random stocks
      setDisplayedStocks(getRandomStocks(stocksToShow));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredStocks = Object.entries(stocks)
      .filter(([id, stock]) => 
        stock.name.toLowerCase().includes(query) || 
        stock.sector.toLowerCase().includes(query) ||
        id.toLowerCase().includes(query)
      )
      .map(([id]) => id);
    
    setDisplayedStocks(filteredStocks.slice(0, stocksToShow));
  };
  
  // Function to show more stocks
  const handleShowMore = () => {
    const newStocksToShow = stocksToShow + 5;
    setStocksToShow(newStocksToShow);
    
    // If search is active, re-run search with new limit
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      // Otherwise, get more random stocks
      setDisplayedStocks(getRandomStocks(newStocksToShow));
    }
  };

  // Enhance the getStockName function to be more robust
  const getStockName = (stockId: string) => {
    if (!stockId || !stocks[stockId]) {
      console.warn(`No stock found with ID: ${stockId}`);
      return stockId || "Unknown Stock";
    }
    return stocks[stockId].name || stockId;
  };

  // Modify the stock ID to be compatible with backend API
  const formatStockIdForAPI = (stockId: string) => {
    // From examining the database.py, we can see that stocks are identified by name
    // Get the actual stock name from the stock object
    const stock = stocks[stockId];
    if (stock && stock.name) {
      return stock.name; // Use the stock name directly for the API
    }
    
    // Fallback to the original ID if stock not found
    return stockId;
  };

  // Handle trade execution
  const handleTrade = async () => {
    if (!selectedStock || !stocks[selectedStock]) {
      setTradeStatus({
        message: "Please select a stock first",
        type: "error",
      });
      return;
    }

    if (quantity <= 0) {
      setTradeStatus({
        message: "Please enter a valid quantity",
        type: "error",
      });
      return;
    }

    const currentPrice = stocks[selectedStock].price;
    const stockName = getStockName(selectedStock);
    const stockNameForAPI = formatStockIdForAPI(selectedStock);
    
    setIsExecutingTrade(true);
    setTradeStatus({
      message: `Processing ${tradeType.toLowerCase()} order for ${stockName}...`,
      type: "info",
    });

    try {
      // Log detailed information for debugging
      console.log(`Executing ${tradeType} trade:`, {
        originalStockId: selectedStock,
        stockNameForAPI: stockNameForAPI,
        stockName: stockName,
        quantity: quantity,
        price: currentPrice
      });
      
      // Use the stock NAME (not ID) for the API call - this is what the backend expects
      await executeTrade(tradeType, stockNameForAPI, quantity, currentPrice);
      
      // Add success message
      setTradeStatus({
        message: `Successfully ${tradeType === "Buy" ? "purchased" : "sold"} ${quantity} shares of ${stockName}`,
        type: "success",
      });
      
      // Reset quantity after successful trade
      setQuantity(1);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setTradeStatus({ message: "", type: null });
      }, 3000);
    } catch (error) {
      console.error("Error in handleTrade:", error);
      
      // Get a more user-friendly error message
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof Error) {
        // Check for specific error patterns
        if (error.message.includes("not found")) {
          errorMessage = `Stock "${stockName}" could not be found using name "${stockNameForAPI}"`;
        } else if (error.message.includes("insufficient")) {
          errorMessage = "Insufficient funds or shares for this transaction";
        } else {
          errorMessage = error.message;
        }
      }
      
      setTradeStatus({
        message: `Failed to execute trade: ${errorMessage}`,
        type: "error",
      });
    } finally {
      setIsExecutingTrade(false);
    }
  };

  // Enhanced debugging information in the stock selection
  const renderStockDetails = () => {
    if (!selectedStock) {
      return "Select a stock from the terminal";
    }
    
    const stock = stocks[selectedStock];
    if (!stock) {
      return `Invalid stock selection (ID: ${selectedStock})`;
    }
    
    // Display both name and ID for clarity
    return (
      <div className="flex flex-col">
        <span className="font-medium">{getStockName(selectedStock)}</span>
        <span className="text-xs text-gray-400">ID: {selectedStock}</span>
      </div>
    );
  };

  const getMarketTrend = (stock: Stock) => {
    if (stock.confidence_index > 0.7) return "strongly-bullish";
    if (stock.confidence_index > 0.5) return "bullish";
    if (stock.confidence_index > 0.3) return "bearish";
    return "strongly-bearish";
  };

  // Get trend description for user insights
  const getMarketTrendDescription = (stock: Stock) => {
    const ci = stock.confidence_index;
    if (ci > 0.7) return "Strong upward momentum expected";
    if (ci > 0.5) return "Moderately positive outlook";
    if (ci > 0.3) return "Slight weakness in market position";
    return "Strong selling pressure present";
  };

  // Format Indian currency (₹)
  const formatIndianRupees = (amount: number) => {
    // Indian number format with lakhs and crores
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  // Update the manual refresh handlers to log activity
  const handleManualRefreshPrices = () => {
    console.log("Manual price refresh requested");
    updateStockPrices();
    // After refreshing prices, update the displayed stocks if not searching
    if (!searchQuery.trim()) {
      setDisplayedStocks(getRandomStocks(stocksToShow));
    }
  };

  const handleManualRefreshNews = () => {
    console.log("Manual news refresh requested");
    onGenerateNews();
  };

  // When calling executeTrade, also refresh portfolio data after completion
  const executeTradeAndRefresh = async (type, stock, quantity, price) => {
    try {
      // First refresh portfolio data to ensure we have the latest balance
      await fetchPortfolioData();
      
      // Then execute the trade with the updated balance
      const result = await executeTrade(type, stock, quantity, price);
      
      // If trade was successful, refresh portfolio data again
      if (result) {
        console.log("Trade successful, refreshing portfolio data");
        // Add a small delay to ensure backend has processed the trade
        setTimeout(() => {
          fetchPortfolioData();
        }, 500);
      }
      
      return result;
    } catch (error) {
      console.error("Trade execution error:", error);
      throw error;
    }
  };

  // Add a manual refresh button handler function that was missing
  const handleRefreshPortfolio = () => {
    console.log("Manual portfolio refresh requested");
    fetchPortfolioData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Stock List */}
        <div className="bg-black/60 rounded-lg p-6 neon-border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-gradient-blue">
                Indian Stock Terminal
              </span>
            </h2>
            <button
              onClick={handleManualRefreshPrices}
              className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Prices
            </button>
          </div>
          
          {/* Search bar */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or sector..."
              className="flex-1 p-2 bg-black border border-cyan-500/50 rounded text-cyan-100"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-700 hover:bg-cyan-600 text-white py-2 px-4 rounded transition-colors"
            >
              Search
            </button>
          </div>

          {Object.keys(stocks).length === 0 ? (
            <div className="text-center py-8 text-cyan-300">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 opacity-50" />
              <p>Loading stock data...</p>
            </div>
          ) : displayedStocks.length === 0 ? (
            <div className="text-center py-8 text-cyan-300">
              <p>No stocks match your search criteria</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setDisplayedStocks(getRandomStocks(stocksToShow));
                }}
                className="mt-2 bg-cyan-700 hover:bg-cyan-600 text-white py-1 px-3 rounded text-sm"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedStocks.map((id) => {
                const data = stocks[id];
                if (!data) return null;
                
                const trend = getMarketTrend(data);
                const displayName = data.name || id;
                const trendDescription = getMarketTrendDescription(data);
                
                return (
                  <div
                    key={id}
                    className={`p-3 border ${
                      selectedStock === id
                        ? "border-cyan-500 bg-cyan-900/20"
                        : "border-cyan-500/30"
                    } rounded-lg cursor-pointer hover:bg-cyan-900/20 transition-all relative overflow-hidden`}
                    onClick={() => setSelectedStock(id)}
                  >
                    {/* Subtle highlight effect */}
                    <div
                      className={`absolute inset-0 opacity-10 ${
                        trend === "strongly-bullish"
                          ? "bg-green-500"
                          : trend === "bullish"
                          ? "bg-green-300"
                          : trend === "bearish"
                          ? "bg-red-300"
                          : "bg-red-500"
                      }`}
                    ></div>

                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <h3 className="font-bold">{displayName}</h3>
                        <p className="text-sm text-cyan-300">{data.sector}</p>
                        <div className="text-xs mt-1 text-gray-300">
                          <span className="mr-2">
                            Vol: {(data.volatility * 100).toFixed(1)}%
                          </span>
                          <span className="mr-2">
                            P/E: {data.pe_ratio.toFixed(2)}
                          </span>
                          <span>
                            Div: {(data.dividend_yield * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs mt-1 italic text-cyan-200/70">
                          {trendDescription}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl">{formatIndianRupees(data.price)}</p>
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            data.confidence_index > 0.5
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {data.confidence_index > 0.5 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{(data.confidence_index * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Show More button */}
              {displayedStocks.length < Object.keys(stocks).length && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleShowMore}
                    className="bg-black hover:bg-cyan-900/50 text-cyan-400 py-2 px-4 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
                  >
                    Show More Stocks
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* News Section */}
        <div className="bg-black/60 rounded-lg p-6 neon-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" /> 
              <span className="text-gradient-blue font-bold tracking-wider uppercase">MARKET DISPATCH</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewsHistory(true)}
                className="bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-xs border border-cyan-500/50 hover:border-cyan-400"
              >
                <History className="w-3 h-3 inline mr-1" /> News Archive
              </button>
              <button
                onClick={handleManualRefreshNews}
                className="bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-xs border border-cyan-500/50 hover:border-cyan-400"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" /> Update
              </button>
              <div className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full flex items-center">
                <span className="animate-pulse mr-1">●</span> LIVE
              </div>
            </div>
          </div>
          
          {/* Newspaper-style masthead */}
          <div className="border-b-2 border-cyan-500/30 mb-3 flex items-center justify-between pb-1">
            <div className="text-xs text-cyan-300">
              DIGITAL FINANCE MONITOR
            </div>
            <div className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          {news.length === 0 ? (
            <div className="text-center py-8 text-cyan-300">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 opacity-50" />
              <p>Loading market news...</p>
            </div>
          ) : (
            <div className="max-h-[240px] overflow-y-auto pr-2">
              {/* Main headline - first news item gets special treatment */}
              {news.length > 0 && (
                <div className={`mb-4 p-3 border rounded-lg ${
                  news[0].market_impact_score > 0
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-cyan-400 mb-1 font-bold">
                        BREAKING NEWS
                      </div>
                      <h3 className="font-bold text-lg mb-1 leading-tight">
                        {news[0].headline}
                      </h3>
                      <div className="text-sm font-semibold mb-1 text-cyan-200">
                        {news[0].company}
                      </div>
                      <div className="mt-2 text-xs bg-gray-800/50 p-2 rounded border-l-2 border-cyan-500">
                        <div className="font-serif italic text-gray-300">
                          {news[0].global_economic_context}
                        </div>
                      </div>
                    </div>
                    <div className="ml-3 shrink-0">
                      <span className={`px-2 py-1 rounded-full ${
                        news[0].market_impact_score > 0
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      } inline-block text-sm font-mono`}>
                        {news[0].market_impact_score > 0 ? "+" : ""}
                        {(news[0].market_impact_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span className="font-bold">MARKET ANALYSIS</span>
                    <span>{Math.floor(Math.random() * 60) + 1}m ago</span>
                  </div>
                </div>
              )}
              
              {/* News columns - the rest of the items */}
              <div className="grid grid-cols-2 gap-3">
                {news.slice(1).map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${
                      item.market_impact_score > 0
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="uppercase text-xs font-bold tracking-wider text-gray-400 mb-1">
                        {index % 3 === 0 ? "FINANCE" : index % 3 === 1 ? "MARKETS" : "ECONOMY"}
                      </div>
                      <h4 className="font-bold mb-1 leading-tight">{item.headline}</h4>
                      <div className="text-xs text-cyan-300 mb-1">{item.company}</div>
                      <div className="mt-auto pt-2 flex justify-between items-end">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.market_impact_score > 0
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {item.market_impact_score > 0 ? "+" : ""}
                          {(item.market_impact_score * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-400">
                          {Math.floor(Math.random() * 60) + 1}m ago
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Portfolio refresh button */}
        <div className="flex justify-end mb-[-20px] z-10">
          <button
            onClick={handleRefreshPortfolio}
            className="bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-xs border border-cyan-500/50 hover:border-cyan-400"
          >
            <RefreshCw className="w-3 h-3 inline mr-1" /> Refresh Balance
          </button>
        </div>
        
        {/* Add a very prominent border around the entire trading area */}
        <div className="border-2 border-cyan-500 rounded-lg p-2 bg-gradient-to-b from-black/80 to-black/60 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          {/* Trading Panel information header */}
          <div className="mb-2 bg-cyan-900/30 border-b border-cyan-500/40 rounded-t-lg py-2 px-3">
            <h2 className="text-sm font-mono text-cyan-300 uppercase tracking-wider text-center">
              Trading Terminal - Your Cash: 
              <span className="ml-2 text-base text-green-400 font-bold">
                ₹{cash.toLocaleString('en-IN')}
              </span>
            </h2>
          </div>
          
          {/* Trading Panel - Pass cash and portfolio */}
          <TradingPanel
            stock={selectedStock ? stocks[selectedStock] : null}
            quantity={quantity}
            setQuantity={setQuantity}
            executeTrade={executeTradeAndRefresh} // Use the wrapped version that refreshes data
            cash={cash}
            portfolio={portfolio}
          />
        </div>

        {/* Recent Trades */}
        <div className="bg-black/60 rounded-lg p-6">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" /> Recent Transactions
          </h2>
          
          {trades.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No trading activity yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {trades.slice(0, 10).map((trade) => (
                <div 
                  key={trade.id}
                  className={`p-3 border rounded-lg ${
                    trade.type === "Buy" 
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      trade.type === "Buy"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {trade.type}
                    </span>
                    <span className="text-gray-300 text-xs">
                      {new Date(trade.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold">
                      {getStockName(trade.stockName)}
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <div>Quantity: {trade.quantity}</div>
                      <div>Price: {formatIndianRupees(trade.price)}</div>
                    </div>
                    <div className="text-right text-sm mt-1 font-bold">
                      Total: {formatIndianRupees(trade.quantity * trade.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News History Modal */}
      {showNewsHistory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-black/90 neon-border rounded-lg w-3/4 max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center border-b border-cyan-500/30 p-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" /> 
                <span className="text-gradient-blue font-bold tracking-wider uppercase">DIGITAL FINANCE CHRONICLE</span>
              </h3>
              <button 
                onClick={() => setShowNewsHistory(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Newspaper masthead */}
            <div className="border-b border-cyan-500/30 px-4 py-2 bg-cyan-900/20 flex justify-between items-center">
              <div className="text-xs text-gray-300">MARKET NEWS ARCHIVE</div>
              <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
            </div>
            
            <div className="overflow-y-auto p-4 flex-grow">
              {newsHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No historical news data available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newsHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${
                        item.market_impact_score > 0
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <div className="border-b border-gray-700 pb-1 mb-2">
                        <div className="text-xs uppercase tracking-wider text-cyan-400 mb-1">
                          {index % 4 === 0 ? "MARKETS" : 
                           index % 4 === 1 ? "STOCKS" : 
                           index % 4 === 2 ? "ANALYSIS" : "ECONOMY"}
                        </div>
                      </div>
                      <h4 className="font-bold mb-2 leading-tight">{item.headline}</h4>
                      <p className="text-sm font-medium mb-2 text-cyan-200">{item.company}</p>
                      <div className="mt-2 text-xs bg-gray-800/50 p-2 rounded border-l-2 border-cyan-500 font-serif italic">
                        {item.global_economic_context}
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            item.market_impact_score > 0
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {item.market_impact_score > 0 ? "+" : ""}
                          {(item.market_impact_score * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-cyan-500/30 p-3 text-center">
              <button 
                onClick={() => setShowNewsHistory(false)}
                className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 px-6 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
