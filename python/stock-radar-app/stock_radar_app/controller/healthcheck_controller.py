import logging
from http import HTTPStatus

from fastapi import APIRouter, Response

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health", tags=["Healthcheck"])
def health():
    return Response(status_code=HTTPStatus.OK)
