import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2RightDown_arrow.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2RightDown_arrowOutlined';
export default KuFoxIcons;
