/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';

import {
  SuccessOutlined,
  InfoOutlined,
  ErrorOutlined,
  StatusOutlined,
  ICCloseOutlined,
} from '@kux/icons';
import createChainedFunction from 'utils/createChainedFunction';

import useTheme from 'hooks/useTheme';
import Slide from '../Slide';
import Collapse from '../Collapse';
import { transitionDuration, getTransitionDirection } from './config';
import Notice from './Notice';

const NoticeBg = styled.div`
  background: ${(props) => props.theme.colors.layer};
  border-radius: 8px;
`;

const StyledNotice = styled(Notice)`
  position: relative;
  transform: translateX(0);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 6px 0;
`;

const NotificationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-grow: 1;
  padding: 16px 16px 16px 12px;
  border-radius: 4px 8px 8px 4px;
  border-left: 4px solid ${(props) => props.borderStatus};
  font-family: ${(props) => props.theme.fonts.family};
  box-shadow: ${(props) => props.theme.shadows.middle};
  overflow: hidden;
`;

const NotificationContent = styled.div`
  flex: 1;
  padding-top: 2px;
`;

const NotificationMessage = styled.div`
  position: relative;
  font-size: 16px;
  line-height: 21px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  word-break: break-word;
  padding-right: ${(props) => (props.closeable ? '24px' : '0')};
`;

const NotificationDesc = styled.div`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text60};
  word-break: break-word;
  margin-top: 8px;
`;

const NotificationAction = styled.div`
  margin-top: 12px;
`;

const CloseIcon = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0;
  top: -2px;
`;

const IconBox = styled.div`
  padding-top: 1px;
  display: inline-flex;
  flex-shrink: 0;
  padding-right: 8px;
  line-height: 26px;
`;

const NotificationItem = (props) => {
  const timeout = React.useRef();
  const [collapsed, setCollapsed] = React.useState(true);
  const theme = useTheme();
  const handleClose = createChainedFunction(
    [props.notice.onClose, props.onClose],
    props.notice.key,
  );

  const handleEntered = () => {
    if (props.notice.requestClose) {
      handleClose(null);
    }
  };

  const handleExitedScreen = () => {
    timeout.current = setTimeout(() => {
      setCollapsed(!collapsed);
    }, 125);
  };

  const { hideIcon, notice } = props;

  const {
    open,
    variant,
    key,
    position,
    message,
    description,
    closeable,
    action,
    icon: iconCustom,
    direction,
    ...others
  } = notice;

  const _TransitionDirection = getTransitionDirection(position);
  const transitionProps = {
    direction:
      direction === 'rtl'
        ? {
            left: 'right',
            right: 'left',
          }[_TransitionDirection] || _TransitionDirection
        : _TransitionDirection,
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
      [cbName]: createChainedFunction([props[cbName]], props.notice.key),
    }),
    {},
  );

  const iconsVariants = React.useMemo(() => {
    return {
      success: <SuccessOutlined size="24" color={theme.colors.primary} />,
      info: <InfoOutlined size="24" color={theme.colors.icon} />,
      error: <ErrorOutlined size="24" color={theme.colors.secondary} />,
      warning: <StatusOutlined size="24" color={theme.colors.complementary} />,
    };
  }, [theme]);

  const borderStatus = React.useMemo(() => {
    return {
      success: theme.colors.primary,
      info: theme.colors.icon,
      error: theme.colors.secondary,
      warning: theme.colors.complementary,
    };
  }, [theme]);

  const icon = iconsVariants[variant];
  const borderColor = borderStatus[variant];

  return (
    <Collapse
      unmountOnExit
      timeout={175}
      in={collapsed}
      onExited={callbacks.onExited}
      style={{
        overflow: 'visible',
      }}
      role="alert"
    >
      <StyledNotice open={open} onClose={handleClose} {...others}>
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
          <NoticeBg theme={theme}>
            <NotificationWrapper theme={theme} borderStatus={borderColor}>
              {!hideIcon && <IconBox>{iconCustom || icon}</IconBox>}
              <NotificationContent>
                <NotificationMessage theme={theme} closeable={closeable}>
                  {message}
                  {closeable ? (
                    <CloseIcon
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      <ICCloseOutlined size="12" color={theme.colors.icon} />
                    </CloseIcon>
                  ) : null}
                </NotificationMessage>
                <NotificationDesc theme={theme}>{description}</NotificationDesc>
                {action ? (
                  <NotificationAction>
                    {action({
                      key,
                      close: () => {
                        handleClose();
                      },
                    })}
                  </NotificationAction>
                ) : null}
              </NotificationContent>
            </NotificationWrapper>
          </NoticeBg>
        </Slide>
      </StyledNotice>
    </Collapse>
  );
};

export default NotificationItem;
