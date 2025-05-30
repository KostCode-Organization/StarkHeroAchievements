from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.redis_url,
    backend=settings.redis_url
)

celery_app.conf.task_routes = {  # Example: route tasks by name
    # 'app.tasks.example_task': {'queue': 'example'}
} 