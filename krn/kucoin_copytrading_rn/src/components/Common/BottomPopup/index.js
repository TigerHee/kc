import React, {memo} from 'react';
import {useWindowDimensions} from 'react-native';
import styled, {css} from '@emotion/native';
import {Drawer, useTheme} from '@krn/ui';

import {isAndroid} from 'utils/helper';

const ContentWrapper = styled.View`
  background: ${({theme}) => theme.colorV2.layer};
  flex-direction: column;
  margin: 24px 0px 0;
  border-radius: 16px 16px 0 0;
`;

const DrawerWrap = styled.View`
  background: ${({theme}) => theme.colorV2.layer};
  flex-direction: column;
  padding-bottom: ${isAndroid ? '12px' : 0};
  border-radius: 16px 16px 0 0;
`;

const TopIndicator = styled.View`
  position: static;
  top: -16px;
  border-radius: 200px;
  width: 64px;
  height: 4px;
  margin: auto;
  background: ${({theme}) => theme.colorV2.textEmphasis};
  z-index: 99;
`;

/**
 * BottomPopup 基础底部弹窗UI组件
 * @param {Object} props 组件的属性。
 * @param {boolean} props.show 是否显示弹出窗口。
 * @param {function} props.onClose 处理弹出窗口关闭事件的回调函数。
 * @param {React.ReactNode} props.children 在内容包装器内渲染的子元素。
 * @param {string} props.id 弹出窗口元素的 id。
 * @param {Object} [props.contentStyle={}] 应用于内容重写覆盖的样式对象，可选。
 */
const BottomPopup = ({
  show,
  onClose,
  children,
  footer,
  id,
  containerStyle = {},
  rootStyle = {},
  rootHeight,
}) => {
  const screenHeight = Math.round(useWindowDimensions().height);
  const {colorV2} = useTheme();

  const maxHeight =
    rootHeight || Math.max(Math.floor(0.8 * screenHeight), screenHeight - 124);

  return (
    <>
      <Drawer
        initialOffsetFromBottom={1}
        gestureEnabled={false}
        header={<TopIndicator />}
        id={id}
        show={show}
        keyboardHandlerEnabled={false}
        onClose={onClose}
        styles={{
          mainWrapper: css`
            background: ${colorV2.layer};
            border-radius: 16px 16px 0 0;
          `,
        }}>
        <DrawerWrap
          style={[
            {
              maxHeight,
            },
            rootStyle,
          ]}>
          <ContentWrapper style={[containerStyle]}>{children}</ContentWrapper>
          {footer}
        </DrawerWrap>
      </Drawer>
    </>
  );
};

export default memo(BottomPopup);
