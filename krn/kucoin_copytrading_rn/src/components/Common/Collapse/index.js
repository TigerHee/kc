import {useMemoizedFn, useToggle} from 'ahooks';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Collapsible from 'react-native-collapsible';

import {DownArrow, UpArrow} from '../SvgIcon';
import {ItemWrap, Label} from './styles';
const Collapse = props => {
  const {
    isCollapsed: propsIsCollapsed,
    label = '',
    children = null,
    styles = {
      itemWrap: {},
      label: {},
      root: {},
    },
    onCollapsedChange,
  } = props;

  const [isCollapsed, {toggle}] = useToggle(propsIsCollapsed || false);

  const onPress = useMemoizedFn(() => {
    onCollapsedChange?.(!isCollapsed);
    toggle();
  });

  return (
    <View style={styles.root}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <ItemWrap style={styles.itemWrap}>
          {!!label && <Label style={styles.label}>{label}</Label>}
          {isCollapsed ? (
            <DownArrow sizeNumber={16} />
          ) : (
            <UpArrow sizeNumber={16} />
          )}
        </ItemWrap>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
    </View>
  );
};

export default Collapse;
