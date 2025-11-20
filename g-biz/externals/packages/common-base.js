/**
 * Owner: tiger@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import '@packages/common-base/mailAuthorize/src/utils/httpInterceptors';
import { MailAuthorize as OriMailAuthorize } from '@packages/common-base/mailAuthorize/src/componentsBundle';
import { xgrayCheck, checkIfXgrayNeedReload } from '@packages/common-base/xgray/src';
import { sessionStorage } from '@packages/common-base/kcSession';
import moduleFederation from '@packages/common-base/moduleFederation';
import { currencyArray, currencyMap } from '@packages/common-base/metadata';

const MailAuthorize = withI18nReady(OriMailAuthorize, 'common-base');

export {
  MailAuthorize,
  xgrayCheck,
  checkIfXgrayNeedReload,
  sessionStorage,
  moduleFederation,
  currencyMap,
  currencyArray,
};
