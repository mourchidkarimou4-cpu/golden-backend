"""
apps/core/storage.py
Configuration du stockage Supabase Storage (compatible S3)
pour Django. Remplace AWS S3 dans la config.
"""
from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class SupabasePrivateStorage(S3Boto3Storage):
    """
    Stockage privé — documents KYC, contrats, fichiers sensibles.
    Les fichiers ne sont accessibles que via URL signée temporaire.
    """
    bucket_name    = settings.AWS_STORAGE_BUCKET_NAME
    default_acl    = 'private'
    file_overwrite = False
    custom_domain  = False

    def url(self, name, parameters=None, expire=3600):
        """Génère une URL signée valable 1 heure par défaut."""
        return super().url(name, parameters={'ExpiresIn': expire})


class SupabasePublicStorage(S3Boto3Storage):
    """
    Stockage public — images de couverture des projets, avatars.
    Les fichiers sont accessibles directement via URL publique.
    """
    bucket_name    = settings.AWS_STORAGE_BUCKET_NAME
    default_acl    = 'public-read'
    file_overwrite = False
    custom_domain  = False
    querystring_auth = False
