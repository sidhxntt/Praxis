from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None
    return Response(
        {"error": {"status": response.status_code, "details": response.data}},
        status=response.status_code,
        headers=response.headers,
    )
