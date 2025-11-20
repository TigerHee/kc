import checkXGray from './check-x-gray'
import appSessionRenewal from './app-session-renewal'
import checkBizCode from './check-biz-code'
// import checkHttpCode from './check-http-code'
import { decryptResponse } from '../request/encrypted'

const responseInterceptors = [
  checkXGray,
  appSessionRenewal,
  checkBizCode,
  decryptResponse,
]

export { checkXGray, appSessionRenewal, checkBizCode, decryptResponse }

export default responseInterceptors
