import {useMemoizedFn, useToggle} from 'ahooks';
import {noop} from 'lodash';
import React, {memo, useState} from 'react';
import {Pressable, TouchableWithoutFeedback} from 'react-native';

import downArrowIc from 'assets/common/ic-arrow-down-light.png';
import upArrowIc from 'assets/common/ic-arrow-up-light.png';
import {largeHitSlop} from 'constants/index';
import {ArrowIc, DescText, DescWrap, HiddenToMeasureTextHeight} from './styles';

const LONG_TEXT_NODE_HEIGHT = 35;

const UserDesc = props => {
  const {content} = props;
  const [isCollapsed, {toggle}] = useToggle(true);
  const [textNeedShowExpand, setTextNeedShowExpand] = useState(false);
  const [isFinishMeasure, {toggle: toggleMeasure}] = useToggle(false);

  const toggleTextCollapse = useMemoizedFn(() => {
    toggle();
  });

  const onHandleMeasureText = useMemoizedFn(event => {
    if (isFinishMeasure) return;
    const height = Math.floor(event.nativeEvent.layout.height || 0);
    setTextNeedShowExpand(height > LONG_TEXT_NODE_HEIGHT);
    toggleMeasure(true);
  });

  return (
    <DescWrap>
      {!!content && (
        <HiddenToMeasureTextHeight onLayout={onHandleMeasureText}>
          {content}
        </HiddenToMeasureTextHeight>
      )}

      {isFinishMeasure && (
        <Pressable onPress={textNeedShowExpand ? toggleTextCollapse : noop}>
          <DescText
            numberOfLines={isCollapsed ? 2 : 9} // 限制文本显示的行数
            ellipsizeMode="tail" // 指定省略方式为尾部省略
          >
            {content}
          </DescText>
        </Pressable>
      )}

      {textNeedShowExpand && (
        <TouchableWithoutFeedback
          hitSlop={largeHitSlop}
          onPress={toggleTextCollapse}>
          <ArrowIc source={isCollapsed ? downArrowIc : upArrowIc} />
        </TouchableWithoutFeedback>
      )}
    </DescWrap>
  );
};

export default memo(UserDesc);
