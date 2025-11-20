/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import { extendModel } from '@utils';
import uniqueModel from '@tools/uniqueModel';
import footerModel from './model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, footerModel));
});

export { default as Footer } from './Footer';
