import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICPlus2.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICPlus2Outlined';
export default KuFoxIcons;
