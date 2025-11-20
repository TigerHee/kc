import {memo} from 'react';

import {useStore} from './useStore';

const TabPanel = ({itemKey, children}) => {
  const {activeKey} = useStore();

  return activeKey !== itemKey ? null : children;
};

export default memo(TabPanel);
