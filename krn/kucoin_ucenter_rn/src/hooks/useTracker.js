/**
 * Owner: willen@kupotech.com
 */
import {routerMap} from '../router';
import {useRoute} from '@react-navigation/native';
import {tracker} from '@krn/toolkit';

// kyc_biz kyc_from

let source = {
  kyc_biz: '', // 业务来源
  source: '',
  terminal_soure: '', // 终端来源
  kyc_from: '',
};

export const setSource = params => {
  const {kyc_biz = '', kyc_from = ''} = params;

  source = {
    kyc_biz,
    source: kyc_biz,
    terminal_soure: kyc_from,
    kyc_from,
  };
};

export const getSource = () => source;

const useTracker = () => {
  const {name} = useRoute();
  const pageId = routerMap.find(i => i.name === name)?.sensorPageId;
  return {
    onClickTrack: params => tracker.onClickTrack({pageId, ...params}),
    onExpose: params => tracker.onExpose({pageId, ...params}),
    onPageExpose: params => tracker.onPageExpose({pageId, ...params}),
    onPageView: params => tracker.onPageView({pageId, ...params}),
    onCustomEvent: tracker.onCustomEvent,
    getPageId: () => pageId,
  };
};

export default useTracker;
