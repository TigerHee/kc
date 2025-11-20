/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// import { Dialog as KufoxDialog } from '@kufox/mui';
import { useLocale } from '@kucoin-base/i18n';
import NoSSGModal from 'components/NoSSGModal';
import { includes, map, startsWith } from 'lodash';
import { connect } from 'react-redux';
import { addLangToPath } from 'tools/i18n';
import { push } from 'utils/router';
import storage from 'utils/storage';
import {
  CANCELATION_NOTICE_INIT_KEY,
  CHINESE_NOTICE_NEXT,
  CHINESE_NOTICE_TIME,
  newsLinkTxt,
  noticeTitle,
  readedBtnTxt,
  restrictedStatusList,
} from './config';
import style from './index.less';

const simpleJump = (url) => {
  if (startsWith(url, 'http')) {
    window.location.href = addLangToPath(url);
  } else {
    push(url);
  }
};

const ChineseNoticeDialog = (props) => {
  const { languageContent, languageContentRate } = props || {};
  const [open, setOpen] = useState(true);
  const nowTime = Date.now();

  const onCancel = useCallback(() => {
    setOpen(false);
    storage.setItem(CHINESE_NOTICE_TIME, nowTime);
    storage.setItem(CHINESE_NOTICE_NEXT, nowTime + languageContentRate * 3600 * 1000);
  }, [languageContentRate, nowTime]);

  if (!languageContent || !languageContentRate) {
    return null;
  }

  const preTime = storage.getItem(CHINESE_NOTICE_TIME) || 0; // 上次展示的时间
  if (nowTime - preTime < languageContentRate * 3600 * 1000) {
    // 频率时间内不再次展示
    return null;
  }

  // 展示弹窗
  return (
    <NoSSGModal
      size="middle"
      open={open}
      okText=""
      cancelText=""
      onOk={onCancel}
      onCancel={onCancel}
      fullWidth={false}
      title=""
      header={null}
      showCloseX={false}
      okButtonProps={{
        variant: 'outlined',
      }}
      cancelButtonProps={{
        variant: 'contained',
      }}
      wrapClassName={style.dialogWrapper}
      footer={null}
    >
      <div className={style.dialogTitle}>{noticeTitle}</div>
      <div className={style.dialogContent}>{languageContent}</div>
      <div className={style.dialogBtnWrapper}>
        <div className={style.dialogBtn} onClick={onCancel}>
          {readedBtnTxt}
        </div>
      </div>
    </NoSSGModal>
  );
};

let alreadyShow = false;
function UserRestrictedDialog({ dispatch, restrictedUserNotice, isLogin }) {
  const {
    status,
    content,
    detailLink,
    buttonInfo,
    buttonLink,
    languageContent,
    languageContentRate,
  } = restrictedUserNotice || {};
  const { isCN } = useLocale();

  let noticeInit = storage.getItem(CANCELATION_NOTICE_INIT_KEY);
  if (noticeInit === null) {
    noticeInit = true;
  }
  const [open, _setOpen] = useState(noticeInit);

  const setOpen = useCallback(
    (show) => {
      _setOpen(show);
      storage.setItem(CANCELATION_NOTICE_INIT_KEY, show);
    },
    [_setOpen],
  );

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const isShowDialog = useMemo(() => {
    if (!restrictedUserNotice) return false;
    return open && includes(restrictedStatusList, status) && !!content;
  }, [content, open, restrictedUserNotice, status]);

  useEffect(() => {
    // 是否可请求接口，1、登录态  2、非登录态，是中文且过了频率限制时间
    const nextTime = storage.getItem(CHINESE_NOTICE_NEXT) || 0; // 下次可进行中文提示的时间
    if (isLogin || (isLogin === false && isCN && nextTime < Date.now())) {
      dispatch({
        type: 'user/getUserRestrictedStatus',
        // onlyStatus: false,
        payload: {
          plt: 'kucoin_web',
        },
      });
    }
  }, [dispatch, isCN, isLogin]);

  const onCancel = (_, reason) => {
    if (reason === 'backdropClick') return;
    close();
    if (buttonLink) {
      simpleJump(buttonLink);
    }
  };

  useEffect(() => {
    if (isShowDialog) {
      alreadyShow = true;
    }
  }, [isShowDialog]);

  if (!restrictedUserNotice) return null;

  if (!isShowDialog && languageContent && isCN && !alreadyShow) {
    // 不展示清退、且存在语言提示内容、且当前是简体中文 的时候，去判断展示语言提示
    return (
      <ChineseNoticeDialog
        languageContent={languageContent}
        languageContentRate={languageContentRate}
      />
    );
  }

  return (
    <NoSSGModal
      header={null}
      open={isShowDialog}
      okText={readedBtnTxt}
      cancelText={buttonInfo || 'cancel'}
      onOk={close}
      onCancel={onCancel}
      title={noticeTitle}
      showCloseX={false}
      okButtonProps={{
        variant: 'outlined',
      }}
      cancelButtonProps={{
        variant: 'contained',
      }}
    >
      <React.Fragment>
        {map(content, (notice, noticeIndex) => {
          return <p key={noticeIndex}>{notice}</p>;
        })}
        {detailLink && (
          <div>
            <a href={addLangToPath(detailLink)}>{newsLinkTxt}</a>
          </div>
        )}
      </React.Fragment>
    </NoSSGModal>
  );
}

export default connect(({ user }) => {
  const { restrictedUserNotice, isLogin } = user || {};
  return {
    restrictedUserNotice,
    isLogin,
  };
})(UserRestrictedDialog);
