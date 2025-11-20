/**
 * Owner: tiger@kupotech.com
 */
import uniqueModel from '@tools/uniqueModel';
import remoteEvent from '@tools/remoteEvent';
import { extendModel } from '@utils';
import mailAuthorizeModel from './components/MailAuthorize/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, mailAuthorizeModel));
});

export { default as MailAuthorize } from './components/MailAuthorize';
