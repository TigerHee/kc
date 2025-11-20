import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICInfo-filled.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICInfoFilled';
export default KuFoxIcons;
