import React, {memo} from 'react';
import {Text} from 'react-native';
import {css} from '@emotion/native';
/**
 * EllipsisText 组件
 * 限制显示为一行，并在超出长度时显示省略号
 * @param {Object} props - 组件的属性
 * @param {Object} props.style - 自定义样式
 * @param {React.ReactNode} props.children - 需要显示的文本内容
 * @returns {React.ReactElement} - 返回一个 React 组件
 */
const EllipsisText = ({
  width,
  flex = true,
  ellipsizeMode = 'tail',
  numberOfLines = 1,
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[
        style,
        css`
          ${flex ? `flex: ${!width ? '1' : 'auto'}` : ''};
          max-width: ${width ? width + 'px' : 'auto'};
        `,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...rest}>
      {children}
    </Text>
  );
};

export default memo(EllipsisText);
