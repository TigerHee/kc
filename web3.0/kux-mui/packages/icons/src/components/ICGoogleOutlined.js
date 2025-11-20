import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICGoogle.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICGoogleOutlined';
export default KuFoxIcons;
