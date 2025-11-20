/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import headerModel from '@packages/header/src/Header/model';
import pwaTipModel from '@packages/header/src/PWATip/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, headerModel), window.g_initialProps || {});
  uniqueModel(dva, extendModel(m, pwaTipModel), window.g_initialProps || {});
});

export { default as Header } from './Header';
export { default as PWATip } from './PWATip';
export { RestrictNoticeWithTheme as RestrictNotice } from './Header/RestrictNotice';
