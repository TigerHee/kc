import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICThumb-filled.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICThumbFilled';
export default KuFoxIcons;
