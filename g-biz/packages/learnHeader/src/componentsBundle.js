/**
 * Owner: ella.wang@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import learnHeaderModel from './LearnHeader/model';
import LearnHeader from './LearnHeader/index';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, learnHeaderModel), window.g_initialProps || {});
});

export default LearnHeader;
