import React, {memo, useCallback, useMemo} from 'react';
import {Pressable} from 'react-native';

import {mediumHitSlop} from 'constants/index';
import {useStore} from './useStore';

const Tab = ({itemKey, children}) => {
  const {activeKey, changeTab} = useStore();

  const isActive = useMemo(() => activeKey === itemKey, [activeKey, itemKey]);
  const memoizedChildren = useCallback(children, [children]);

  return (
    <Pressable
      activeOpacity={0.8}
      hitSlop={mediumHitSlop}
      onPress={() => {
        changeTab(itemKey);
      }}>
      {memoizedChildren({isActive})}
    </Pressable>
  );
};

export default memo(Tab);
