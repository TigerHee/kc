/**
 * Owner: willen@kupotech.com
 */
import { Button, Dialog, px2rem, styled, useResponsive } from '@kux/mui';
import ResultSuccess from 'static/oauth/resultSuccess.png';
import { _t } from 'tools/i18n';

const DialogModal = styled(Dialog)`
  min-width: 350px;
  & div.KuxModalHeader-root {
    padding-bottom: 0;
  }
`;
const WrapperModal = styled.div`
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const DialogImg = styled.img`
  width: ${px2rem(160)};
  height: ${px2rem(160)};
  margin: 0 0 ${px2rem(16)} 0;
`;
const Tip = styled.div`
  font-weight: 400;
  font-size: ${px2rem(14)};
  color: ${(props) => props.theme.colors.text60};
`;
const SubmitBtn = styled(Button)`
  margin-top: 24px;
`;
const ConfirmModal = (props) => {
  const { visible, onCancel, content, onOK, loading } = props;
  const rv = useResponsive();
  return (
    <DialogModal
      maskClosable
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={_t('modal.title.notice')}
      style={rv.md ? { width: 390 } : { margin: '0 12px' }}
    >
      <WrapperModal>
        <DialogImg src={ResultSuccess} alt="resultSuccess" />
        <Tip>{content}</Tip>
        <SubmitBtn fullWidth size="large" loading={loading} onClick={onOK}>
          {_t('ur3Pj4exTeKBPjCRcfryaB')}
        </SubmitBtn>
      </WrapperModal>
    </DialogModal>
  );
};

export default ConfirmModal;
