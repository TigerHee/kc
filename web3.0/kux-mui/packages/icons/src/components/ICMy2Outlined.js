import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICMy2.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICMy2Outlined';
export default KuFoxIcons;
