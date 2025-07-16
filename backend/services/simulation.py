import asyncio
import random
from models import session as session_model
from sockets import sio
from models import trade as trade_model
from services.news_generator import generate_news

# Example companies (can pass your custom list)
COMPANIES = ["Tesla", "Apple", "Google", "Microsoft", "Amazon"]

# Initial price range
INITIAL_PRICES = {company: random.uniform(50, 200) for company in COMPANIES}

# Example demand impact
def calculate_new_price(old_price, net_demand, news_sentiment):
    demand_factor = 1 + (net_demand / 500)    # scale as needed
    news_factor = 1 + (news_sentiment / 20)   # e.g., +0.05 if good news
    new_price = old_price * demand_factor * news_factor
    return max(new_price, 1)  # price floor

async def run_market_simulation(session_id: str):
    session = await session_model.session_collection.find_one({"session_id": session_id})
    if not session:
        return

    prices = INITIAL_PRICES.copy()
    await session_model.session_collection.update_one(
        {"session_id": session_id},
        {"$set": {"market_state": {"prices": prices, "news": []}, "player_portfolios": {}}}
    )

    total_minutes = session["duration_minutes"]
    for minute in range(total_minutes):
        company = random.choice(COMPANIES)
        news = await generate_news(company)
        sentiment = random.uniform(-0.1, 0.1)

        # Calculate net demand from actual trades
        trades_cursor = trade_model.trade_collection.find({"session_id": session_id})
        trades = await trades_cursor.to_list(length=None)
        net_demands = {comp: 0 for comp in COMPANIES}
        for t in trades:
            if t["stock_symbol"] in net_demands:
                if t["trade_type"] == "buy":
                    net_demands[t["stock_symbol"]] += t["quantity"]
                elif t["trade_type"] == "sell":
                    net_demands[t["stock_symbol"]] -= t["quantity"]

        # Update prices
        for comp in COMPANIES:
            prices[comp] = calculate_new_price(prices[comp], net_demands[comp], sentiment)

        # Clear trades collection for next round
        await trade_model.trade_collection.delete_many({"session_id": session_id})

        # Update session DB
        market_state = {"prices": prices, "news": [{"headline": news, "company": company}]}
        await session_model.session_collection.update_one(
            {"session_id": session_id},
            {"$set": {"market_state": market_state}}
        )

        # Broadcast update
        await sio.emit("market_update", {
            "session_id": session_id,
            "prices": prices,
            "news": news,
        }, room=session_id)

        # Calculate player net worth
        leaderboard = []
        portfolios = session.get("player_portfolios", {})
        for user, p in portfolios.items():
            total = p["cash"]
            for stock, qty in p["shares"].items():
                total += prices.get(stock, 0) * qty
            leaderboard.append({"username": user, "net_worth": round(total, 2)})

        leaderboard.sort(key=lambda x: x["net_worth"], reverse=True)

        await sio.emit("leaderboard_update", {"leaderboard": leaderboard}, room=session_id)

        # Wait 60 sec (or faster for testing)
        await asyncio.sleep(60)

    await session_model.session_collection.update_one(
        {"session_id": session_id},
        {"$set": {"status": "finished"}}
    )
    await sio.emit("session_finished", {"session_id": session_id}, room=session_id)


