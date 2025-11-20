/**
 * Owner: tiger@kupotech.com
 */
import { ICCopyOutlined } from '@kux/icons';
import { Button as OriginButton, styled, useSnackbar } from '@kux/mui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { _t } from 'tools/i18n';

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.divider8};
`;
const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .emailBox {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .emailTip {
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 140%; holder-0-id;
  }
  .email {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.text};
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }
`;
export const CopyIcon = styled(ICCopyOutlined)`
  font-size: 16px;
`;
export const ExButton = styled(OriginButton)`
  display: flex;
  gap: 4px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 100%;
    max-width: 311px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: auto;
  }
`;

// TODO - tiger 邮箱地址数据
const email = 'support@kucoin.eu';

export default () => {
  const { message } = useSnackbar();

  return (
    <>
      <Divider />
      <Content>
        <div className="emailBox">
          <div className="emailTip">{_t('75238ec00d7c4000afbe')}</div>
          <div>
            <a className="email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
        <CopyToClipboard
          text={email}
          onCopy={() => {
            message.success(_t('copy.succeed'));
          }}
        >
          <ExButton size="basic">
            <CopyIcon />
            <span>{_t('d67e3400375e4000a99c')}</span>
          </ExButton>
        </CopyToClipboard>
      </Content>
    </>
  );
};
