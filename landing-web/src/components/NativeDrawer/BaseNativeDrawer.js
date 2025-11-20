/**
 * Owner: lucase.l.lu@kupotech.com
 * copy by: platform-operation-web
 * @description 带横杠+点击/下滑横杠都是可以关闭弹窗的关闭的抽屉
 */
import { Drawer } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useEventCallback } from '@kux/mui/hooks';
import useTouch from 'components/$/CommunityCollect/hooks/useTouch';

const TOUCH_DOM_CLASS = 'base-native-drawer-content';

const StyledDrawer = styled(Drawer)`
  &.base-native-drawer-content {
    background-color: transparent;
    max-height: 70vh;
  }

  & {
    .KuxDrawer-content {
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      background-color: ${({ theme }) => {
        return theme.colors.mode === 'light' ? theme.colors.backgroundMajor : '#121212'
      }};
    }
  }
`;

const DrawerBar = styled.div`
  width: 64px;
  height: 4px;
  border-radius: 200px;
  background-color: #fff;
  position: absolute;
  top: ${(prop) => prop?.barTop};
  left: calc(50% - 32px);
  z-index: 1001;
`;

export const BaseNativeDrawer = ({
  show,
  onClose,
  header,
  children,
  showBar,
  barTop,
  maskClosable,
  ...restProps
}) => {
  // 滑动关闭
  const barClose = useEventCallback(() => {
    onClose();
  });

  const maxTouchYFunc = useEventCallback(() => {
    // 返回内容主区域dom
    return document.querySelector(`.${TOUCH_DOM_CLASS}`);
  });

  useTouch({
    enable: show,
    bottomCallback: barClose,
    touchConfig: restProps.touchConfig || {
      maxTouchYFunc,
      maxTouchYField: 'top',
    },
  });

  return (
    <StyledDrawer
      header={header}
      show={show}
      onClose={onClose}
      maskClosable={maskClosable}
      {...restProps}
      className={`${TOUCH_DOM_CLASS} ${restProps.className || ''}`}
    >
      {showBar && <DrawerBar barTop={barTop} onClick={barClose} />}
      {children}
    </StyledDrawer>
  );
};

BaseNativeDrawer.propTypes = {
  show: PropTypes.bool, // 显示与否
  maskClosable: PropTypes.bool, // 点击蒙层是否可以关闭抽屉
  showBar: PropTypes.bool, // 是否显示横杠
  onClose: PropTypes.func.isRequired, // 关闭回调
  header: PropTypes.any, // 头部
  barTop: PropTypes.string.isRequired, // 横杠top距离
};

BaseNativeDrawer.defaultProps = {
  onClose: () => {},
  show: false,
  maskClosable: true,
  showBar: true,
  barTop: '-20px',
};

export default memo(BaseNativeDrawer);
