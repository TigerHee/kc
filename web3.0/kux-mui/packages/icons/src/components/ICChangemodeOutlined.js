import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICChangemode.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICChangemodeOutlined';
export default KuFoxIcons;
