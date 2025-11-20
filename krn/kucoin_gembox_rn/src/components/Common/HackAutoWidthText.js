/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useMemo, useState} from 'react';
import {Platform, Text} from 'react-native';

// 此Hack按需使用
const HackAutoWidthText = props => {
  const {children, offset = 10, style, ...restProps} = props;
  const [width, setWidth] = useState('auto');
  const originMarginRight = useMemo(() => {
    if (style && style[0]?.marginRight) {
      return style[0].marginRight;
    }
    return 0;
  }, [style]);
  // ios无问题，直接返回
  if (Platform.OS === 'ios') return <Text {...props} />;
  // hack一下Text的原始宽度+offset，再marginRight一下负偏移量，不让其影响布局
  return (
    <Text
      style={[style, {width, marginRight: originMarginRight - offset}]}
      {...restProps}
      onTextLayout={({nativeEvent}) => {
        // 在文本渲染后添加offset偏移量
        if (nativeEvent?.lines[0]?.width && width === 'auto') {
          setWidth(nativeEvent?.lines[0]?.width + offset);
        }
      }}>
      {children}
    </Text>
  );
};
export default HackAutoWidthText;
