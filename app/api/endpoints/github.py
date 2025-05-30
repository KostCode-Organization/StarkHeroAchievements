from fastapi import APIRouter, Request, Body
from fastapi.responses import RedirectResponse
from app.core.config import settings
import httpx

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
def github_callback(request: Request):
    """Handle GitHub OAuth callback (exchange code for token, etc)."""
    code = request.query_params.get("code")
    # Here you would exchange the code for an access token and handle user login/registration
    return {"code": code, "message": "Received code. Implement token exchange and user logic here."}

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
