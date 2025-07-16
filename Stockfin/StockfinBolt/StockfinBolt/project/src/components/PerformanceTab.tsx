import { useState, useEffect, useMemo } from "react";
import { 
  BarChart3, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  LineChart, 
  PieChart, 
  Timer, 
  Percent, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Check
} from "lucide-react";
import { Stock } from "../types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ScatterController,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ScatterController
);

// Define types for performance data
interface StockPerformance {
  timestamp: string;
  price: number;
  news_impact?: number;
  market_fluctuation?: number;
  headline?: string;
}

interface StockPriceData {
  name: string;
  data: number[];
  labels: string[];
  color: string;
  initialPrice: number;
  currentPrice: number;
}

interface PerformanceTabProps {
  stocks: Record<string, Stock>;
  updateStockPrices: () => void;
  serverConnected?: boolean;
}

// Stock colors for the charts
const STOCK_COLORS = [
  "rgb(75, 192, 192)",  // Teal
  "rgb(255, 99, 132)",  // Pink
  "rgb(54, 162, 235)",  // Blue
  "rgb(255, 159, 64)",  // Orange
  "rgb(153, 102, 255)", // Purple
  "rgb(255, 205, 86)",  // Yellow
  "rgb(201, 203, 207)", // Grey
  "rgb(99, 255, 132)",  // Light Green
  "rgb(255, 99, 71)",   // Tomato
  "rgb(65, 105, 225)"   // Royal Blue
];

