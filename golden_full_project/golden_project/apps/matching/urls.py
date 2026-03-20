"""apps/matching/urls.py"""
from django.urls import path
from .views import RecommendationsView, DismissMatchView

urlpatterns = [
    path('recommendations/',         RecommendationsView.as_view(), name='matching-recommendations'),
    path('dismiss/<uuid:project_id>/', DismissMatchView.as_view(),   name='matching-dismiss'),
]
