/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import storage from 'src/utils/storage';
import { saTrackForBiz, trackClick } from 'utils/ga';
import { noneDownloadPageList } from './config';
import DownloadModal from './DownloadModal';
import useModalsAndBanners from './hooks/useModalsAndBanners';

// 500U引导下载弹按钮：
export default ({ pathname, pageId, downloadAppUrl } = {}) => {
  const { canShowModal } = useModalsAndBanners();
  const isInApp = JsBridge.isApp();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const { isLogin, traded } = useSelector((state) => state.user);

  const [btnShow, setBtnShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const countdown = storage.getItem('download_countdown'); // 剩余倒计时

  useEffect(() => {
    if (countdown && (countdown.m || countdown.s)) {
      setBtnShow(true);
    }
  }, []);

  useEffect(() => {
    const pageIds = storage.getItem('download_page_pageId_list'); // pageIds for track
    if (pageIds) {
      storage.setItem('download_page_pageId_list', [pageIds[1], pageId]);
    } else {
      storage.setItem('download_page_pageId_list', [pageId]);
    }
  }, [pageId]);

  useEffect(() => {
    try {
      const paths = storage.getItem('download_modal_paths'); // 浏览过的path

      if (_.find(noneDownloadPageList, (i) => _.startsWith(pathname, i)) || !isH5) return;
      // 访问路径大于等于2
      if (paths && paths.length >= 2 && canShowModal && isLogin === false) {
        setModalShow(true);
        const pageIds = storage.getItem('download_page_pageId_list');
        saTrackForBiz({}, ['DGPdownload', '1'], {
          contentType: pageIds[0],
          postType: pageIds[1],
        });
      }
      if (paths) {
        if (paths[paths.length - 1] !== pathname) {
          storage.setItem('download_modal_paths', [...paths, pathname]);
        }
      } else {
        storage.setItem('download_modal_paths', [pathname]);
      }
    } catch (error) {
      console.log('err', error);
    }
  }, [pathname, canShowModal, isH5, isLogin]);

  if (
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
