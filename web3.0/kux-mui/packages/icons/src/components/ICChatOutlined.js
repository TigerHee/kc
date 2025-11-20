import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICChat.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICChatOutlined';
export default KuFoxIcons;
