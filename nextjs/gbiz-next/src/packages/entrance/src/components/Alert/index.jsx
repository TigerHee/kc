/**
 * mui-next 组件未提供 Alert，临时迁移的
 * @todo 接入新组件库后移除
 */
import _extends from '@babel/runtime/helpers/extends';
import _CloseOutlined from '@kux/icons/CloseOutlined';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import _ICInfoOutlined from '@kux/icons/ICInfoOutlined';
import _ICWarningOutlined from '@kux/icons/ICWarningOutlined';
import _ICSuccessOutlined from '@kux/icons/ICSuccessOutlined';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { useTheme } from '../hooks/index.js';
import { useTheme } from '@kux/mui';
// import { composeClassNames, generateClassName } from '../styles/index.js';
import { composeClassNames, generateClassName } from '@kux/mui/styles';
// import Collapse from '../Collapse/index.js';
import { Collapse } from '@kux/mui';
import _taggedTemplateLiteralLoose from '@babel/runtime/helpers/taggedTemplateLiteralLoose';
// import styled from '../emotion/index.js';
import styles from './styles.module.scss';
import clsx from 'clsx';

function getAlertClassName(slot) {
  return generateClassName('KuxAlert', slot);
}

function useClassNames(state) {
  var type = state.type;
  var slots = {
    root: ['root', type],
    icon: ['icon'],
    content: ['content'],
    title: ['title'],
    description: ['description'],
    action: ['action']
  };
  return composeClassNames(slots, getAlertClassName);
}

var AlertRoot = ({ type, className, children, ...props }) => {
  return <div className={clsx(styles.alertRoot, type, className)} {...props}>{ children }</div>
}
var AlertContent = ({ className, children, ...props }) => {
  return <div className={clsx(styles.alertContent, className)} {...props}>{children}</div>
};
var AlertTitle = ({ type, className, children, ...props }) => {
  return <div className={clsx(styles.alertTitle, type, className)} {...props}>{ children }</div>
}
var AlertDescription = ({ type, className, children, ...props }) => {
  return <div className={clsx(styles.alertDescription, type, className)} {...props}>{ children }</div>
}
var AlertIcon = ({ type, className, children, ...props }) => {
  return <div className={clsx(styles.alertIcon, type, className)} {...props}>{ children }</div>
};
var AlertAction = ({ type, className, children, ...props }) => {
  return <div className={clsx(styles.alertAction, type, className)} {...props}>{ children }</div>
};

var DefaultIconMap = function DefaultIconMap(color) {
  return {
    success: /*#__PURE__*/React.createElement(_ICSuccessOutlined, {
      size: 16,
      color: color.primary
    }),
    error: /*#__PURE__*/React.createElement(_ICWarningOutlined, {
      size: 16,
      color: color.secondary
    }),
    warning: /*#__PURE__*/React.createElement(_ICWarningOutlined, {
      size: 16,
      color: color.complementary
    }),
    info: /*#__PURE__*/React.createElement(_ICInfoOutlined, {
      size: 16,
      color: color.icon
    })
  };
};

var Alert = function Alert(props) {
  var theme = useTheme();

  var type = props.type,
      title = props.title,
      description = props.description,
      showIcon = props.showIcon,
      icon = props.icon,
      closable = props.closable,
      onClose = props.onClose,
      action = props.action,
      className = props.className,
      restProps = _objectWithoutPropertiesLoose(props, ["type", "title", "description", "showIcon", "icon", "closable", "onClose", "action", "className"]);

  var completed = !!(title && description);

  var _useState = useState(true),
      open = _useState[0],
      setOpenState = _useState[1];

  var handleClose = function handleClose() {
    setOpenState(false);

    if (onClose) {
      onClose();
    }
  };

  var _classNames = useClassNames({
    type: type
  });

  return /*#__PURE__*/React.createElement(Collapse, {
    "in": open
  }, /*#__PURE__*/React.createElement(AlertRoot, _extends({
    type: type,
    theme: theme,
    completed: completed,
    className: clsx(_classNames.root, className)
  }, restProps), showIcon ? /*#__PURE__*/React.createElement(AlertIcon, {
    className: _classNames.icon
  }, icon || DefaultIconMap(theme.colors)[type]) : null, /*#__PURE__*/React.createElement(AlertContent, {
    className: _classNames.content
  }, /*#__PURE__*/React.createElement(AlertTitle, {
    completed: completed,
    className: _classNames.title,
    theme: theme,
    type: type
  }, title), description ? /*#__PURE__*/React.createElement(AlertDescription, {
    className: _classNames.description,
    theme: theme
  }, description) : null), action ? /*#__PURE__*/React.createElement(AlertAction, {
    className: _classNames.action,
    theme: theme
  }, action) : null, closable || onClose ? /*#__PURE__*/React.createElement(AlertAction, {
    className: _classNames.action,
    theme: theme,
    style: {
      paddingTop: '4px'
    }
  }, /*#__PURE__*/React.createElement(_CloseOutlined, {
    color: theme.colors.icon,
    onClick: handleClose,
    size: "16"
  })) : null));
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
  action: PropTypes.node
};
Alert.defaultProps = {
  type: 'success',
  showIcon: true,
  closable: false
};

export default Alert;
