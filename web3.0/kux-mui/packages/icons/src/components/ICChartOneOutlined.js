import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/ICChartOne.svg';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = 'ICChartOneOutlined';
export default KuFoxIcons;
