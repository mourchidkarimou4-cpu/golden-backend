"""apps/core/urls.py"""
from django.urls import path
from .views import notifications_list, mark_read, mark_all_read

urlpatterns = [
    path('notifications/',           notifications_list, name='notifications-list'),
    path('notifications/<uuid:pk>/read/', mark_read,    name='notification-read'),
    path('notifications/read-all/',  mark_all_read,     name='notifications-read-all'),
]
