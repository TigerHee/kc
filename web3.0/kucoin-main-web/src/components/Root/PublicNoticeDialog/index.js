/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Dialog } from '@kc/mui';
import { makeStyles } from '@kc/mui/lib/styles';
import { withRouter } from 'components/Router';
import { connect } from 'react-redux';
import { ga } from 'utils/ga';
import { addLangToPath } from 'tools/i18n';

const mainColor = '#E7CE98';

const useStyles = makeStyles(() => {
  return {
    dialog: () => {
      return {
        '& .MuiDialog-paper': {
          width: 480,
          background: 'linear-gradient(135deg,rgba(36,36,36,1) 0%,rgba(15,16,17,1) 100%)',
          color: mainColor,
          '& .MuiDialogTitle-root h2': {
            fontSize: 24,
            color: mainColor,
          },
          '& .MuiDialogContent-root': {
            color: mainColor,
          },
          '& .MuiDialogActions-root': {
            borderTop: '1px solid rgba(255,255,255,0.08)',
          },
        },
      };
    },
    button: {
      background:
        'linear-gradient(135deg,rgba(173,156,121,1) 0%,' +
        'rgba(157,143,109,1) 53%,rgba(144,132,98,1) 100%)',
      padding: '9px 46px',
      '&:hover': {
        background:
          'linear-gradient(135deg,rgba(173,156,121,1) 0%,' +
          'rgba(157,143,109,1) 53%,rgba(144,132,98,1) 100%)',
      },
    },
  };
});

function PublicNoticeDialog({ pathname, dispatch, noticeInfo, isLogin }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  let module = null;
  // [ { code: 'main', label: '首页' }, { code: 'market', label: '行情' }, { code: 'trade', label: '交易' }, { code: 'contract', label: '合约' }, { code: 'assets', label: '资产' }, ]
  // 首页模块
  if (['/'].some((i) => i === pathname)) {
    module = 'main';
  } else if (['/markets'].some((i) => i === pathname)) {
    // 行情
    module = 'market';
  } else if (['/assets'].some((i) => i === pathname)) {
    // 资产
    module = 'assets';
  }

  useEffect(() => {
    if (module && isLogin) dispatch({ type: 'publicNoticeDialog/getNotice', payload: { module } });
  }, [isLogin, module]);

  useEffect(() => {
    if (noticeInfo.id) {
      setOpen(true);
    }
  }, [noticeInfo, module]);

  useEffect(() => {
    if (open) {
      dispatch({ type: 'publicNoticeDialog/sendNoticeCallback', payload: { id: noticeInfo.id } });
    }
  }, [open]);

  const onOk = () => {
    ga('web_open_pop', { ad_pop_id: `${noticeInfo.id}`, ad_pop_module: module || '' });
    window.location.href = addLangToPath(noticeInfo.linkUrl);
  };

  const onCancel = () => {
    ga('web_close_pop', { ad_pop_id: `${noticeInfo.id}`, ad_pop_module: module || '' });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      okText={noticeInfo.linkUrl ? noticeInfo.linkText : ''}
      cancelText=""
      onOk={onOk}
      onCancel={onCancel}
      fullWidth={false}
      className={classes.dialog}
      okButtonProps={{
        size: 'medium',
        className: classes.button,
      }}
      title={noticeInfo.title || ''}
    >
      {noticeInfo.content}
    </Dialog>
  );
}

export default connect(({ publicNoticeDialog, user }) => {
  return {
    noticeInfo: publicNoticeDialog.noticeInfo,
    isLogin: user.isLogin,
  };
})(withRouter()(PublicNoticeDialog));
