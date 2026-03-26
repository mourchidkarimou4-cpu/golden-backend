"""apps/investments/cinetpay.py — Intégration CinetPay."""
import uuid
import requests
from django.conf import settings


CINETPAY_BASE = getattr(settings, 'CINETPAY_BASE_URL', 'https://api-checkout.cinetpay.com/v2')
API_KEY  = getattr(settings, 'CINETPAY_API_KEY', '')
SITE_ID  = getattr(settings, 'CINETPAY_SITE_ID', '')


def init_payment(investment, return_url: str, notify_url: str) -> dict:
    """
    Initialise un paiement CinetPay pour un investissement.
    Retourne {'payment_url': ..., 'transaction_id': ...} ou {'error': ...}
    """
    transaction_id = f"GOLDEN-{str(investment.id)[:8].upper()}-{uuid.uuid4().hex[:6].upper()}"
    amount = int(float(investment.amount))

    payload = {
        "apikey":         API_KEY,
        "site_id":        SITE_ID,
        "transaction_id": transaction_id,
        "amount":         amount,
        "currency":       "XOF",
        "description":    f"Investissement — {investment.project.title[:50]}",
        "return_url":     return_url,
        "notify_url":     notify_url,
        "customer_name":  investment.investor.get_full_name() or investment.investor.email,
        "customer_email": investment.investor.email,
        "channels":       "ALL",
        "metadata":       str(investment.id),
    }

    try:
        r = requests.post(f"{CINETPAY_BASE}/payment", json=payload, timeout=15)
        data = r.json()
        if data.get('code') == '201':
            return {
                'payment_url':    data['data']['payment_url'],
                'transaction_id': transaction_id,
            }
        return {'error': data.get('message', 'Erreur CinetPay')}
    except Exception as e:
        return {'error': str(e)}


def verify_payment(transaction_id: str) -> dict:
    """Vérifie le statut d'un paiement."""
    payload = {
        "apikey":         API_KEY,
        "site_id":        SITE_ID,
        "transaction_id": transaction_id,
    }
    try:
        r = requests.post(f"{CINETPAY_BASE}/payment/check", json=payload, timeout=15)
        data = r.json()
        return data
    except Exception as e:
        return {'error': str(e)}
