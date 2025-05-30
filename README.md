# StarkHeroAchievements Backend

A FastAPI backend for a Web3-integrated achievement and NFT platform. Features MetaMask authentication, GitHub OAuth, smart contract integration, background tasks, and a clean modular structure.

## Folder Structure

```
app/
  core/           # Config, security, and core utilities
  db/             # Database models and session
  schemas/        # Pydantic schemas
  services/       # Business logic and integrations
  api/            # Routers and endpoints
  tasks/          # Celery worker and background jobs
.env.example      # Environment variable template
Dockerfile        # Docker setup
requirements.txt  # Python dependencies
docker-compose.yml# Multi-service orchestration
```

## Features
- MetaMask wallet authentication (signature)
- GitHub OAuth integration
- User, Achievement, NFT models (SQLAlchemy)
- Smart contract interaction (web3.py)
- Background tasks (Celery + Redis)
- CORS, Pydantic validation, environment config

---

This is a base structure. Fill in logic as needed for your project. 