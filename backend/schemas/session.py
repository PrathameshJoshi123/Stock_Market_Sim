from pydantic import BaseModel
from typing import List

class SessionCreate(BaseModel):
    duration_minutes: int

class SessionOut(BaseModel):
    id: str
    session_id: str
    players: List[str]
    status: str

class SessionStartRequest(BaseModel):
    session_id: str
