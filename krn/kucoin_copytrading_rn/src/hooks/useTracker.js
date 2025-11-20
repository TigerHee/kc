import {tracker} from '@krn/toolkit';

import {MainPageIds} from 'constants/tracker';
import {useRoute} from 'hooks/hybridNavigation';
import {routerList} from '../router/copy-trade';

const useTracker = () => {
  const {name} = useRoute();
  const pageId = routerList.find(i => i.name === name)?.sensorPageId;

  return {
    onClickTrack: params => tracker.onClickTrack({pageId, ...params}),
    onExpose: params => tracker.onExpose({pageId, ...params}),
    onPageExpose: params => tracker.onPageExpose({pageId, ...params}),
    onPageView: params => tracker.onPageView({pageId, ...params}),
    onCustomEvent: tracker.onCustomEvent,
    getPageId: () => pageId,
    // 因为首页，我的跟单 TAB 我的带单 TAB 都在mainPage 页面下共用同一个 pageID， 产品期望三个 tab 下的点击为 3 个不同的pageId
    // 因此提供：我的跟单点击事件 ，我的带单点击事件
    // 我的跟单下的点击事件 已固定我的跟单 pageId
    onClickTrackInMainMyCopyPage: params =>
      tracker.onClickTrack({pageId: MainPageIds.MyCopyPage, ...params}),
    //我的带单下的点击事件 已固定我的带单 pageId
    onClickTrackInMainMyLeadPage: params =>
      tracker.onClickTrack({pageId: MainPageIds.MyLeadPage, ...params}),
  };
};

export default useTracker;
// import useTracker from 'hooks/useTracker';
// const {onClickTrack} = useTracker();
// onClickTrack({
//   blockId: 'viewPost',
//   locationId: '1',
//   properties: {
//     postId: mainComment.itemId,
//     commentId: mainComment.id,
//     groupId: detailInfo?.groupId || '',
//     labelId: detailInfo?.tagId || '',
//     topicId: detailInfo?.topic?.id || '',
//   },
// });
