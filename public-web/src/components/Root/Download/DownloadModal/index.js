/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kufox/mui';
import _ from 'lodash';
import { saTrackForBiz, trackClick } from 'src/utils/ga';
import storage from 'src/utils/storage';
import useModalsAndBanners from './../hooks/useModalsAndBanners';
import Btn from './Components/Btn';
import Modal from './Components/Modal';

const Wrapper = styled.div`
  position: fixed;
  bottom: 184px;
  right: 12px;
  z-index: 900;
  ${({ isInSupport }) => (isInSupport ? 'bottom:50%;transform: translateY(27px);' : '')}
`;

export default ({
  pathname,
  btnShow,
  modalShow,
  setBtnShow,
  setModalShow,
  onDownload,
  downloadAppUrl,
} = {}) => {
  const { modalUpdateDataFn } = useModalsAndBanners();

  //  弹窗展示后，从展示当天起7个自然日内不再展示
  const onCloseModal = () => {
    try {
      setBtnShow(true);
      setModalShow(false);
      // storage.setItem('download_modal_show', false);
      modalUpdateDataFn();
      // 避免关闭弹窗后立即弹出引导下载drawer
      const time = storage.getItem('downloadGuide_close_time');
      if (!time) {
        storage.setItem('downloadGuide_close_time', Date.now() - 15 * 1000);
      } else {
        storage.setItem('downloadGuide_close_time', time + 15 * 1000);
      }
      storage.removeItem('download_modal_paths');

      const pageIds = storage.getItem('download_page_pageId_list');
      const data = storage.getItem('download_countdown');
      saTrackForBiz({}, ['DGPdownloadicon', '1'], {
        contentType: pageIds[1],
        postType: data.m * 60 + data.s,
      });
    } catch (error) {}
  };

  const onOpenModal = () => {
    try {
      setModalShow(true);
      const pageIds = storage.getItem('download_page_pageId_list');
      const data = storage.getItem('download_countdown');
      trackClick(['DGPdownloadicon', '1'], {
        contentType: pageIds[1],
        postType: data.m * 60 + data.s,
      });
    } catch (error) {}
  };

  return (
    <Wrapper isInSupport={_.startsWith(pathname, '/support')}>
      {btnShow ? <Btn onOpenModal={onOpenModal} onClose={() => setBtnShow(false)} /> : null}
      <Modal
        show={modalShow}
        onClose={onCloseModal}
        onDownload={onDownload}
        downloadAppUrl={downloadAppUrl}
      />
    </Wrapper>
  );
};
