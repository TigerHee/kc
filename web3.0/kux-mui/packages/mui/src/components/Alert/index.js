/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'hooks/index';
import clsx from 'clsx';
import { CloseOutlined, ICInfoOutlined, ICWarningOutlined, ICSuccessOutlined } from '@kux/icons';
import useClassNames from './useClassNames';
import Collapse from '../Collapse';
import {
  AlertRoot,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from './kux';

const DefaultIconMap = (color) => {
  return {
    success: <ICSuccessOutlined size={16} color={color.primary} />,
    error: <ICWarningOutlined size={16} color={color.secondary} />,
    warning: <ICWarningOutlined size={16} color={color.complementary} />,
    info: <ICInfoOutlined size={16} color={color.icon} />,
  };
};

const Alert = (props) => {
  const theme = useTheme();
  const {
    type,
    title,
    description,
    showIcon,
    icon,
    closable,
    onClose,
    action,
    className,
    ...restProps
  } = props;
  const completed = !!(title && description);
  const [open, setOpenState] = useState(true);

  const handleClose = () => {
    setOpenState(false);
    if (onClose) {
      onClose();
    }
  };

  const _classNames = useClassNames({ type });

  return (
    <Collapse in={open}>
      <AlertRoot
        type={type}
        theme={theme}
        completed={completed}
        className={clsx(_classNames.root, className)}
        {...restProps}
      >
        {showIcon ? (
          <AlertIcon className={_classNames.icon}>
            {icon || DefaultIconMap(theme.colors)[type]}
          </AlertIcon>
        ) : null}
        <AlertContent className={_classNames.content}>
          <AlertTitle completed={completed} className={_classNames.title} theme={theme} type={type}>
            {title}
          </AlertTitle>
          {description ? (
            <AlertDescription className={_classNames.description} theme={theme}>
              {description}
            </AlertDescription>
          ) : null}
        </AlertContent>
        {action ? (
          <AlertAction className={_classNames.action} theme={theme}>
            {action}
          </AlertAction>
        ) : null}
        {closable || onClose ? (
          <AlertAction className={_classNames.action} theme={theme} style={{ paddingTop: '4px' }}>
            <CloseOutlined color={theme.colors.icon} onClick={handleClose} size="16" />
          </AlertAction>
        ) : null}
      </AlertRoot>
    </Collapse>
  );
};

Alert.displayName = 'Alert';

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.node,
  description: PropTypes.node,
  showIcon: PropTypes.bool,
  icon: PropTypes.node,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  action: PropTypes.node,
};

Alert.defaultProps = {
  type: 'success',
  showIcon: true,
  closable: false,
};

export default Alert;
