/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import storage from 'src/utils/storage';
import { trackClick } from 'utils/ga';
import { noneDownloadModalList, noneDownloadPageList } from './config';
import DownloadModal from './DownloadModal';

// 500U引导下载弹按钮：
export default ({ pathname, currentLang, pageId, downloadAppUrl } = {}) => {
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const isH5 = !sm;

  const { isLogin } = useSelector((state) => state.user);

  const [btnShow, setBtnShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const countdown = storage.getItem('download_countdown'); // 剩余倒计时
  // const showFlag = storage.getItem('download_modal_show'); //  是否show modal

  useEffect(() => {
    if (!isH5) {
      return;
    }
    const needSkip = _.find(noneDownloadPageList, (i) => _.startsWith(pathname, i));
    if (needSkip) {
      return;
    }
    const hasCountdown = countdown && (countdown.m || countdown.s);
    if (hasCountdown || isLogin === false) {
      setBtnShow(true);
    }
  }, [isLogin, pathname, isH5]);

  // 优化web移动端下载app弹窗-前端隐藏该弹窗及其展示逻辑（代码不要删） https://wiki.kupotech.com/pages/viewpage.action?pageId=104205501
  // useEffect(() => {
  //   // 通知downloadGuide是否显示
  //   if (modalShow && traded === false) {
  //     event.emit('DOWNLOADGUIDE_SHOW', {
  //       showGuide: true,
  //     });
  //   } else {
  //     event.emit('DOWNLOADGUIDE_SHOW', {
  //       showGuide: !modalShow,
  //     });
  //   }
  // }, [modalShow, traded]);

  useEffect(() => {
    const pageIds = storage.getItem('download_page_pageId_list'); // pageIds for track
    if (pageIds) {
      storage.setItem('download_page_pageId_list', [pageIds[1], pageId]);
    } else {
      storage.setItem('download_page_pageId_list', [pageId]);
    }
  }, [pageId]);

  if (
    _.find(noneDownloadModalList, (i) => _.startsWith(pathname, i)) ||
    isLogin ||
    isInApp ||
    !isH5 ||
    (countdown && countdown.m === 0 && countdown.s === 0) // 倒计时结束
  )
    return null;

  const onDownload = () => {
    try {
      storage.removeItem('download_modal_paths');
      const pageIds = storage.getItem('download_page_pageId_list');
      trackClick(['DGPdownload', '1'], {
        contentType: pageIds[0],
        postType: pageIds[1],
      });
    } catch (error) {}
  };

  return (
    <NoSSG>
      <DownloadModal
        pathname={pathname}
        btnShow={btnShow}
        modalShow={modalShow}
        setBtnShow={setBtnShow}
        setModalShow={setModalShow}
        onDownload={onDownload}
        downloadAppUrl={downloadAppUrl}
      />
    </NoSSG>
  );
};
