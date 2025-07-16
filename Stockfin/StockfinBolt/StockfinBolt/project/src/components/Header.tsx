import React from "react";
import { ChevronDown, DollarSign, TrendingUp, User, LogOut } from "lucide-react";

interface HeaderProps {
  cash: number;
  portfolioValue: number;
  totalValue: number;
  username?: string;
  onEndSession?: () => void; // Add function to end session
}

export function Header({ cash, portfolioValue, totalValue, username, onEndSession }: HeaderProps) {
  // Format Indian currency (₹)
  const formatIndianRupees = (amount: number) => {
    // Indian number format with lakhs and crores
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  };

  // Force values to be numbers and handle invalid inputs
  const cashValue = typeof cash === 'number' && !isNaN(cash) ? cash : 0;
  const portfolioVal = typeof portfolioValue === 'number' && !isNaN(portfolioValue) ? portfolioValue : 0;
  // Explicitly calculate total from the sanitized values - always recalculate to ensure accuracy
  const totalVal = cashValue + portfolioVal;

  // Add debug logging to help troubleshoot value updates
  React.useEffect(() => {
    console.log("Header received values:", {
      cash,
      portfolioValue,
      totalValue
    });
    
    console.log("Header displaying values:", {
      cash: cashValue,
      portfolio: portfolioVal,
      calculatedTotal: totalVal
    });
  }, [cash, portfolioValue, totalValue, cashValue, portfolioVal, totalVal]);
  
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-cyan-400 tracking-tight mb-2">
          StockFin Terminal
        </h1>
        {username && (
          <div className="flex items-center justify-between">
            <div className="text-gray-300 flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Trader: <span className="text-cyan-300 font-medium">{username}</span></span>
            </div>
            
            {onEndSession && (
              <button 
                onClick={() => {
                  console.log("End session requested");
                  onEndSession();
                }}
                className="ml-4 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                title="End current session and start a new one"
              >
                <LogOut className="w-3 h-3" />
                <span>End Session</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black/60 border border-green-500/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1 text-green-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Cash</span>
          </div>
          <div className="text-xl font-bold text-green-300">{formatIndianRupees(cashValue)}</div>
        </div>
        
        <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Portfolio</span>
          </div>
          <div className="text-xl font-bold text-cyan-300">{formatIndianRupees(portfolioVal)}</div>
        </div>
        
        <div className="bg-black/60 border border-purple-500/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1 text-purple-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total</span>
          </div>
          <div className="text-xl font-bold text-purple-300">{formatIndianRupees(totalVal)}</div>
        </div>
      </div>
    </div>
  );
}
