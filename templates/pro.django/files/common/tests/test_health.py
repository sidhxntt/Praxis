import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_health_live(client):
    response = client.get(reverse("health-live"))
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