export function PerformanceTab({ 
  stocks, 
  updateStockPrices,
  serverConnected = true
}: PerformanceTabProps) {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // Scale factor for y-axis
  const [showAllStocks, setShowAllStocks] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>({});

  // Set initial prices when component mounts or stocks change
  useEffect(() => {
    const newInitialPrices: Record<string, number> = {};
    
    Object.entries(stocks).forEach(([id, stock]) => {
      // Only set initial price if it's not already set
      if (initialPrices[id] === undefined) {
        newInitialPrices[id] = stock.price;
      }
    });
    
    // Update initial prices
    if (Object.keys(newInitialPrices).length > 0) {
      setInitialPrices(prev => ({ ...prev, ...newInitialPrices }));
    }
  }, [stocks]);

  // Toggle stock selection
  const toggleStockSelection = (stockId: string) => {
    setSelectedStocks(prev => 
      prev.includes(stockId) 
        ? prev.filter(id => id !== stockId) 
        : [...prev, stockId]
    );
  };

  // Select/deselect all stocks
  const toggleAllStocks = () => {
    if (showAllStocks) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(Object.keys(stocks));
    }
    setShowAllStocks(!showAllStocks);
  };

  // Manual refresh of stock prices
  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    await updateStockPrices();
    setTimeout(() => setIsRefreshing(false), 600); // Visual feedback
  };

  // Adjust zoom level for chart
  const increaseZoom = () => setZoomLevel(prev => Math.min(prev * 1.5, 10));
  const decreaseZoom = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));

  // Prepare stock data for chart
  const stockPriceData = useMemo(() => {
    const data: StockPriceData[] = [];

    // Get selected stocks or all stocks if none selected
    const stocksToShow = selectedStocks.length > 0 
      ? selectedStocks 
      : Object.keys(stocks).slice(0, 3); // Default to first 3 stocks if none selected
    
    stocksToShow.forEach((stockId, index) => {
      const stock = stocks[stockId];
      if (!stock) return;

      // Get performance data (latest prices over time)
      const performanceData = stock.recent_performance || [];
      
      // Create data arrays for chart
      const priceData = performanceData.map(p => p.price);
      const timeLabels = performanceData.map(p => {
        const date = new Date(p.timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
      
      // Add current price to the arrays
      priceData.push(stock.price);
      timeLabels.push('Now');
      
      data.push({
        name: stock.name,
        data: priceData,
        labels: timeLabels,
        color: STOCK_COLORS[index % STOCK_COLORS.length],
        initialPrice: initialPrices[stockId] || stock.price,
        currentPrice: stock.price
      });
    });
    
    return data;
  }, [stocks, selectedStocks, initialPrices]);

  // Calculate min and max values for chart scale with zoom
  const chartScales = useMemo(() => {
    if (stockPriceData.length === 0) return { min: 0, max: 100 };
    
    // Get all price data
    const allPrices = stockPriceData.flatMap(s => s.data);
    if (allPrices.length === 0) return { min: 0, max: 100 };
    
    // Calculate average price
    const avgPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
    
    // Calculate standard deviation
    const variance = allPrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / allPrices.length;
    const stdDev = Math.sqrt(variance);
    
    // Set scale based on average price and standard deviation, adjusted by zoom level
    const scaleFactor = stdDev * zoomLevel;
    
    return {
      min: Math.max(0, avgPrice - scaleFactor * 3), // Ensure min is not negative
      max: avgPrice + scaleFactor * 3
    };
  }, [stockPriceData, zoomLevel]);

  // Prepare chart data and options
  const chartData = {
    labels: stockPriceData.length > 0 ? stockPriceData[0].labels : [],
    datasets: stockPriceData.map(stock => ({
      label: stock.name,
      data: stock.data,
      borderColor: stock.color,
      backgroundColor: `${stock.color}33`, // Add transparency
      tension: 0.2,
      pointRadius: 3,
      pointHoverRadius: 5,
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    scales: {
      y: {
        beginAtZero: false,
        min: chartScales.min,
        max: chartScales.max,
        title: {
          display: true,
          text: 'Stock Price ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: $${value.toFixed(2)}`;
          }
        }
      },
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Price Performance',
        font: {
          size: 16
        }
      },
    },
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Main chart area */}
      <div className="col-span-8 space-y-4">
        <div className="bg-black/80 neon-border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              <span className="text-gradient-blue">Market Performance</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshPrices}
                className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                Refresh Data
              </button>
              <button
                onClick={increaseZoom}
                className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
              >
                <ZoomIn className="w-4 h-4" /> Zoom In
              </button>
              <button
                onClick={decreaseZoom}
                className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
              >
                <ZoomOut className="w-4 h-4" /> Zoom Out
              </button>
            </div>
          </div>

          {/* Chart container */}
          <div className="h-[400px] w-full">
            {stockPriceData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select stocks to display performance data</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-black/80 neon-border p-4 rounded-lg">
          <h2 className="text-xl flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span className="text-gradient-blue">Session Performance</span>
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {stockPriceData.length > 0 ? (
              stockPriceData.map((stock) => {
                const priceDifference = stock.currentPrice - stock.initialPrice;
                const percentChange = (priceDifference / stock.initialPrice) * 100;
                const isPositive = priceDifference >= 0;
                
                return (
                  <div 
                    key={stock.name} 
                    className={`p-3 border rounded-lg ${
                      isPositive ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{stock.name}</h3>
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-bold">{isPositive ? '+' : ''}{percentChange.toFixed(2)}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400">Initial Price</div>
                        <div className="text-lg">${stock.initialPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Current Price</div>
                        <div className="text-lg">${stock.currentPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Change</div>
                        <div className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}${priceDifference.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Data Points</div>
                        <div className="text-lg">{stock.data.length}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No stocks selected for performance tracking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock selection panel */}
      <div className="col-span-4 space-y-4">
        <div className="bg-black/80 neon-border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <span className="text-gradient-blue">Stock Selection</span>
            </h2>
            <button
              onClick={toggleAllStocks}
              className="flex items-center gap-1 bg-black hover:bg-cyan-900/50 text-cyan-400 py-1 px-3 rounded transition-colors text-sm border border-cyan-500/50 hover:border-cyan-400"
            >
              {showAllStocks ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {Object.entries(stocks).map(([id, stock], index) => {
              const isSelected = selectedStocks.includes(id);
              
              return (
                <div
                  key={id}
                  className={`p-3 border ${
                    isSelected ? 'border-cyan-500 bg-cyan-900/20' : 'border-cyan-500/30'
                  } rounded-lg cursor-pointer hover:bg-cyan-900/20 transition-all`}
                  onClick={() => toggleStockSelection(id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: STOCK_COLORS[index % STOCK_COLORS.length] }}
                      ></div>
                      <h3 className="font-bold">{stock.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-medium mr-2">${stock.price.toFixed(2)}</span>
                      {isSelected && (
                        <div className="bg-cyan-500/20 p-1 rounded">
                          <Check className="w-4 h-4 text-cyan-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-cyan-300 mt-1">{stock.sector}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart controls and insights */}
        <div className="bg-black/80 neon-border p-4 rounded-lg">
          <h2 className="text-xl flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-cyan-400" />
            <span className="text-gradient-blue">Chart Controls</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300">Y-Axis Zoom Level</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseZoom}
                  className="bg-black border border-cyan-500 text-cyan-400 p-2 rounded-l"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 py-2 px-3 bg-black border-t border-b border-cyan-500 text-center">
                  {zoomLevel.toFixed(1)}x
                </div>
                <button
                  onClick={increaseZoom}
                  className="bg-black border border-cyan-500 text-cyan-400 p-2 rounded-r"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Adjust zoom to better visualize small price changes
              </p>
            </div>
            
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-lg mb-2 text-cyan-300">Chart Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mt-1" />
                  <span>Higher zoom levels let you see smaller price fluctuations in detail</span>
                </li>
                <li className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-cyan-400 mt-1" />
                  <span>Performance is measured from the beginning of your trading session</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400 mt-1" />
                  <span>Stock price changes reflect both market conditions and news events</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}