"""Unified CRUD helpers for every SQLAlchemy model in the project.

Models covered
==============
• **User**               – owns many **NFT**, many **Issue**, many‑to‑many **Achievement**
• **Achievement**        – many‑to‑many **User**
• **NFT**                – belongs‑to **User**
• **Issue**              – belongs‑to **User**

All helpers are synchronous and run against a standard *Session* coming from
`app.db.session.get_db()` which yields a **sync** SQLAlchemy `Session`.
Every `create_*`, `update_*`, or mutating helper commits immediately and returns
fresh ORM objects (`Session.commit()` + `Session.refresh()`).

If you switch the application to `AsyncSession`, regenerate this file with
`async def` and `await db.commit()` accordingly.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

# NOTE: adjust the import to your actual models location
from app.db import (
    User,
    Achievement,
    NFT,
    Issue,
    user_achievements,  # association table for the M‑to‑M
)

# ─────────────────────────────────────────────────────────────────────────────
# Helper ▸ commit + refresh ----------------------------------------------------
# ─────────────────────────────────────────────────────────────────────────────

def _persist(db: Session, obj):
    """Add *obj* to the session, commit, refresh and return it."""
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# ============================================================================
# USER CRUD -------------------------------------------------------------------
# ============================================================================

def create_user(
    db: Session,
    *,
    wallet_address: str,
    github_id: Optional[str] = None,
    github_username: Optional[str] = None,
) -> User:
    """Insert a new *User*. Returns the persisted instance."""
    return _persist(
        db,
        User(
            wallet_address=wallet_address,
            github_id=github_id,
            github_username=github_username,
        ),
    )


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.get(User, user_id)


def get_user_by_wallet(db: Session, wallet_address: str) -> Optional[User]:
    return (
        db.query(User)
        .filter(User.wallet_address == wallet_address)
        .first()
    )


def list_users(db: Session, *, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(
    db: Session,
    *,
    user_id: int,
    wallet_address: Optional[str] = None,
    github_id: Optional[str] = None,
    github_username: Optional[str] = None,
) -> Optional[User]:
    user = db.get(User, user_id)
    if not user:
        return None
    if wallet_address is not None:
        user.wallet_address = wallet_address
    if github_id is not None:
        user.github_id = github_id
    if github_username is not None:
        user.github_username = github_username
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> bool:
    user = db.get(User, user_id)
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True

# ============================================================================
# ACHIEVEMENT CRUD ------------------------------------------------------------
# ============================================================================

def create_achievement(
    db: Session,
    *,
    type_: str,
    description: Optional[str] = None,
) -> Achievement:
    """`type_` is used instead of *type* to avoid shadowing the built‑in."""
    return _persist(db, Achievement(type=type_, description=description))


def get_achievement(db: Session, achievement_id: int) -> Optional[Achievement]:
    return db.get(Achievement, achievement_id)


def list_achievements(db: Session, *, skip: int = 0, limit: int = 100) -> List[Achievement]:
    return db.query(Achievement).offset(skip).limit(limit).all()


def update_achievement(
    db: Session,
    *,
    achievement_id: int,
    type_: Optional[str] = None,
    description: Optional[str] = None,
) -> Optional[Achievement]:
    ach = db.get(Achievement, achievement_id)
    if not ach:
        return None
    if type_ is not None:
        ach.type = type_
    if description is not None:
        ach.description = description
    db.commit()
    db.refresh(ach)
    return ach


def delete_achievement(db: Session, achievement_id: int) -> bool:
    ach = db.get(Achievement, achievement_id)
    if not ach:
        return False
    db.delete(ach)
    db.commit()
    return True

# -- many‑to‑many helpers ------------------------------------------------------

def grant_achievement_to_user(db: Session, user_id: int, achievement_id: int) -> bool:
    """Attach *achievement* to *user*. Returns False if missing or already exists."""
    user = db.get(User, user_id)
    ach = db.get(Achievement, achievement_id)
    if not user or not ach:
        return False
    if ach in user.achievements:
        return False
    user.achievements.append(ach)
    db.commit()
    return True


def revoke_achievement_from_user(db: Session, user_id: int, achievement_id: int) -> bool:
    user = db.get(User, user_id)
    ach = db.get(Achievement, achievement_id)
    if not user or not ach or ach not in user.achievements:
        return False
    user.achievements.remove(ach)
    db.commit()
    return True

# ============================================================================
# NFT CRUD --------------------------------------------------------------------
# ============================================================================

def create_nft(
    db: Session,
    *,
    user_id: int,
    token_id: str,
    metadata_uri: str,
) -> Optional[NFT]:
    if not db.get(User, user_id):
        return None
    return _persist(db, NFT(user_id=user_id, token_id=token_id, metadata_uri=metadata_uri))


def get_nft(db: Session, nft_id: int) -> Optional[NFT]:
    return db.get(NFT, nft_id)


def list_nfts_by_user(db: Session, user_id: int, *, skip: int = 0, limit: int = 100) -> List[NFT]:
    return (
        db.query(NFT)
        .filter(NFT.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_nft(
    db: Session,
    *,
    nft_id: int,
    metadata_uri: Optional[str] = None,
) -> Optional[NFT]:
    nft = db.get(NFT, nft_id)
    if not nft:
        return None
    if metadata_uri is not None:
        nft.metadata_uri = metadata_uri
    db.commit()
    db.refresh(nft)
    return nft


def delete_nft(db: Session, nft_id: int) -> bool:
    nft = db.get(NFT, nft_id)
    if not nft:
        return False
    db.delete(nft)
    db.commit()
    return True

# ============================================================================
# ISSUE CRUD ------------------------------------------------------------------
# ============================================================================

def create_issue(db: Session, *, user_id: int, name: str) -> Optional[Issue]:
    if not db.get(User, user_id):
        return None
    return _persist(db, Issue(user_id=user_id, name=name))


def get_issue(db: Session, issue_id: int) -> Optional[Issue]:
    return db.get(Issue, issue_id)


def list_issues_by_user(db: Session, user_id: int, *, skip: int = 0, limit: int = 100) -> List[Issue]:
    return (
        db.query(Issue)
        .filter(Issue.user_id == user_id)
        .order_by(Issue.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_issue(db: Session, *, issue_id: int, new_name: Optional[str] = None) -> Optional[Issue]:
    issue = db.get(Issue, issue_id)
    if not issue:
        return None
    if new_name is not None:
        issue.name = new_name
    db.commit()
    db.refresh(issue)
    return issue


def delete_issue(db: Session, issue_id: int) -> bool:
    issue = db.get(Issue, issue_id)
    if not issue:
        return False
    db.delete(issue)
    db.commit()
    return True
