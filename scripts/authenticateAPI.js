import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://hahow-recruit.herokuapp.com/auth';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const payload = JSON.stringify({
    name: 'hahow',
    password: 'rocks',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(BASE_URL, payload, { headers: headers });

  check(res, {
    "Body message is 'OK'.": function () {
      return res.body === 'OK';
    },
  });
}
