import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICFail.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICFailOutlined';
export default KuFoxIcons;
