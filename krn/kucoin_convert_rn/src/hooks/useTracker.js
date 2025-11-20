/**
 * Owner: willen@kupotech.com
 */
import {routerMap} from '../router';
import {useRoute} from '@react-navigation/native';
import {tracker} from '@krn/toolkit';

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
