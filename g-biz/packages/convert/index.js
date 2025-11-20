/**
 * Owner: borden@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import ConvertaModel from './src/models';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, ConvertaModel), window.g_initialProps || {});
});

export { default as Convert } from './src/Convert';
export { default as ConvertDialog } from './src/ConvertDialog';
