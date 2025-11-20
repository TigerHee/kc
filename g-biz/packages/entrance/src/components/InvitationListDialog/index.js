/**
 * Owner: sean.shi@kupotech.com
 */
import { Button, Dialog, styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import DialogWarningInfo from '../../../static/status-warning-light.svg';
import DialogWarningInfoDark from '../../../static/status-warning-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    .KuxDialog-content {
      padding: 32px;
    }
  }
`;

const DialogContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  img {
    max-width: 148px;
    height: auto;
    pointer-events: none;
  }
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.text60};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  white-space: pre-wrap;
  text-align: center;
`;

const Operate = styled.section`
  display: flex;
  gap: 12px;
  align-self: stretch;
  justify-content: space-between;
  margin-top: 24px;
  button {
    flex: 1;
  }
`;

export const InvitationListDialog = ({ onClose, visible }) => {
  const { getThemeImg } = useThemeImg();
  const { t } = useTranslation('entrance');

  const handleClose = () => {
    onClose?.();
  };

  // 联系客服
  const handleContract = () => {
    window.open(tenantConfig.signup.contactCustomer, '_blank');
  };

  return (
    <DialogWrapper
      open={visible}
      title={null}
      header={null}
      footer={null}
      onOk={null}
      onCancel={null}
      cancelText={null}
      okText={null}
      style={{ maxWidth: 400, width: '100%' }}
    >
      <DialogContentWrapper>
        <ImgWrap>
          <img
            alt="dialog fail tip"
            src={getThemeImg({ light: DialogWarningInfo, dark: DialogWarningInfoDark })}
          />
        </ImgWrap>
        <ContentWrap>{t('4e6447d650024000a90d')}</ContentWrap>
        <Operate>
          <Button variant="outlined" onClick={handleClose}>
            {t('4c068400a77e4800a9b4')}
          </Button>
          <Button onClick={handleContract}>{t('2bc4fbea87ea4800a412')}</Button>
        </Operate>
      </DialogContentWrapper>
    </DialogWrapper>
  );
};
