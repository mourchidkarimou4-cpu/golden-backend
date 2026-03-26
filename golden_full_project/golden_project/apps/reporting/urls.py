"""apps/reporting/urls.py"""
from django.urls import path
from .views import DashboardPorteurView, DashboardInvestorView, DashboardAdminView, AnalyticsView

urlpatterns = [
    path('dashboard/porteur/',   DashboardPorteurView.as_view(),  name='dashboard-porteur'),
    path('dashboard/investor/',  DashboardInvestorView.as_view(), name='dashboard-investor'),
    path('dashboard/admin/',     DashboardAdminView.as_view(),    name='dashboard-admin'),
    path('analytics/',           AnalyticsView.as_view(),         name='analytics'),
]
