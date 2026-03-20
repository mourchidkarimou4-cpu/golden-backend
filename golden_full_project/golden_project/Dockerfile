FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements/prod.txt requirements/prod.txt
COPY requirements/base.txt requirements/base.txt
RUN pip install -r requirements/prod.txt

# Code source
COPY . .

# Collecte des fichiers statiques
RUN python manage.py collectstatic --noinput --settings=config.settings.prod

# Port
EXPOSE 8000

# Démarrage Gunicorn
CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
