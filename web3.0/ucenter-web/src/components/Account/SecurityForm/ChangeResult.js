/**
 * Owner: willen@kupotech.com
 */

import { Button, Dialog, ModalHeader, styled, useTheme } from '@kux/mui';
import darkError from 'static/account/security/dark-error.svg';
import darkWarning from 'static/account/security/dark-warning.svg';
import lightError from 'static/account/security/light-error.svg';
import lightWarning from 'static/account/security/light-warning.svg';
import { _t } from 'tools/i18n';

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-height: 70vh;
    overflow-y: auto;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxModalFooter-root {
      padding: 32px 24px !important;
    }
  }

  .KuxModalFooter-root {
    padding: 24px 32px 32px 32px;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding-top: ${(props) => (props.titleForDialog ? '0px' : '32px')};
  padding-bottom: 0px;
`;

const ConfirmContent = styled.div`
  font-size: 16px;
  margin-top: ${(props) => (props.titleForDialog ? '0px' : '8px')};
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const Operate = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 20px;
  button:not(:first-child) {
    margin-top: 12px;
  }
  button:last-child {
    margin-top: 0;
  }
`;

const StyledTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const StyledIcon = styled.div`
  width: 148px;
  height: 148px;
  margin: 8px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ({
  title,
  content,
  onOk,
  okText,
  onCancel,
  vertical,
  iconType = '1',
  icon = null,
  titleForDialog = true,
  ...props
}) => {
  const isVertical = vertical && props.cancelText !== null;
  const theme = useTheme();

  return (
    <StyledDialog
      onOk={onOk}
      okText={okText}
      showCloseX={titleForDialog ? true : false}
      onCancel={onCancel}
      {...(isVertical ? { footer: null } : {})}
      cancelText={_t('poolx.ac.modal.cancel')}
      header={
        titleForDialog ? (
          <ModalHeader title={title} close={true} border={null} onClose={onCancel} />
        ) : null
      }
      title={title}
      centeredFooterButton={!isVertical && !titleForDialog}
      {...props}
    >
      <Content titleForDialog={titleForDialog}>
        {icon ? (
          icon
        ) : (
          <>
            {iconType && iconType === 'warning' && (
              <StyledIcon>
                <img
                  src={theme.currentTheme === 'light' ? lightWarning : darkWarning}
                  alt="light-warning-icon"
                />
              </StyledIcon>
            )}
            {iconType && iconType === 'error' && (
              <StyledIcon>
                <img
                  src={theme.currentTheme === 'light' ? lightError : darkError}
                  alt="light-error-icon"
                />
              </StyledIcon>
            )}
          </>
        )}
        {!titleForDialog && <StyledTitle>{title}</StyledTitle>}
        <ConfirmContent titleForDialog={titleForDialog}>{content}</ConfirmContent>
        {!!isVertical && (
          <Operate>
            <Button onClick={onOk}>{okText}</Button>
            <Button style={{ marginTop: '8px' }} variant="outlined" onClick={onCancel}>
              {_t('poolx.ac.modal.cancel')}
            </Button>
          </Operate>
        )}
      </Content>
    </StyledDialog>
  );
};
