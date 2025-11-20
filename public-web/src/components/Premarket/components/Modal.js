/**
 * Owner: solar.xia@kupotech.com
 */
import {
  Button,
  css,
  Dialog,
  Global,
  MDrawer,
  styled,
  ThemeProvider,
  useResponsive,
} from '@kux/mui';
import { _t } from 'tools/i18n';

import { useSelector } from 'src/hooks/useSelector';
import { StyledButtonContainer, StyledModalMain } from './styledComponents';

function SmDrawerStyle() {
  return (
    <Global
      styles={css`
        @media screen and (max-width: 767px) {
          .KuxDrawer-mask {
            .KuxDrawer-root {
              width: 100% !important;
              min-width: 0;
              height: 60% !important;
            }
          }
        }
      `}
    />
  );
}

function MdDrawerStyle() {
  return (
    <Global
      styles={css`
        @media screen and (max-width: 767px) {
          .KuxDrawer-mask {
            .KuxDrawer-root {
              width: 100% !important;
              min-width: 0;
              height: 80% !important;
            }
          }
        }
      `}
    />
  );
}

function LgDrawerStyle() {
  return (
    <Global
      styles={css`
        @media screen and (max-width: 767px) {
          .KuxDrawer-mask {
            .KuxDrawer-root {
              width: 100% !important;
              min-width: 0;
              height: 100% !important;
            }
          }
        }
      `}
    />
  );
}

function AutoDrawerStyle() {
  return (
    <Global
      styles={css`
        @media screen and (max-width: 767px) {
          .KuxDrawer-mask {
            .KuxDrawer-root {
              width: 100% !important;
              min-width: unset !important;
              height: auto !important;
            }
          }
        }
      `}
    />
  );
}

const drawerHeightSizeMap = {
  sm: SmDrawerStyle,
  md: MdDrawerStyle,
  lg: LgDrawerStyle,
  auto: AutoDrawerStyle,
};

function DrawerButtonContainer({ children }) {
  const { sm } = useResponsive();
  const xs = !sm;
  return xs ? (
    <StyledButtonContainer>
      <div className="container">{children}</div>
    </StyledButtonContainer>
  ) : null;
}

function DialogWithMd({
  onClose,
  open,
  children,
  title,
  onConfirm,
  onCancel,
  disabledConfirm,
  disabledCancel,
  okText,
  cancelText,
  hideCancelBtn,
}) {
  return (
    <Dialog
      open={open}
      title={title}
      okText={okText ?? _t('u9QAZW6WNmKYHB6do1KwgQ')}
      cancelText={hideCancelBtn ? null : cancelText ?? _t('cancel')}
      size="medium"
      headerProps={{
        onClose,
      }}
      onOk={() => {
        onConfirm();
      }}
      onCancel={() => {
        onCancel();
      }}
      okButtonProps={{
        disabled: disabledConfirm,
      }}
      cancelButtonProps={{
        disabled: disabledCancel,
      }}
    >
      {children}
      <Global
        styles={css`
          .KuxDialog-body {
            max-height: 100vh;
          }
        `}
      />
    </Dialog>
  );
}

const StyledMDrawer = styled(MDrawer)`
  .KuxDrawer-content {
    position: relative;
  }
`;
function DrawerWithSm({ onClose, open, children, title, disabledConfirm, disabledCancel }) {
  return (
    <StyledMDrawer
      show={open}
      anchor="bottom"
      title={title}
      onClose={() => {
        onClose();
      }}
      headerProps={{
        back: false,
      }}
      okButtonProps={{
        disabled: disabledConfirm,
      }}
      cancelButtonProps={{
        disabled: disabledCancel,
      }}
    >
      {children}
    </StyledMDrawer>
  );
}

export default function Modal({
  children,
  open,
  onClose = () => {},
  title,
  onCancel,
  onConfirm = () => {},
  disabledConfirm = false,
  disabledCancel = false,
  hideFooter = false,
  drawerHeightSize = 'sm',
  okText,
  cancelText,
  hideCancelBtn,
}) {
  const { sm } = useResponsive();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const xs = !sm;
  const WrapperComponent = xs ? DrawerWithSm : DialogWithMd;
  return (
    <ThemeProvider theme={currentTheme}>
      <WrapperComponent
        onClose={onClose}
        open={open}
        title={title}
        onConfirm={onConfirm}
        onCancel={onCancel ?? onClose}
        disabledConfirm={disabledConfirm}
        disabledCancel={disabledCancel}
        okText={okText}
        cancelText={cancelText}
        hideCancelBtn={hideCancelBtn}
      >
        {(() => {
          if (xs) {
            const Style = drawerHeightSizeMap[drawerHeightSize];
            return <Style />;
          }
          return null;
        })()}
        <StyledModalMain>{children}</StyledModalMain>
        {!hideFooter && (
          <DrawerButtonContainer>
            {!hideCancelBtn && (
              <Button
                className="button"
                onClick={onCancel || onClose}
                variant="outlined"
                disabled={disabledCancel}
              >
                {cancelText || _t('jtYPMkHrMXjEKjzkD7c9b1')}
              </Button>
            )}
            <Button
              className="button"
              type="primary"
              onClick={onConfirm}
              disabled={disabledConfirm}
            >
              {okText || _t('u9QAZW6WNmKYHB6do1KwgQ')}
            </Button>
          </DrawerButtonContainer>
        )}
      </WrapperComponent>
    </ThemeProvider>
  );
}
