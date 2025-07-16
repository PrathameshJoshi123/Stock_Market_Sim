from pydantic import BaseModel

class TradeRequest(BaseModel):
    session_id: str
    username: str
    stock_symbol: str
    trade_type: str  # "buy" or "sell"
    quantity: int
