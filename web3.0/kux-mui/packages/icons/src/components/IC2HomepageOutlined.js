import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Homepage.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2HomepageOutlined';
export default KuFoxIcons;
