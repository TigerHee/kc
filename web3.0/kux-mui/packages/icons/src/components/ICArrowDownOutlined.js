import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICArrowDown.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICArrowDownOutlined';
export default KuFoxIcons;
