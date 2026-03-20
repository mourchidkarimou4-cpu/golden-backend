"""GOLDEN Investissement — Settings de base"""
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY    = config('SECRET_KEY', default='dev-insecure-key-golden')
DEBUG         = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

DJANGO_APPS = [
    'django.contrib.admin','django.contrib.auth','django.contrib.contenttypes',
    'django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles',
]
THIRD_PARTY_APPS = [
    'rest_framework','rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders','django_filters','drf_spectacular',
]
LOCAL_APPS = [
    'apps.core','apps.users','apps.projects','apps.matching',
    'apps.messaging','apps.investments','apps.reporting',
]
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION  = 'config.asgi.application'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default=f'sqlite:///{BASE_DIR}/db.sqlite3'),
        conn_max_age=600,
    )
}

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE     = 'Africa/Porto-Novo'
USE_I18N = True
USE_TZ   = True

STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL   = '/media/'
MEDIA_ROOT  = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES':     ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'apps.core.pagination.GoldenPageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'EXCEPTION_HANDLER': 'apps.core.exceptions.golden_exception_handler',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=config('ACCESS_TOKEN_LIFETIME_MINUTES', default=60, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('REFRESH_TOKEN_LIFETIME_DAYS', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'TOKEN_OBTAIN_PAIR_SERIALIZER': 'apps.users.serializers.GoldenTokenObtainPairSerializer',
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000', cast=Csv())
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept','accept-encoding','authorization','content-type',
    'dnt','origin','user-agent','x-csrftoken','x-requested-with',
]

CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}

CELERY_BROKER_URL      = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND  = config('REDIS_URL', default='redis://localhost:6379/1')
CELERY_ACCEPT_CONTENT  = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE        = TIME_ZONE

SENDGRID_API_KEY   = config('SENDGRID_API_KEY', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@goldeninvest.com')
EMAIL_BACKEND      = 'django.core.mail.backends.console.EmailBackend'

USE_S3 = config('USE_S3', default=False, cast=bool)
if USE_S3:
    AWS_ACCESS_KEY_ID       = config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY   = config('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default='golden-files')
    AWS_S3_ENDPOINT_URL     = config('AWS_S3_ENDPOINT_URL', default='')
    AWS_S3_REGION_NAME      = config('AWS_S3_REGION_NAME', default='eu-west-1')
    AWS_DEFAULT_ACL         = None
    AWS_S3_FILE_OVERWRITE   = False
    DEFAULT_FILE_STORAGE    = 'storages.backends.s3boto3.S3Boto3Storage'

CINETPAY_API_KEY  = config('CINETPAY_API_KEY', default='')
CINETPAY_SITE_ID  = config('CINETPAY_SITE_ID', default='')
CINETPAY_BASE_URL = 'https://api-checkout.cinetpay.com/v2'

FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')

SPECTACULAR_SETTINGS = {
    'TITLE': 'GOLDEN Investissement API',
    'DESCRIPTION': 'API REST — plateforme de mise en relation investisseurs / porteurs.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SWAGGER_UI_SETTINGS': {'persistAuthorization': True},
}
