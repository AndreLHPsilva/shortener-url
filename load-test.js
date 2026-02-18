import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    load_test: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '1m',
    },
  },
};

export default function () {
  const BASE_URL = 'http://{HOST}:3000';

  const res = http.post(`${BASE_URL}/short-urls/`, JSON.stringify({
    longUrl: "http://www.linkedin.com/in/andrelhpsilva",
    expiresIn: null
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {TOKEN}'
    }
  });

  check(res, { "status is 201": (r) => r.status === 201 });
  sleep(1);
}
