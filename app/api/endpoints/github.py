from fastapi import APIRouter, Request, Body, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi import APIRouter, Request, Body, HTTPException, BackgroundTasks
from fastapi.responses import RedirectResponse, HTMLResponse
from app.core.config import settings
import httpx
import secrets
from app.services.github import get_closed_issues
from app.db.session import get_db
from app.crud.helpers import create_user, create_achievement
import json
from urllib.parse import urlparse
import base64
import time

router = APIRouter()

# In-memory cache for demo (use Redis for production)
GITHUB_DATA_CACHE = {}

GITHUB_OAUTH_URL = (
    f"https://github.com/login/oauth/authorize?client_id={settings.github_client_id}"
    f"&redirect_uri={settings.github_callback_url}"
    f"&scope=repo%20read:user"
)

@router.get("/github/login")
def github_login():
    """Redirect user to GitHub OAuth login page."""
    return RedirectResponse(GITHUB_OAUTH_URL)

@router.get("/github/callback")
async def github_callback(request: Request, background_tasks: BackgroundTasks):
    """Handle GitHub OAuth callback (exchange code for token, etc)."""
    code = request.query_params.get("code")
    redirect_uri = request.query_params.get("redirect_uri") or "http://localhost:3000/"
    parsed = urlparse(redirect_uri)
    frontend_origin = f"{parsed.scheme}://{parsed.netloc}"
    async with httpx.AsyncClient() as client:
        # 1️⃣ exchange the one-time code for an access token
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id":     settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code":          code,
                "redirect_uri":  settings.github_callback_url,
            },
            timeout=10,
        )
        if token_resp.status_code != 200:
            raise HTTPException(500, f"GitHub token exchange failed: {token_resp.text}")
        token_json = token_resp.json()
        access_token = token_json.get("access_token")
        if not access_token:
            raise HTTPException(400, f"GitHub did not return an access_token: {token_json}")

        # return token_json  # Here you would typically store the token securely
        # 2️⃣ use the token once to grab the user’s GitHub identity
        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}",
                     "Accept": "application/vnd.github+json"},
            timeout=10,
        )
        if user_resp.status_code != 200:
            raise HTTPException(500, f"GitHub /user failed: {user_resp.text}")
        gh_user = user_resp.json()
        # Fetch assigned issues for the user
        assigned_issues_resp = await client.get(
            f"https://api.github.com/issues",
            headers={"Authorization": f"Bearer {access_token}",
                     "Accept": "application/vnd.github+json"},
            timeout=10,
        )
        assigned_issues = []
        if assigned_issues_resp.status_code == 200:
            assigned_issues = assigned_issues_resp.json()
        gh_user["assigned_issues"] = assigned_issues
        activity_data = get_closed_issues(access_token, gh_user['login'])
    # Encode user, activity, and contribution_days as base64 JSON and redirect to frontend
        key = secrets.token_urlsafe(16)
        GITHUB_DATA_CACHE[key] = {
            "data": {
                "user": gh_user,
                "used_ai": activity_data["used_ai"],
                "activity": activity_data["activity"],  # Changed from "closed" to "activity"
                "contribution_days": activity_data["contribution_days"]
            },
            "timestamp": time.time()
        }
        print(f"DEBUG: Stored data with key: {key}")
        print(f"DEBUG: Cache now contains keys: {list(GITHUB_DATA_CACHE.keys())}")
        # No immediate cleanup - let the data persist for the frontend to fetch
        redirect_url = f"{frontend_origin}/?github_key={key}"
        return RedirectResponse(redirect_url)

@router.post("/github/token")
async def github_token(code: str = Body(..., embed=True)):
    """Exchange code for GitHub access token."""
    async with httpx.AsyncClient() as client:
        headers = {"Accept": "application/json"}
        data = {
            "client_id": settings.github_client_id,
            "client_secret": settings.github_client_secret,
            "code": code,
            "redirect_uri": settings.github_callback_url,
        }
        response = await client.post("https://github.com/login/oauth/access_token", data=data, headers=headers)
        response.raise_for_status()
        token_data = response.json()
    return token_data

@router.get("/github/data")
async def github_data(key: str):
    print(f"DEBUG: Requesting key: {key}")
    print(f"DEBUG: Available keys in cache: {list(GITHUB_DATA_CACHE.keys())}")

    # Clean up expired entries (older than 10 minutes)
    current_time = time.time()
    expired_keys = [k for k, v in GITHUB_DATA_CACHE.items() if current_time - v.get("timestamp", 0) > 600]
    for expired_key in expired_keys:
        GITHUB_DATA_CACHE.pop(expired_key, None)
        print(f"DEBUG: Cleaned up expired key: {expired_key}")

    cache_entry = GITHUB_DATA_CACHE.get(key, None)
    if not cache_entry:
        print(f"DEBUG: Key {key} not found in cache")
        raise HTTPException(404, "Data not found or expired")

    # Check if the entry is expired (older than 10 minutes)
    if current_time - cache_entry.get("timestamp", 0) > 600:
        GITHUB_DATA_CACHE.pop(key, None)
        print(f"DEBUG: Key {key} expired")
        raise HTTPException(404, "Data not found or expired")

    # Remove from cache after successful retrieval
    GITHUB_DATA_CACHE.pop(key, None)
    return cache_entry["data"]
