/**
 * Owner: chris@kupotech.com
 */
/**
 * 带横杠+点击/下滑横杠都是可以关闭弹窗的关闭的抽屉
 */
import { Drawer } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import PropTypes from 'prop-types';
import { memo } from 'react';

import { useEventCallback } from '@kux/mui/hooks';

import useTouch from 'hooks/useTouch';

const CONTENT_CLASSNAME = 'drawer_content_wrapper';

const DrawerWrapper = styled(Drawer)`
  background: ${({ theme }) => theme.colors.layer};
  padding: 12px 16px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  border-radius: 16px 16px 0px 0px;
  min-height: auto;
  .KuxDrawer-content {
    position: relative;
    // min-height: 270px;
    max-height: 540px;
    overflow: visible;
  }
`;

const DrawerBar = styled.div`
  width: 64px;
  height: 4px;
  border-radius: 200px;
  background-color: ${({ theme }) => theme.colors.layer};
  position: absolute;
  top: ${(prop) => prop?.barTop};
  left: calc(50% - 32px);
  z-index: 1001;
`;

const BaseDrawer = ({
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
    return document.querySelector(`.${CONTENT_CLASSNAME}`);
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
    <DrawerWrapper
      header={header}
      show={show}
      onClose={onClose}
      maskClosable={maskClosable}
      {...restProps}
      className={`Ku_Drawer_Root ${CONTENT_CLASSNAME} ${restProps?.className || ''}`}
    >
      {showBar && <DrawerBar barTop={barTop} onClick={barClose} />}
      {children}
    </DrawerWrapper>
  );
};

BaseDrawer.propTypes = {
  show: PropTypes.bool, // 显示与否
  maskClosable: PropTypes.bool, // 点击蒙层是否可以关闭抽屉
  showBar: PropTypes.bool, // 是否显示横杠
  onClose: PropTypes.func.isRequired, // 关闭回调
  header: PropTypes.any, // 头部
  barTop: PropTypes.string.isRequired, // 横杠top距离
};

BaseDrawer.defaultProps = {
  onClose: () => {},
  show: false,
  maskClosable: true,
  showBar: true,
  barTop: '-28px',
  anchor: 'bottom',
};

export default memo(BaseDrawer);
