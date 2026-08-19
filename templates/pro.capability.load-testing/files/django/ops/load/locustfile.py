from locust import HttpUser, constant_throughput, task


class ApiUser(HttpUser):
    wait_time = constant_throughput(1)

    @task
    def health(self) -> None:
        with self.client.get("/api/v1/health/live", name="health", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"unexpected status {response.status_code}")
