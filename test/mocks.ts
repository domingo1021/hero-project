import { AxiosError } from 'axios';
import * as nock from 'nock';

export const mockAxiosError = {
  message: 'Internal Server Error',
  name: 'Error',
  config: {},
  code: '500',
  request: {},
  response: { status: 500, statusText: 'Internal Server Error' },
} as AxiosError;

export const mockGetListHeroesApi = () => {
  const baseUrl = 'https://hahow-recruit.herokuapp.com';
  const endpoint = '/heroes';

  nock(baseUrl)
    .get(endpoint)
    .reply(200, [
      {
        id: '1',
        name: 'Hero',
        image: 'https://hahow-recruit.herokuapp.com/image1.jpg',
      },
      {
        id: '2',
        name: 'Iron Man',
        image: 'https://hahow-recruit.herokuapp.com/image2.jpg',
      },
    ]);
};

export const mockGetSingleHeroApi = () => {
  const baseUrl = 'https://hahow-recruit.herokuapp.com';
  const endpoint = /\/heroes\/.*/; // /heroes/:id

  nock(baseUrl)
    .get(endpoint)
    .reply(200, (uri) => {
      const id = uri.split('/')[2];
      return {
        id,
        name: 'Iron Man',
        image: `https://hahow-recruit.herokuapp.com/image.jpg`,
      };
    });
};

export const mockGetSingleHeroProfileApi = () => {
  const baseUrl = 'https://hahow-recruit.herokuapp.com';
  const endpoint = /\/heroes\/.*\/profile/; // /heroes/:id/profile

  // need to keep nock interceptor persist to mock multiple requests (for Promise.all)
  nock(baseUrl).persist().get(endpoint).reply(200, {
    str: 1,
    int: 1,
    agi: 1,
    luk: 1,
  });
};

export const mockAuthApi = () => {
  const baseUrl = 'https://hahow-recruit.herokuapp.com';
  const endpoint = '/auth';

  nock(baseUrl).post(endpoint, { name: 'hahow', password: 'rocks' }).reply(200);
};
