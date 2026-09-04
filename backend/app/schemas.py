from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import User


class RequestCodeRequest(BaseModel):
    email: EmailStr


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    role: Literal["student", "teacher"]
    student_number: str | None = None
    last_login_at: datetime | None = None
    last_seen_at: datetime | None = None
    last_lesson: str | None = None
    created_at: datetime


class LessonProgressEntry(BaseModel):
    lesson_id: str
    completed_at: datetime


class LessonProgressRequest(BaseModel):
    lesson_id: str = Field(min_length=1, max_length=100)
    mark_complete: bool = True


class PracticeProgressRequest(BaseModel):
    source: Literal["topic", "ai_generated", "review"] = "topic"
    topic: str = Field(min_length=1, max_length=100)
    correct: int = Field(ge=0)
    total: int = Field(ge=1)
    duration_ms: int = Field(ge=0, default=0)


class PracticeProgressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    source: str
    topic: str
    correct: float
    total: float
    duration_ms: int
    completed_at: datetime


class QuizMistake(BaseModel):
    question_id: str
    selected: str
    answer: str
    tags: list[str] = []


class QuizAttemptCreate(BaseModel):
    id: str | None = None
    score: int = Field(ge=0, le=100)
    correct: int = Field(ge=0)
    total: int = Field(ge=1)
    duration_ms: int = Field(ge=0)
    topic_scores: dict[str, dict[str, int]]
    mistakes: list[QuizMistake] = []
    completed_at: datetime | None = None


class QuizAttemptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed_at: datetime
    score: float
    correct: int
    total: int
    duration_ms: int
    topic_scores: dict[str, dict[str, int]]
    mistakes: list[dict[str, Any]]


class ProgressResponse(BaseModel):
    user: UserResponse
    completed_lessons: list[LessonProgressEntry]
    last_lesson: str | None
    practice_progress: list[PracticeProgressResponse]
    quiz_attempts: list[QuizAttemptResponse]


class TeacherAddRequest(BaseModel):
    email: EmailStr


class AdminStudentResponse(BaseModel):
    id: int
    email: str
    role: str
    last_login_at: datetime | None
    last_seen_at: datetime | None
    completed_lessons: list[str]
    practice_count: int
    quiz_count: int
    latest_quiz: dict[str, Any] | None


class AdminLearningDataResponse(BaseModel):
    students: list[AdminStudentResponse]
    total_students: int


class AiQuestionContext(BaseModel):
    route: str = ""
    lesson_id: str | None = None
    topic: str | None = None
    question_id: str | None = None
    prompt: str | None = None
    kind: str | None = None
    difficulty: str | None = None
    choices: list[str] = []
    selected: str | None = None
    answered: bool = False
    allow_answer: bool = False


class AiChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    context: AiQuestionContext = AiQuestionContext()
    quiz_active: bool = False


class AiChatResponse(BaseModel):
    message: str


class AiGenerateRequest(BaseModel):
    topics: list[str] = []
    difficulty: str = "standard"
    count: int = Field(ge=1, le=10)


class AiGenerateResponse(BaseModel):
    questions: list[dict[str, Any]]


class MessageResponse(BaseModel):
    message: str
