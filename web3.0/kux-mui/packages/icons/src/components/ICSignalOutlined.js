import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICSignal.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICSignalOutlined';
export default KuFoxIcons;
