/**
 * Owner: tiger@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import transferModel from './src/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, transferModel));
});

export { default as Transfer, TransferEvent } from './src/Transfer/index';
