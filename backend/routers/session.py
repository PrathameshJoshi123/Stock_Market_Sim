from fastapi import APIRouter, Depends, HTTPException
from schemas import session as session_schema
from models import session as session_model
import uuid

router = APIRouter()

@router.post("/create", response_model=session_schema.SessionOut)
async def create_session(req: session_schema.SessionCreate):
    session_id = str(uuid.uuid4())[:8]
    session_doc = {
        "session_id": session_id,
        "players": [],
        "duration_minutes": req.duration_minutes,
        "status": "waiting",
        "market_state": {},
    }
    result = await session_model.session_collection.insert_one(session_doc)
    return session_schema.SessionOut(id=str(result.inserted_id), session_id=session_id, players=[], status="waiting")

from sockets import sio  # <-- import your Socket.IO instance

@router.post("/{session_id}/join")
async def join_session(session_id: str, username: str):
    session = await session_model.session_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    await session_model.session_collection.update_one(
        {"session_id": session_id},
        {"$addToSet": {"players": username}}
    )

    # Emit event to all clients in the room
    await sio.emit("user_joined", {"username": username, "session_id": session_id}, room=session_id)

    return {"message": f"{username} joined session {session_id}"}


from fastapi import BackgroundTasks
from services.simulation import run_market_simulation

@router.post("/{session_id}/start")
async def start_session(session_id: str, background_tasks: BackgroundTasks):
    session = await session_model.session_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session["status"] != "waiting":
        raise HTTPException(status_code=400, detail="Session already started or finished")
    
    # Update status
    await session_model.session_collection.update_one(
        {"session_id": session_id},
        {"$set": {"status": "running"}}
    )
    # Start simulation as background task
    background_tasks.add_task(run_market_simulation, session_id)
    return {"message": f"Session {session_id} started"}
