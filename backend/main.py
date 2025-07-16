from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, session, trade
from sockets import sio_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(session.router, prefix="/session", tags=["Session"])
app.include_router(trade.router, prefix="/trade", tags=["Trade"])

# Mount socket.io app
app.mount("/ws", sio_app)
