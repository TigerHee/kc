/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import Html from 'components/common/Html';
import { memo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Modal from '../../../components/Modal';
import { ContentWrapper } from './styledComponents';

const HowToPlayModal = () => {
  const playModal = useSelector((state) => state.votehub.playModal);
  const pageInfo = useSelector((state) => state.votehub.pageInfo, shallowEqual);
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();

  const handleClose = () => {
    dispatch({
      type: 'votehub/update',
      payload: {
        playModal: false,
      },
    });
  };

  return (
    <Modal
      title={_t('8TcsjLCx7TMfxvrTzeRkRc')}
      open={playModal}
      onClose={handleClose}
      onCancel={handleClose}
      footer={null}
      size="large"
    >
      <ContentWrapper isInApp={isInApp}>
        <Html>{pageInfo?.rule}</Html>
      </ContentWrapper>
    </Modal>
  );
};

export default memo(HowToPlayModal);
