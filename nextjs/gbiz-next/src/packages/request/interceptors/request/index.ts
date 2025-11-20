import { encryptRequest } from './encrypted';
import addCsrfToken from './csrf-token';
import addXVersion from './x-version';
import addLang from './lang';
import deviceFinger from './device-finger';
import handleRequestHeader from './handle-request-header';
import addCookie from './add-cookie';
import updateConfig from './update-config';

const requestInterceptors = [
  encryptRequest,
  addCsrfToken,
  addXVersion,
  addLang,
  deviceFinger,
  handleRequestHeader,
  addCookie,
  updateConfig,
];

export {
  encryptRequest,
  addCsrfToken,
  addXVersion,
  addLang,
  deviceFinger,
  handleRequestHeader,
  addCookie,
  updateConfig,
};

export default requestInterceptors;
