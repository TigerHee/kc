import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICP2P.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICP2POutlined';
export default KuFoxIcons;
