// @types: ./src/tools/request/index.d.ts
import request, {
  setCsrf,
  pull,
  post,
  postJson,
  del,
  put,
  initClientXVersion,
  axiosFetch,
  Client,
  Options,
  TDataShape,
  Config,
  ClientOptions,
  createClient,
  createConfig,
} from 'tools/request';

export {
  setCsrf,
  pull,
  post,
  postJson,
  del,
  put,
  initClientXVersion,
  axiosFetch,
  createClient,
  createConfig,
  Client,
  Options,
  TDataShape,
  Config,
  ClientOptions,
};

export default request;
