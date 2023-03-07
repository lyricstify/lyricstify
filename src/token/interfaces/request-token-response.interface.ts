import { RequestAccessTokenResponseInterface } from '../../refresh-token/interfaces/request-access-token-response.interface.js';

export type RequestTokenResponseInterface = Omit<
  RequestAccessTokenResponseInterface,
  'refresh_token'
>;
