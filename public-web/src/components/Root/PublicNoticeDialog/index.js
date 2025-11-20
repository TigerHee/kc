/**
 * Owner: willen@kupotech.com
 */
import { Dialog } from '@kufox/mui';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { addLangToPath } from 'tools/i18n';
import { ga } from 'utils/ga';

function PublicNoticeDialog({ pathname, dispatch, noticeInfo, isLogin }) {
  const [open, setOpen] = useState(false);
  const [prevId, setPrevId] = useState('');

  // [ { code: 'main', label: '首页' }, { code: 'market', label: '行情' }, { code: 'trade', label: '交易' }, { code: 'contract', label: '合约' }, { code: 'assets', label: '资产' }, ]
  // 首页模块

  const module = useMemo(() => {
    if (['/'].some((i) => i === pathname)) {
      return 'main';
    } else if (['/markets'].some((i) => i === pathname)) {
      // 行情
      return 'market';
    } else if (['/assets'].some((i) => i === pathname)) {
      // 资产
      return 'assets';
    }

    return null;
  }, [pathname]);

  useEffect(() => {
    if (module && isLogin) dispatch({ type: 'publicNoticeDialog/getNotice', payload: { module } });
  }, [isLogin, dispatch, module]);

  useEffect(() => {
    if (noticeInfo.id) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [noticeInfo, module]);

  useEffect(() => {
    const { id = '' } = noticeInfo || {};
    if (open && id && id !== prevId) {
      setPrevId(id);
      dispatch({ type: 'publicNoticeDialog/sendNoticeCallback', payload: { id } });
    }
  }, [dispatch, noticeInfo, open, prevId]);

  const onOk = () => {
    ga('web_open_pop', { ad_pop_id: `${noticeInfo.id}`, ad_pop_module: module || '' });
    window.location.href = addLangToPath(noticeInfo.linkUrl);
  };

  const onCancel = () => {
    ga('web_close_pop', { ad_pop_id: `${noticeInfo.id}`, ad_pop_module: module || '' });
    setOpen(false);
  };

  return (
    open && (
      <Dialog
        open={open}
        okText={noticeInfo.linkUrl ? noticeInfo.linkText : ''}
        cancelText=""
        onOk={onOk}
        onCancel={onCancel}
        fullWidth={false}
        title={noticeInfo.title || ''}
      >
        {noticeInfo.content}
      </Dialog>
    )
  );
}

export default connect(({ publicNoticeDialog, user }) => {
  return {
    noticeInfo: publicNoticeDialog.noticeInfo,
    isLogin: user.isLogin,
  };
})(withRouter()(PublicNoticeDialog));
