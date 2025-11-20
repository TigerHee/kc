/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@kufox/mui';
import checkIsInApp from 'utils/runInApp';
import storage from 'src/utils/storage';
import { noneDownloadPageList } from './config';
import DownloadModal from './DownloadModal';
import NoSSG from 'src/components/NoSSG';
import { trackClick, saTrackForBiz } from 'utils/ga';
import { evtEmitter } from 'helper';
import _ from 'lodash';
import { useSelector } from 'src/hooks/useSelector';
import useModalsAndBanners from './hooks/useModalsAndBanners';

const event = evtEmitter.getEvt();

// 500U引导下载弹按钮：
export default ({ pathname, currentLang, pageId, downloadAppUrl } = {}) => {
  const { canShowModal } = useModalsAndBanners();
  const isInApp = checkIsInApp() || false;
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { isLogin, traded } = useSelector((state) => state.user);

  const [btnShow, setBtnShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  // const [modalShow, setModalShow] = useState(true);

  const countdown = storage.getItem('download_countdown'); // 剩余倒计时

  useEffect(() => {
    if (countdown && (countdown.m || countdown.s)) {
      setBtnShow(true);
    }
  }, []);

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

  useEffect(() => {
    try {
      const paths = storage.getItem('download_modal_paths'); // 浏览过的path

      if (_.find(noneDownloadPageList, (i) => _.startsWith(pathname, i)) || !isH5) return;
      // 访问路径大于等于2
      // if (paths && paths.length >= 2 && showFlag !== false && isLogin === false) {
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
    // }, [currentLang, pathname, showFlag, isH5, isLogin]);
  }, [currentLang, pathname, canShowModal, isH5, isLogin]);

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
        downloadAppUrl={downloadAppUrl}
        pathname={pathname}
        btnShow={btnShow}
        modalShow={modalShow}
        setBtnShow={setBtnShow}
        setModalShow={setModalShow}
        onDownload={onDownload}
      />
    </NoSSG>
  );
};
