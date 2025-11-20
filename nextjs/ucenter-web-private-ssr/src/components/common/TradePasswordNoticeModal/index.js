/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Button, Dialog, styled, useTheme } from '@kux/mui';
import darkWarning from 'static/account/security/dark-warning.svg';
import lightWarning from 'static/account/security/light-warning.svg';
import { _t, _tHTML } from 'tools/i18n';

const StyledDialog = styled(Dialog)`
  border-radius: 20px;
  .KuxDialog-body {
    max-width: 400px;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 32px 0;
`;

const ConfirmContent = styled.div`
  font-size: 16px;
  margin-top: ${(props) => (props.titleForDialog ? '0px' : '8px')};
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  .color-danger {
    color: ${(props) => props.theme.colors.secondary};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const StyleIcon = styled.div`
  width: 148px;
  height: 148px;
  margin: 8px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
  border-radius: 90px;
`;

const TradePasswordNoticeModal = ({ visible, onClose }) => {
  useLocale();

  const theme = useTheme();

  return (
    <StyledDialog open={visible} title="" footer={null} onCancel={onClose} header={null}>
      <Content>
        <StyleIcon>
          <img
            src={theme.currentTheme === 'light' ? lightWarning : darkWarning}
            alt="light-warning-icon"
          />
        </StyleIcon>
        <ConfirmContent>{_tHTML('trade.code.warning')}</ConfirmContent>
        <StyledButton data-testid="close-button" fullWidth onClick={onClose}>
          {_t('i.know')}
        </StyledButton>
      </Content>
    </StyledDialog>
  );
};

export default TradePasswordNoticeModal;
