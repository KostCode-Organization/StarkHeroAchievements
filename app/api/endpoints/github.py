from fastapi import APIRouter, Request, Body, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.core.config import settings
import httpx
import httpx, secrets
from app.services.github import get_closed_issues
from app.db.session import get_db
from app.crud.helpers import create_user, create_achievement
router = APIRouter()

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
async def github_callback(request: Request):
    """Handle GitHub OAuth callback (exchange code for token, etc)."""
    code = request.query_params.get("code")
    # Here you would exchange the code for an access token and handle user login/registration
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

    # return gh_user
    return gh_user, get_closed_issues(access_token, gh_user['login'])  # Here you would typically create or update the user in your database

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


@router.get("/")
async def github_issues(username: str, db = Depends(get_db)):
    return create_achievement(
        db,
        type_="github_issues",
        description=f"GitHub issues for {username}",
        # data={
        #     "username": username,
        #     # "issues": await get_closed_issues(username)
        # }
    )