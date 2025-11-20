import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/IC2Archive.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'IC2ArchiveOutlined';
export default KuFoxIcons;
