import { Stock, Portfolio } from '../types';
import { Trade } from '../components/StocksTab';

// Save trades to local storage
export const saveTrades = (trades: Trade[]): void => {
  try {
    localStorage.setItem('stockfin_trades', JSON.stringify(trades));
  } catch (error) {
    console.error('Error saving trades to local storage:', error);
  }
};

// Load trades from local storage
export const loadTrades = (): Trade[] => {
  const storedTrades = localStorage.getItem('stockfin_trades');
  if (!storedTrades) return [];
  
  try {
    const parsedTrades = JSON.parse(storedTrades);
    // Convert string timestamps back to Date objects
    return parsedTrades.map((trade: any) => ({
      ...trade,
      timestamp: new Date(trade.timestamp)
    }));
  } catch (error) {
    console.error('Error loading trades:', error);
    return [];
  }
};

// Save portfolio to local storage
export const savePortfolio = (portfolio: Portfolio): void => {
  localStorage.setItem('stockfin_portfolio', JSON.stringify(portfolio));
};

// Load portfolio from local storage
export const loadPortfolio = (): Portfolio => {
  const storedPortfolio = localStorage.getItem('stockfin_portfolio');
  if (!storedPortfolio) return {};
  
  try {
    return JSON.parse(storedPortfolio);
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return {};
  }
};

// Update stock prices with random fluctuations
export const updateStockPrices = (stocks: Record<string, Stock>): Record<string, Stock> => {
  const updatedStocks = { ...stocks };
  
  Object.entries(updatedStocks).forEach(([name, stock]) => {
    // Generate a random price change based on volatility
    const changePercent = (Math.random() - 0.5) * stock.volatility * 2;
    const newPrice = Math.max(0.01, stock.price * (1 + changePercent));
    
    // Update confidence index based on price movement
    const confidenceDelta = (Math.random() - 0.5) * 0.1;
    const newConfidence = Math.max(0.1, Math.min(0.9, stock.confidence_index + confidenceDelta));
    
    // Update the stock data
    updatedStocks[name] = {
      ...stock,
      price: newPrice,
      confidence_index: newConfidence
    };
  });
  
  return updatedStocks;
};
