/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICInfoOutlined } from '@kux/icons';
import { Box, Dialog, Drawer, styled, useResponsive, useTheme } from '@kux/mui';
import { tenantConfig } from 'config/tenant';
import { useMemo } from 'react';
import { _t } from 'tools/i18n';

const StyledDialog = styled(Dialog)`
  overflow: hidden;
  .KuxDialog-content {
    display: block;
    max-height: calc(100vh - 30vh - 90px);
    overflow-y: auto;
  }
  .KuxSpin-container {
    &:after {
      background: ${({ isDark }) => (isDark ? '#222223' : '#FFFFFF')}; // 适配为modal的背景颜色
    }
  }

  // 长文本优化
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxInput-label {
      div {
        max-width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .KuxInput-focus {
      .KuxInput-label {
        div {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }
      }
    }
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const StyledTipWrap = styled.div`
  width: 100%;
  display: flex;
  padding: 12px 16px;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  column-gap: 8px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.complementary8};
`;

const TipText = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
`;

const IconWrap = styled.div`
  padding-top: 1px;
  width: 16px;
  height: 16px;
`;

const ExDialog = ({ isDark, overFlow, title, open, onCancel, children }) => {
  return (
    <StyledDialog
      isDark={isDark}
      overFlow={overFlow}
      title={title}
      footer={null}
      open={open}
      cancelText={null}
      okText={null}
      onCancel={onCancel}
      style={{ maxWidth: 520, width: '100%' }}
    >
      {children}
      <Box style={{ height: '32px' }} />
    </StyledDialog>
  );
};

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  .KuxDrawer-content {
    padding: 16px;
  }
`;

const ExDrawer = ({ show, title, onCancel, children }) => {
  return (
    <StyledDrawer anchor="bottom" back={false} show={show} title={title} onClose={onCancel}>
      {children}
    </StyledDrawer>
  );
};

const SecurityVerifyModal = (props) => {
  const {
    visible,
    showTopTip = false,
    topTip = tenantConfig.account.securityVerifyTip(_t),
    modalTitle = '',
    overFlow = true,
    children,
  } = props;

  const rv = useResponsive();
  const isH5 = !rv?.sm;

  useLocale();

  const theme = useTheme();

  const handleBack = () => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      if (document.referrer) {
        window.location.replace(document.referrer);
      } else {
        JsBridge.open({
          type: 'func',
          params: { name: 'exit' },
        });
      }
    } else {
      if (props?.onCancel && typeof props.onCancel === 'function') {
        props.onCancel();
      } else {
        window.history.go(-1);
      }
    }
  };

  const render = useMemo(
    () => () =>
      (
        <>
          {showTopTip ? (
            <>
              <StyledTipWrap>
                <IconWrap>
                  <ICInfoOutlined size={16} color={theme.colors.complementary} />
                </IconWrap>
                <TipText>{topTip}</TipText>
              </StyledTipWrap>
              <Box style={{ height: '24px' }} />
            </>
          ) : (
            <Box style={{ height: '6px' }} />
          )}
          {children}
        </>
      ),
    [showTopTip, theme, topTip, children],
  );

  return !isH5 ? (
    <ExDialog
      isDark={theme.currentTheme === 'dark'}
      overFlow={overFlow}
      title={<Title>{modalTitle || _t('security.verify')}</Title>}
      open={visible}
      onCancel={handleBack}
    >
      {render()}
    </ExDialog>
  ) : (
    <ExDrawer
      show={visible}
      title={<Title>{modalTitle || _t('security.verify')}</Title>}
      onCancel={handleBack}
    >
      {render()}
    </ExDrawer>
  );
};

export default SecurityVerifyModal;
