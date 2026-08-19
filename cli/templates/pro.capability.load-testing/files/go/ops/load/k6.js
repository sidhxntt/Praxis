import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    steady: {
      executor: "constant-arrival-rate",
      rate: Number(__ENV.REQUEST_RATE || 10),
      timeUnit: "1s",
      duration: __ENV.DURATION || "1m",
      preAllocatedVUs: 10,
      maxVUs: 100,
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const response = http.get(`${__ENV.TARGET_URL || "http://api:8080"}/api/v1/health/live`);
  check(response, { "health returns 200": (result) => result.status === 200 });
  sleep(0.1);
}
