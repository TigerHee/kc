import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICTradingBot.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICTradingBotOutlined';
export default KuFoxIcons;
