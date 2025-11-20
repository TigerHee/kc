/**
 * Owner: tiger@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import CaptchaModel from './src/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, CaptchaModel));
});

export { default as Captcha } from './src/index';
