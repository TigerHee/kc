/**
 * Owner: jesse.shao@kupotech.com
 */
// 没有资格的用户的全局弹窗提示
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'dva';
import PropTypes from 'prop-types';
import { Dialog } from '@kufox/mui';
import { isFunction, isEmpty } from 'lodash/fp';
import { KUCOIN_HOST } from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { useIsMobile } from 'components/Responsive';
import { ThemeProvider } from '@kufox/mui';

import styles from './index.less';

/**
 * 活动页面针对“限制账户类型”的提醒弹窗， 用于提醒用户自己的账户不符合要求
 * 针对不允许的账户类型给予全屏弹窗提示（无关闭按钮）> 默认返回链接为KuCoin首页；
 * tips1 如果返回链接为业务线自己的自定义链接 请传递 @jumpUrl 参数 形如 { app: '', h5: '', web: '' }
 * tips2 如果点击操作按钮后有其他逻辑操作 请传入 @onClose 方法，如果已在 @onClose 方法中做了跳转处理，请传递 @jumpUrl 参数为 {};
 * tips3 h5/app 建议 @size 使用 "mini", pc 建议使用 @size 使用 "basic"
 * 维护 @Melon.corp.kucoin.com
 */

const UserLimitedInfoDialog = ({ open = false, title, jumpUrl, okText, des, onClose, size, ...rest }) => {
  const [dialogOpen, setDialogOpen] = useState(open);
  const isMobile = useIsMobile();
  const { isInApp } = useSelector(state => {
    return {
      isInApp: state.app.isInApp,
    };
  }, shallowEqual);
  let url = undefined;
  if (isInApp) {
    url = jumpUrl.app;
  } else {
    url = isMobile ? jumpUrl.h5 : jumpUrl.web;
  }
  useEffect(() => {
    setDialogOpen(open);
  }, [open]);
  //关闭弹窗
  const doClose = useCallback(() => {
    if (onClose && isFunction(onClose)) {
      onClose();
    }

    if (!isEmpty(url)) {
      if (isInApp) {
        JsBridge.open({ type: 'jump', params: { url } });
      } else {
        const newPage = window.open(url, '_self');
        newPage.opener = null;
      }
    }
  }, [isInApp, url, onClose]);

  return (
    <ThemeProvider>
      <Dialog
        open={dialogOpen}
        size={size}
        showCloseX={false}
        okText={okText}
        cancelText={null}
        title={title}
        onOk={doClose}
        {...rest}
      >
        <div className={styles.unableModalDesc}>{des}</div>
      </Dialog>
    </ThemeProvider>
  );
};

UserLimitedInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired, // 是否显示
  jumpUrl: PropTypes.object, // 跳转链接 格式为 { app: '', h5: '', web: '' };
  title: PropTypes.any, // 主标题
  okText: PropTypes.any, // 确认按钮文字
  des: PropTypes.any, // 描述文字
  onClose: PropTypes.func, // 点击关闭后的回调
  size: PropTypes.oneOf(['basic', 'large', 'middle', 'mini']), // 弹窗大小
  rest: PropTypes.any, // 其余参数同@kufox/mui 的dialog
};

UserLimitedInfoDialog.defaultProps = {
  open: false,
  jumpUrl: {
    app: '/home?page=0',
    h5: KUCOIN_HOST,
    web: KUCOIN_HOST,
  },
  title: _t('anniversaryNew.PartRes'),
  okText: _t('anniversaryNew.unusual.backHome'),
  des: _t('anniversaryNew.unusual.noRight'),
  onClose: () => {},
  size: 'basic',
};

export default UserLimitedInfoDialog;
