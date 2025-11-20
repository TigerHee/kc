import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Gas.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2GasOutlined';
export default KuFoxIcons;
