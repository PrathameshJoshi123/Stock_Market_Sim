// Stock data type
export interface Stock {
  price: number;
  sector: string;
  volatility: number; // 0-1 value representing price volatility
  confidence_index: number; // 0-1 value representing market confidence
  pe_ratio: number; // Price to earnings ratio
  dividend_yield: number; // Dividend yield as decimal
}

// Portfolio - stock name to quantity mapping
export type Portfolio = Record<string, number>;

// News item data
export interface NewsItem {
  company: string;
  headline: string;
  market_impact_score: number; // -1 to 1, negative = bad, positive = good
  global_economic_context: string;
  timestamp?: string;  // Optional as older items might not have it
}

export interface TradeHistory {
  timestamp: string;
  stock: string;
  quantity: number;
  price_per_share: number;
  total_value: number;
  type: string;
  status: string;
}

export interface PerformanceData {
  total_portfolio_value: number;
  cash_balance: number;
  global_market_sentiment: number;
  stock_performances: {
    [key: string]: {
      current_price: number;
      quantity_held: number;
      recent_performance: number[];
      confidence_index: number;
    };
  };
}