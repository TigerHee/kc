import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICHeartFill.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICHeartFillOutlined';
export default KuFoxIcons;
