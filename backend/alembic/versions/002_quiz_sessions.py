"""add quiz sessions

Revision ID: 002_quiz_sessions
Revises: 001_initial
Create Date: 2026-09-06
"""
from alembic import op
import sqlalchemy as sa


revision = "002_quiz_sessions"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "quiz_sessions" not in inspector.get_table_names():
        op.create_table(
            "quiz_sessions",
            sa.Column("id", sa.String(length=64), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=20), nullable=False),
            sa.Column(
                "started_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_quiz_sessions_id", "quiz_sessions", ["id"], unique=False)
        op.create_index(
            "ix_quiz_sessions_user_id",
            "quiz_sessions",
            ["user_id"],
            unique=False,
        )
        op.create_index(
            "ix_quiz_sessions_status",
            "quiz_sessions",
            ["status"],
            unique=False,
        )


def downgrade() -> None:
    op.drop_index("ix_quiz_sessions_status", table_name="quiz_sessions")
    op.drop_index("ix_quiz_sessions_user_id", table_name="quiz_sessions")
    op.drop_index("ix_quiz_sessions_id", table_name="quiz_sessions")
    op.drop_table("quiz_sessions")
