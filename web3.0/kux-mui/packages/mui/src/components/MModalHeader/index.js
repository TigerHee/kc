import React from 'react';
import { MModalHeaderRoot } from './kux';

const MModalHeader = React.forwardRef((props, ref) => {
  return <MModalHeaderRoot {...props} ref={ref} />;
});

export default MModalHeader;
