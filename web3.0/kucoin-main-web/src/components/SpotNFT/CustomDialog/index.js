/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Dialog, Drawer } from '@kufox/mui';
import { useResponsive, useTheme } from '@kufox/mui';
import clxs from 'classnames';
import style from './style.less';
import { CloseOutlined } from '@kufox/icons';

const CustomDialog = (props) => {
  const theme = useTheme();
  const { currentTheme } = theme;
  const { sm, md, lg } = useResponsive(); // 判断当前屏幕尺寸是否满足条件
  const isMobile = sm && !md && !lg;
  const {
    title = '',
    titleAlignMobile = 'center',
    open = false,
    showCloseX = false,
    className = '',
    onCancel = () => void 0,
  } = props;
  const darkTheme = currentTheme === 'dark';
  if (isMobile) {
    return (
      <Drawer
        className={clxs(style.drawerContainer, className)}
        onClose={onCancel}
        show={open}
        anchor={'bottom'}
      >
        <div
          className={clxs(style.titleContainer, {
            [style.titleContainerLeft]: titleAlignMobile === 'left',
          })}
        >
          <div>{title}</div>
          <CloseOutlined
            color={darkTheme ? '#737E8D' : '#00142A'}
            className={style.closeIcon}
            onClick={onCancel}
          />
        </div>
        {props.children}
      </Drawer>
    );
  }
  return (
    <Dialog
      open={open}
      title={title}
      footer={null}
      cancelText=""
      onCancel={onCancel}
      showCloseX={showCloseX}
      className={className}
    >
      {props.children}
    </Dialog>
  );
};

export default CustomDialog;
