export enum CustomErrorCodes {
  BAD_REQUEST = 40000,
  UNAUTHORIZED = 40100,
  FORBIDDEN = 40300,
  NOT_FOUND = 40400,
  INTERNAL_SERVER_ERROR = 50000,
  THIRDPARTY_SERVER_ERROR = 50001,
  THIRDPARTY_API_RESPONSE_MISMATCH = 50002,
  SERVICE_UNAVAILABLE = 50300,
}

export interface ErrorResponse {
  code: CustomErrorCodes;
  message: string;
  requestId: string;
}
