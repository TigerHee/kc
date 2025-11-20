/**
 * Owner: willen@kupotech.com
 */

import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import Model from './src/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, Model));
});

export { default as DialogCenter } from './src/index';
