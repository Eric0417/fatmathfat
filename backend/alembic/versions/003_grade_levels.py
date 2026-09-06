"""add grade levels

Revision ID: 003_grade_levels
Revises: 002_quiz_sessions
Create Date: 2026-09-06
"""
from alembic import op
import sqlalchemy as sa


revision = "003_grade_levels"
down_revision = "002_quiz_sessions"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "grade_level" not in {
        column["name"] for column in inspector.get_columns("users")
    }:
        op.add_column(
            "users",
            sa.Column("grade_level", sa.String(length=10), nullable=True),
        )
    if "ix_users_grade_level" not in {
        index["name"] for index in inspector.get_indexes("users")
    }:
        op.create_index(
            "ix_users_grade_level",
            "users",
            ["grade_level"],
            unique=False,
        )
    op.execute(
        "UPDATE users SET grade_level = 'S4' "
        "WHERE role = 'student' AND grade_level IS NULL"
    )

    if "grade_level" not in {
        column["name"] for column in inspector.get_columns("quiz_attempts")
    }:
        op.add_column(
            "quiz_attempts",
            sa.Column(
                "grade_level",
                sa.String(length=10),
                nullable=False,
                server_default="S4",
            ),
        )
    if "ix_quiz_attempts_grade_level" not in {
        index["name"] for index in inspector.get_indexes("quiz_attempts")
    }:
        op.create_index(
            "ix_quiz_attempts_grade_level",
            "quiz_attempts",
            ["grade_level"],
            unique=False,
        )

    if "grade_level" not in {
        column["name"] for column in inspector.get_columns("quiz_sessions")
    }:
        op.add_column(
            "quiz_sessions",
            sa.Column("grade_level", sa.String(length=10), nullable=True),
        )
    if "ix_quiz_sessions_grade_level" not in {
        index["name"] for index in inspector.get_indexes("quiz_sessions")
    }:
        op.create_index(
            "ix_quiz_sessions_grade_level",
            "quiz_sessions",
            ["grade_level"],
            unique=False,
        )


def downgrade() -> None:
    op.drop_index(
        "ix_quiz_sessions_grade_level",
        table_name="quiz_sessions",
    )
    op.drop_column("quiz_sessions", "grade_level")
    op.drop_index("ix_quiz_attempts_grade_level", table_name="quiz_attempts")
    op.drop_column("quiz_attempts", "grade_level")
    op.drop_index("ix_users_grade_level", table_name="users")
    op.drop_column("users", "grade_level")
