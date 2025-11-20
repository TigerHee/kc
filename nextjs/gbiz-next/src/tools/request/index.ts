/**
 * Owner: victor.ren@kupotech.com
 */
import axiosFetch from './fetch';
import request, { initClientXVersion, pull, post, postJson, del, put, setCsrf, upload } from './request';

export type { ClientOptions, Config, Options, TDataShape, Client, RequestFn } from './types';
export { axiosFetch, initClientXVersion, pull, post, postJson, del, put, setCsrf, upload };
export { createClient, createConfig } from './api-client';
export default request;
