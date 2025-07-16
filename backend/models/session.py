from database import db

session_collection = db["sessions"]

# No code change in file, but in DB structure, we'll keep a `player_portfolios` dict:
# {
#   "username1": { "cash": 100000, "shares": { "Tesla": 0, "Apple": 0, ... }},
#   ...
# }
