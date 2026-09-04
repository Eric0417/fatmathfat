"""initial schema

Revision ID: 001_initial
Revises:
Create Date: 2026-09-04
"""
from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    from app.database import Base

    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    from app.database import Base

    Base.metadata.drop_all(bind=op.get_bind())
