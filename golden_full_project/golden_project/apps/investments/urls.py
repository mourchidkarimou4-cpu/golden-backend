"""apps/investments/urls.py"""
from django.urls import path
from .views import (
    InvestmentListCreateView, InvestmentDetailView,
    PortfolioSummaryView, ProjectInvestmentsView,
    rate_investment, user_ratings,
)
urlpatterns = [
    path('',                               InvestmentListCreateView.as_view(), name='investment-list-create'),
    path('<uuid:pk>/',                     InvestmentDetailView.as_view(),     name='investment-detail'),
    path('portfolio/',                     PortfolioSummaryView.as_view(),     name='investment-portfolio'),
    path('project/<uuid:project_id>/',     ProjectInvestmentsView.as_view(),   name='investment-by-project'),
    path('<uuid:pk>/rate/',                rate_investment,                    name='investment-rate'),
    path('my-ratings/',                    user_ratings,                       name='investment-ratings'),
]
