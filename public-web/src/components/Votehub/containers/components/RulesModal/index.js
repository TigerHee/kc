/**
 * Owner: jessie@kupotech.com
 */
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Modal from '../../../components/Modal';
import { ContentWrapper } from './styledComponents';

const RulesModal = () => {
  const ruleModal = useSelector((state) => state.votehub.ruleModal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({
      type: 'votehub/update',
      payload: {
        ruleModal: false,
      },
    });
  };

  return (
    <Modal
      title={_t('b9hmARke7vQqULYooJpW2r')}
      open={ruleModal}
      onClose={handleClose}
      onCancel={handleClose}
      footer={null}
      size="large"
    >
      <ContentWrapper>
        <p className="title">{_t('r9URrz3XN4rw7zS3nx8B3z')}</p>
        <p>{_t('uhJURBJv7WVrC2S5XzXh4d')}</p>
        <p>{_t('2nXxigMJPBpWG5ZLSfyxh4')}</p>
        <p>{_t('uyYAmybxwLbDFNrRjayngx')}</p>
      </ContentWrapper>
    </Modal>
  );
};

export default memo(RulesModal);
