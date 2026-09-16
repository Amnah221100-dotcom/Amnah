from contextlib import asynccontextmanager
from typing import Any
from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from psycopg_pool import AsyncConnectionPool
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://tactica:tactica@localhost:5432/tactica"
    web_origin: str = "http://localhost:3000"

settings = Settings()
pool = AsyncConnectionPool(settings.database_url, open=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.open()
    yield
    await pool.close()

app = FastAPI(title="TACTICA API", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[settings.web_origin], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class AOICreate(BaseModel):
    case_id: UUID | None = None
    name: str = Field(min_length=1, max_length=200)
    geometry: dict[str, Any]
    properties: dict[str, Any] = {}

class CaseCreate(BaseModel):
    project_id: UUID | None = None
    mission_id: UUID | None = None
    title: str
    classification: str | None = None

class EvidenceCreate(BaseModel):
    case_id: UUID
    title: str
    evidence_type: str | None = None
    geometry: dict[str, Any] | None = None
    metadata: dict[str, Any] = {}

@app.get("/health")
async def health(): return {"status": "ok", "service": "TACTICA API"}

@app.get("/api/v1/cases")
async def list_cases():
    async with pool.connection() as conn:
        rows = await conn.execute("SELECT id,title,status,classification,created_at FROM cases ORDER BY created_at DESC LIMIT 100")
        return [dict(r) for r in await rows.fetchall()]

@app.post("/api/v1/cases", status_code=201)
async def create_case(body: CaseCreate):
    async with pool.connection() as conn:
        row = await conn.execute("INSERT INTO cases(project_id,mission_id,title,classification) VALUES(%s,%s,%s,%s) RETURNING id,title,status,classification,created_at", (body.project_id,body.mission_id,body.title,body.classification))
        return dict(await row.fetchone())

@app.get("/api/v1/aois")
async def list_aois(case_id: UUID | None = None):
    query = "SELECT id,case_id,name,ST_AsGeoJSON(geometry)::json AS geometry,properties,created_at FROM aois"
    args = ()
    if case_id: query += " WHERE case_id=%s"; args=(case_id,)
    query += " ORDER BY created_at DESC LIMIT 500"
    async with pool.connection() as conn:
        rows = await conn.execute(query,args)
        return [dict(r) for r in await rows.fetchall()]

@app.post("/api/v1/aois", status_code=201)
async def create_aoi(body: AOICreate):
    async with pool.connection() as conn:
        row = await conn.execute("INSERT INTO aois(case_id,name,geometry,properties) VALUES(%s,%s,ST_SetSRID(ST_GeomFromGeoJSON(%s),4326),%s) RETURNING id,name,ST_AsGeoJSON(geometry)::json AS geometry,properties,created_at", (body.case_id,body.name,str(body.geometry).replace("'",'"'),body.properties))
        return dict(await row.fetchone())

@app.post("/api/v1/evidence", status_code=201)
async def create_evidence(body: EvidenceCreate):
    async with pool.connection() as conn:
        geo = None if body.geometry is None else str(body.geometry).replace("'",'"')
        row = await conn.execute("INSERT INTO evidence(case_id,title,evidence_type,geometry,metadata) VALUES(%s,%s,%s,CASE WHEN %s IS NULL THEN NULL ELSE ST_SetSRID(ST_GeomFromGeoJSON(%s),4326) END,%s) RETURNING id,title,evidence_type,created_at", (body.case_id,body.title,body.evidence_type,geo,geo,body.metadata))
        return dict(await row.fetchone())

@app.get("/api/v1/alerts")
async def list_alerts(case_id: UUID | None = None):
    q="SELECT id,case_id,alert_type,severity,confidence,status,reason,created_at FROM alerts"; args=()
    if case_id: q += " WHERE case_id=%s"; args=(case_id,)
    q += " ORDER BY created_at DESC LIMIT 200"
    async with pool.connection() as conn:
        rows=await conn.execute(q,args); return [dict(r) for r in await rows.fetchall()]

@app.get("/api/v1/qc/{product_id}")
async def product_qc(product_id: UUID):
    async with pool.connection() as conn:
        rows=await conn.execute("SELECT domain,rule_key,status,message,created_at FROM qc_checks WHERE product_id=%s ORDER BY created_at",(product_id,))
        checks=[dict(r) for r in await rows.fetchall()]
        if not checks: raise HTTPException(404,"No QC checks found")
        return {"product_id":product_id,"checks":checks}
