import { AxiosError } from 'axios';

export const mockAxiosError = {
  message: 'Internal Server Error',
  name: 'Error',
  config: {},
  code: '500',
  request: {},
  response: { status: 500, statusText: 'Internal Server Error' },
} as AxiosError;
