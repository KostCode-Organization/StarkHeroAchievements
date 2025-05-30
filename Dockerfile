FROM python:3.11-slim

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

COPY pyproject.toml ./
RUN poetry install --no-root --no-interaction --no-ansi

COPY ./app ./app

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 