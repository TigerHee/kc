import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import Model from './src/model';
import NoticeModal from './src/models/notice';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, Model));
  uniqueModel(dva, extendModel(m, NoticeModal));
});

export { default as NoticeCenter } from './src/index';
