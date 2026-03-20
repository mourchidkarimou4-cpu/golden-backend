"""apps/messaging/urls.py"""
from django.urls import path
from .views import ThreadListCreateView, MessageListCreateView

urlpatterns = [
    path('threads/',              ThreadListCreateView.as_view(),          name='thread-list-create'),
    path('threads/<uuid:thread_id>/', MessageListCreateView.as_view(),     name='message-list-create'),
]
