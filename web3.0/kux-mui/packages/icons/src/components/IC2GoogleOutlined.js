import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Google.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2GoogleOutlined';
export default KuFoxIcons;
