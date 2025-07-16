import socketio

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
sio_app = socketio.ASGIApp(sio)

sessions_market_state = {}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def join_session(sid, data):
    session_id = data.get("session_id")
    username = data.get("username")
    sio.enter_room(sid, session_id)
    await sio.emit("user_joined", {"username": username}, room=session_id)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


