/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled, { keyframes } from 'emotion/index';
import {
  SuccessOutlined,
  InfoOutlined,
  ErrorOutlined,
  StatusOutlined,
  SpinOutlined,
} from '@kux/icons';
import createChainedFunction from 'utils/createChainedFunction';
import useTheme from 'hooks/useTheme';
import Slide from '../Slide';
import Collapse from '../Collapse';
import { transitionDuration, getTransitionDirection } from './config';
import Snackbar from './Snackbar';
import SnackbarContent from './SnackbarContent';

const SnackbarBg = styled.div`
  background: ${(props) => props.theme.colors.base};
  border-radius: 4px;
`;

const StyledSnackbar = styled(Snackbar)`
  position: relative;
  transform: translateX(0);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 6px 0;
`;

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSuccessOutlined = styled(SuccessOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.primary};
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const StyledInfoOutlined = styled(InfoOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.icon};
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const StyledErrorOutlined = styled(ErrorOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.secondary};
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const StyledWaringOutlined = styled(StatusOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.secondary};
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const rotate = keyframes`
  0% {
   transform: rotate(0deg);
  }
  100% {
   transform: rotate(360deg);
  }
`;

const StyledSpinOutlined = styled(SpinOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.primary};
  animation: ${rotate} 0.5s infinite linear;
  [dir='rtl'] & {
    margin-right: unset;
    margin-left: 8px;
  }
`;

const IconBox = styled.div`
  display: inline-flex;
  flex-shrink: 0;
`;

const iconsVariants = {
  success: StyledSuccessOutlined,
  info: StyledInfoOutlined,
  error: StyledErrorOutlined,
  warning: StyledWaringOutlined,
  loading: StyledSpinOutlined,
};

const SnackbarItem = React.forwardRef((props, ref) => {
  const timeout = React.useRef();
  const [collapsed, setCollapsed] = React.useState(true);
  const theme = useTheme();
  const handleClose = createChainedFunction([props.snack.onClose, props.onClose], props.snack.key);

  const handleEntered = () => {
    if (props.snack.requestClose) {
      handleClose(null);
    }
  };

  const handleExitedScreen = () => {
    timeout.current = setTimeout(() => {
      setCollapsed(!collapsed);
    }, 125);
  };

  const { hideIcon, snack } = props;

  const { open, variant, position, message: snackMessage, ...singleSnackProps } = snack;

  const transitionProps = {
    direction: getTransitionDirection(position),
  };

  const callbacks = [
    'onEnter',
    'onEntering',
    'onEntered',
    'onExit',
    'onExiting',
    'onExited',
  ].reduce(
    (acc, cbName) => ({
      ...acc,
      [cbName]: createChainedFunction([props[cbName]], props.snack.key),
    }),
    {},
  );

  const Icon = iconsVariants[variant];

  return (
    <Collapse
      unmountOnExit
      timeout={175}
      in={collapsed}
      onExited={callbacks.onExited}
      style={{
        overflow: 'visible',
        width: 'fit-content',
        margin: 'auto',
      }}
      role="alert"
    >
      <StyledSnackbar open={open} onClose={handleClose} {...singleSnackProps}>
        <Slide
          appear
          in={open}
          timeout={transitionDuration}
          onExit={callbacks.onExit}
          onExiting={callbacks.onExiting}
          onExited={handleExitedScreen}
          onEnter={callbacks.onEnter}
          onEntering={callbacks.onEntering}
          onEntered={createChainedFunction([callbacks.onEntered, handleEntered])}
          {...transitionProps}
        >
          <SnackbarBg theme={theme}>
            <SnackbarContent variant={variant} theme={theme}>
              <StyledMessage>
                {(!hideIcon || variant === 'loading') && (
                  <IconBox>
                    <Icon size={16} theme={theme} />
                  </IconBox>
                )}
                {snackMessage}
              </StyledMessage>
            </SnackbarContent>
          </SnackbarBg>
        </Slide>
      </StyledSnackbar>
    </Collapse>
  );
});

export default SnackbarItem;
