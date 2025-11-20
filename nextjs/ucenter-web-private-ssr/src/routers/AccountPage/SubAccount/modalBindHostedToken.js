/**
 * Owner: sean.shi@kupotech.com
 * 第三方资金托管子账号获取 token
 */
import styled from '@emotion/styled';
import { ICCopyOutlined } from '@kux/icons';
import { Button, Dialog, useSnackbar } from '@kux/mui';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getOESStatus } from 'services/account';
import { _t } from 'tools/i18n';

const DialogWrap = styled(Dialog)`
  z-index: 1071;
`;

const Header = styled('div')`
  color: ${(props) => props.theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
`;
const CopyIcon = styled(ICCopyOutlined)`
  color: ${({ theme }) => theme.colors.icon};
  margin-left: 8px;
  cursor: pointer;
`;

const Content = styled('div')`
  color: ${(props) => props.theme.colors.text60};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  div {
    &:nth-of-type(2) {
      margin: 12px 0 32px;
    }
  }
`;
const ButtonWrap = styled(Button)`
  display: flex;
  height: 40px;
  padding: 7px 24px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  border-radius: 24px;
  margin-bottom: 32px;
`;

export default ({ open, onCancel, uid }) => {
  const [token, setToken] = useState('');
  const { message } = useSnackbar();

  useEffect(() => {
    // 打开弹窗的时候重新请求
    if (open && uid) {
      getOESStatus({ uid })
        .then((res) => {
          if (res?.success && res?.data?.token) {
            setToken(res.data.token);
          }
        })
        .catch((err) => {
          err?.msg && message.error(err?.msg);
        });
    }
  }, [message, open, uid]);

  return (
    <DialogWrap
      open={open}
      onCancel={onCancel}
      style={{ margin: 32 }}
      title={<Header>{_t('741b029f159e4000a110')}</Header>}
      footer={null}
    >
      <Content>
        <CopyToClipboard
          text={token}
          onCopy={() => {
            message.success(_t('copy.succeed'));
          }}
        >
          <div>
            <span>
              {_t('abb63ad6b2d44000af3d')}
              {token}
            </span>{' '}
            <CopyIcon size={16} />
          </div>
        </CopyToClipboard>
        <div>{_t('f909e6bfb9474800a733')}</div>
        <ButtonWrap fullWidth onClick={onCancel}>
          {_t('confirm')}
        </ButtonWrap>
      </Content>
    </DialogWrap>
  );
};
