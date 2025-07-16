from fastapi import APIRouter, HTTPException
from schemas import trade as trade_schema
from models import session as session_model
from models import trade as trade_model

router = APIRouter()

@router.post("/submit")
async def submit_trade(trade: trade_schema.TradeRequest):
    session = await session_model.session_collection.find_one({"session_id": trade.session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session["status"] != "running":
        raise HTTPException(status_code=400, detail="Session not running")

    prices = session["market_state"]["prices"]
    if trade.stock_symbol not in prices:
        raise HTTPException(status_code=404, detail="Invalid stock symbol")

    price = prices[trade.stock_symbol]
    total_cost = price * trade.quantity

    portfolios = session.get("player_portfolios", {})
    player = portfolios.get(trade.username, {"cash": 100000, "shares": {symbol: 0 for symbol in prices.keys()}})

    if trade.trade_type == "buy":
        if player["cash"] < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient cash")
        player["cash"] -= total_cost
        player["shares"][trade.stock_symbol] += trade.quantity

    elif trade.trade_type == "sell":
        if player["shares"].get(trade.stock_symbol, 0) < trade.quantity:
            raise HTTPException(status_code=400, detail="Not enough shares")
        player["cash"] += total_cost
        player["shares"][trade.stock_symbol] -= trade.quantity
    else:
        raise HTTPException(status_code=400, detail="Invalid trade type")

    # Update portfolio
    portfolios[trade.username] = player

    # Save trade
    trade_doc = {
        "session_id": trade.session_id,
        "username": trade.username,
        "stock_symbol": trade.stock_symbol,
        "trade_type": trade.trade_type,
        "quantity": trade.quantity,
        "price": price,
    }
    await trade_model.trade_collection.insert_one(trade_doc)

    # Update session in DB
    await session_model.session_collection.update_one(
        {"session_id": trade.session_id},
        {"$set": {"player_portfolios": portfolios}}
    )

    return {"message": "Trade submitted successfully", "cash": player["cash"], "shares": player["shares"]}
