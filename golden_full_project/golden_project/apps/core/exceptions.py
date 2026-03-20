# apps/core/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def golden_exception_handler(exc, context):
    """
    Normalise toutes les erreurs API en format cohérent :
    {
        "error": "message lisible",
        "detail": {...} | "string",
        "code": "error_code"
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        data = response.data

        # Extraire le message principal
        if isinstance(data, dict):
            if 'detail' in data:
                message = str(data['detail'])
                code    = getattr(data['detail'], 'code', 'error')
            else:
                # Erreurs de validation : premier message du premier champ
                first_field = next(iter(data))
                first_error = data[first_field]
                if isinstance(first_error, list):
                    message = f"{first_field}: {first_error[0]}"
                else:
                    message = str(first_error)
                code = 'validation_error'
        elif isinstance(data, list):
            message = str(data[0]) if data else 'Erreur inconnue.'
            code    = 'error'
        else:
            message = str(data)
            code    = 'error'

        response.data = {
            'error':  message,
            'detail': data,
            'code':   code,
            'status': response.status_code,
        }

    return response
