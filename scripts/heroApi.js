import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://hahow-recruit.herokuapp.com/heroes/1';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const res = http.get(BASE_URL, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const INT_REGEX = /^-?\d+$/;
  const ALPHABET_REGEX = /^[a-zA-Z]+$/;
  const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

  const body = JSON.parse(res.body);

  check(res, {
    'Response is correct': () => {
      return (
        INT_REGEX.test(body.id) &&
        ALPHABET_REGEX.test(body.name) &&
        URL_REGEX.test(body.image)
      );
    },
  });

  sleep(1);
}
