/**
 * Owner: sean.shi@kupotech.com
 */
import { Button, Dialog, styled } from '@kux/mui';
import { useCallback, useEffect, useState } from 'react';
import { kcsensorsManualExpose, saveSpm2Storage, trackClick } from 'src/utils/ga';
import { _t } from 'tools/i18n';
import { STORAGE_KEY } from 'utils/constants';
import { push } from 'utils/router';
import storage from 'utils/storage';

const ContentItem = styled.div`
  font-family: 'KuFox Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  margin-bottom: 16px;
`;

const FooterNode = styled.div`
  display: flex;
  padding: 16px 32px 32px;
  align-items: center;
`;

const CancelButton = styled(Button)`
  flex: 1;
  line-height: 140%;
  padding: 10px 24px;
  border: 1px solid ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.backgroundMajor};
`;

const OkButton = styled(Button)`
  flex: 1;
  line-height: 140%;
  padding: 10px 24px;
  border: 1px solid ${(props) => props.theme.colors.text};
  margin-left: 12px;
`;

const SetPasswordDialog = () => {
  const [visible, setVisible] = useState(true);

  // 去设置密码
  const goSetPassword = useCallback(() => {
    storage.removeItem(STORAGE_KEY.thirdPartySimpleSignup);
    trackClick(['easyRegisterSetPasswordPopup', 'setNow']);
    saveSpm2Storage('/account/security/updatepwd', ['easyRegisterSetPasswordPopup', 'setNow']);
    push('/account/security/updatepwd');
  }, []);

  const onCancel = () => {
    setVisible(false);
    trackClick(['easyRegisterSetPasswordPopup', 'setLater']);
    storage.removeItem(STORAGE_KEY.thirdPartySimpleSignup);
  };

  useEffect(() => {
    kcsensorsManualExpose(['easyRegisterSetPasswordPopup', '1']);
  }, []);

  return (
    <Dialog
      open={visible}
      title={_t('8ec8652b42e14000a0ab')}
      onCancel={onCancel}
      footer={
        <FooterNode>
          <CancelButton type="default" onClick={onCancel}>
            {_t('1d66bfe68c1d4800a33f')}
          </CancelButton>
          <OkButton onClick={goSetPassword}>{_t('0966c8602aa24800af31')}</OkButton>
        </FooterNode>
      }
    >
      <ContentItem>{_t('465cb71dc1834000a249')}</ContentItem>
      <ContentItem>{_t('66e2708a3bbe4000ad96')}</ContentItem>
    </Dialog>
  );
};

export default SetPasswordDialog;
