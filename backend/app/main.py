from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import TeacherAllowlist
from app.routers import admin, ai, auth, progress


def seed_admin_emails() -> None:
    db = SessionLocal()
    try:
        for email in settings.admin_email_list:
            exists = (
                db.query(TeacherAllowlist)
                .filter(TeacherAllowlist.email == email)
                .first()
            )
            if exists is None:
                db.add(
                    TeacherAllowlist(
                        email=email,
                        created_by_email="system",
                    )
                )
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine, checkfirst=True)
    seed_admin_emails()
    yield


app = FastAPI(
    title="集合好好學 API",
    description="登入、學習數據與 AI 老師服務",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(progress.router)
app.include_router(ai.router)
app.include_router(admin.router)
