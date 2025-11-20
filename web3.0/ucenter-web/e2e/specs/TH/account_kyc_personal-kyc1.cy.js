/**
 * url已停用，重定向到kyc首页，可忽略
 */
import { checkPageRedirectToKyc } from '../common/account_kyc';

const url = '/account/kyc/personal-kyc1';

checkPageRedirectToKyc(url);
