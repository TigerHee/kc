/**
 * Owner: melon@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import DownloadBannerModel from './src/model';

export { default as DownloadBanner } from './src/index';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, DownloadBannerModel));
});
