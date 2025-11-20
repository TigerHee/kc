import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/LeftMulti.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'LeftMultiOutlined';
export default KuFoxIcons;
