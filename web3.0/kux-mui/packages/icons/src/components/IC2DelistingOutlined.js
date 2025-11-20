import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Delisting.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2DelistingOutlined';
export default KuFoxIcons;
