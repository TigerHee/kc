import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Kline1.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2Kline1Outlined';
export default KuFoxIcons;
