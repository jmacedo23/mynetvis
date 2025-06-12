FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Run as a module so relative imports in the package work
CMD ["python", "-u", "-m", "app.main"]
