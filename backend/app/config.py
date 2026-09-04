from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "sqlite:///./mathfatfat.db"
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_EXPIRE_MINUTES: int = 1440

    ADMIN_EMAILS: str = "wongeric1417@gmail.com"
    STUDENT_EMAIL_PATTERN: str = r"^[0-9]{7}-[0-9]$"
    CORS_ORIGINS: str = "http://localhost:5173"

    EMAIL_FROM: str = ""
    GMAIL_APP_PASSWORD: str = ""
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_TIMEOUT_SECONDS: int = 10

    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-v4-flash"
    DEEPSEEK_TIMEOUT_SECONDS: int = 30
    DEEPSEEK_MAX_TOKENS: int = 2400

    AI_MAX_MESSAGE_LENGTH: int = 500
    AI_DEFAULT_QUESTION_COUNT: int = 5
    AI_MAX_QUESTION_COUNT: int = 10

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def admin_email_list(self) -> list[str]:
        return [
            email.strip().lower()
            for email in self.ADMIN_EMAILS.split(",")
            if email.strip()
        ]


settings = Settings()
