"""apps/investments/urls.py"""
from django.urls import path
from .views import (
    InvestmentListCreateView, InvestmentDetailView,
    PortfolioSummaryView, ProjectInvestmentsView,
    rate_investment, user_ratings, investment_history,
    negotiation_offers, make_offer, generate_contract,
    initiate_payment, payment_notify, check_payment,
    initiate_payment, payment_notify, check_payment,
)
urlpatterns = [
    path('',                               InvestmentListCreateView.as_view(), name='investment-list-create'),
    path('<uuid:pk>/',                     InvestmentDetailView.as_view(),     name='investment-detail'),
    path('portfolio/',                     PortfolioSummaryView.as_view(),     name='investment-portfolio'),
    path('project/<uuid:project_id>/',     ProjectInvestmentsView.as_view(),   name='investment-by-project'),
    path('<uuid:pk>/rate/',                rate_investment,                    name='investment-rate'),
    path('my-ratings/',                    user_ratings,                       name='investment-ratings'),
    path('<uuid:pk>/history/',             investment_history,                 name='investment-history'),
    path('<uuid:pk>/offers/',              negotiation_offers,                 name='investment-offers'),
    path('<uuid:pk>/offer/',               make_offer,                         name='investment-make-offer'),
    path('<uuid:pk>/contract/',            generate_contract,                  name='investment-contract'),
    path('<uuid:pk>/payment/init/',        initiate_payment,                   name='investment-payment-init'),
    path('<uuid:pk>/payment/notify/',      payment_notify,                     name='investment-payment-notify'),
    path('<uuid:pk>/payment/check/',       check_payment,                      name='investment-payment-check'),
    path('<uuid:pk>/payment/init/',        initiate_payment,                   name='investment-payment-init'),
    path('<uuid:pk>/payment/notify/',      payment_notify,                     name='investment-payment-notify'),
    path('<uuid:pk>/payment/check/',       check_payment,                      name='investment-payment-check'),
]
