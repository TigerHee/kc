/**
 * Owner: willen@kupotech.com
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeProvider } from '@kux/mui';
import storage from '@utils/storage';
import { useTranslation } from '@tools/i18n';
// import { setup as setupMKDesign } from '@kc/mk-design';
// import JsBridge from '@knb/native-bridge';
import pathToRegexp from 'path-to-regexp';
import useRealInteraction from '@hooks/useRealInteraction';
import {
  SUPPORT_CLEARANCE_DIALOG_ROUTE,
  SUPPORT_FORCE_KYC_DIALOG_ROUTE,
  SUPPORT_IP_DIALOG_ROUTE,
  SUPPORT_REGISTER_DIALOG_RESTRICT,
  SUPPORT_EXAMINE_DIALOG_ROUTE,
  ENGLAND_DIALOG_ROUTE,
  ROUTE_BIZ_SCENE,
  ACCOUNT_TRANSFER_DIALOG_ROUTE,
  ACCOUNT_TRANSFER_HOMEPAGE_DIALOG_ROUTE,
} from './config';
import Dialog from './components/Dialog';
import { queryEnglandDismiss, queryIpDismiss, queryUserCanTransfer } from './service';
import {
  ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG,
  ACCOUNT_TRANSFER_SPECIAL_DIALOG,
  BIZ_PAGE,
  FRONT_PAGE,
} from './constants';
import { formatAccountTransferResult } from './helper';
import { getAccountTransferBizKey } from './utils';

const CommonDialog = ({
  pathname,
  userInfo,
  theme,
  currentLang,
  onShow,
  onHide,
  userRestrictedStayDuration = 5000,
}) => {
  const [requestBizType, setRequestBizType] = useState('');
  const [dialogInfo, setDialogInfo] = useState({});
  const i18nKey = 'userRestricted';
  // todo: 需关注上下文
  const tranData = useTranslation(i18nKey);
  const { t: _t } = tranData;
  const realInteraction = useRealInteraction({ stayDuration: userRestrictedStayDuration });

  // 当前路由对应的业务code
  const currentPathScene = useMemo(() => {
    let scene;
    // 尝试获取当前路由对应的业务code，取不到则不传
    Object.keys(ROUTE_BIZ_SCENE).forEach((key) => {
      const selectPath = ROUTE_BIZ_SCENE[key];
      const paths = typeof selectPath === 'string' ? [selectPath] : selectPath;
      if (paths.some((pattern) => pathToRegexp(pattern).test(pathname))) {
        scene = key;
      }
    });
    return scene;
  }, [pathname]);

  const generateBizType = useCallback(() => {
    //  TIPS: 特殊逻辑：注册成功后跳转到/account页时有引导弹窗，不请求清退弹窗
    if (
      storage.getItem('kucoinv2_showRegisterBeginnerGuide') &&
      pathToRegexp('/account').test(pathname)
    ) {
      setRequestBizType('');
      return;
    }
    const bizTypeArr = [];
    // 英国地区特殊弹窗
    if (ENGLAND_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname))) {
      bizTypeArr.push('ENGLAND_SPECIAL_DIALOG');
    }

    // 用户迁移首页特殊弹窗, 同一次登录中不重复提示
    if (
      userInfo &&
      ACCOUNT_TRANSFER_HOMEPAGE_DIALOG_ROUTE.some((pattern) =>
        pathToRegexp(pattern).test(pathname),
      ) &&
      +userInfo.lastLoginAt !== +storage.getItem(ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG)
    ) {
      bizTypeArr.push(ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG);
    }

    // 用户迁移业务页的特殊弹窗, 同一次登录中不重复提示
    if (
      userInfo &&
      ACCOUNT_TRANSFER_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname)) &&
      +userInfo.lastLoginAt !== +storage.getItem(ACCOUNT_TRANSFER_SPECIAL_DIALOG)
    ) {
      bizTypeArr.push(ACCOUNT_TRANSFER_SPECIAL_DIALOG);
    }
    // 新增封禁弹窗（仅游客能看）
    if (
      SUPPORT_REGISTER_DIALOG_RESTRICT.some((pattern) => pathToRegexp(pattern).test(pathname)) &&
      !userInfo
    ) {
      bizTypeArr.push('REGISTER');
    }
    // IP封禁弹窗（全用户可看）
    if (SUPPORT_IP_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname))) {
      bizTypeArr.push('IP_DIALOG');
    }
    // 强制KYC弹窗（仅登录后能看，一次登录只能查看一次）
    if (
      SUPPORT_FORCE_KYC_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname)) &&
      userInfo &&
      +userInfo.lastLoginAt !== +storage.getItem(`GBIZ_FORCE_KYC_DIALOG_CLOSE_TIME`)
    ) {
      bizTypeArr.push('FORCE_KYC_DIALOG');
    }
    // 自动化清退弹窗（仅登录后能看，一次登录只能查看一次）
    if (
      SUPPORT_CLEARANCE_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname)) &&
      userInfo &&
      +userInfo.lastLoginAt !== +storage.getItem(`GBIZ_CLEARANCE_DIALOG_CLOSE_TIME`)
    ) {
      bizTypeArr.push('CLEARANCE_DIALOG');
    }
    // 信息审查弹窗（仅登录后能看，一次登录只能查看一次）
    if (
      SUPPORT_EXAMINE_DIALOG_ROUTE.some((pattern) => pathToRegexp(pattern).test(pathname)) &&
      userInfo &&
      +userInfo.lastLoginAt !== +storage.getItem(`GBIZ_EXAMINE_DIALOG_CLOSE_TIME`)
    ) {
      bizTypeArr.push('EXAMINE_DIALOG');
    }
    setRequestBizType(bizTypeArr.join(','));
  }, [userInfo, pathname]);

  useEffect(() => {
    // ssg状态下不请求弹窗
    if (navigator.userAgent.indexOf('SSG_ENV') === -1) generateBizType();
  }, [generateBizType]);

  useEffect(() => {
    if (requestBizType) {
      // 未发生真实交互，不请求弹窗
      if (!realInteraction.pass) return;
      (async () => {
        let result = {};
        // 特殊逻辑：优先获取英国地区弹窗
        if (requestBizType.indexOf('ENGLAND_SPECIAL_DIALOG') >= 0) {
          try {
            result = (await queryEnglandDismiss({ bizType: 'ENGLAND_SPECIAL_DIALOG' })) || {};
          } catch (e) {
            console.log(e);
          }
        }

        // 特殊逻辑：用户迁移
        if (
          (!result.data || !Object.keys(result.data).length) &&
          (requestBizType.indexOf(ACCOUNT_TRANSFER_SPECIAL_DIALOG) >= 0 ||
            requestBizType.indexOf(ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG) >= 0)
        ) {
          try {
            const key = getAccountTransferBizKey(pathname);
            const entrySource =
              key === ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG ? FRONT_PAGE : BIZ_PAGE;
            // 在检测路由下，当每次登录后都会触发检查判断是否弹窗
            const { data } = (await queryUserCanTransfer({ entrySource })) || {};
            result = formatAccountTransferResult(data, _t, pathname);
          } catch (e) {
            console.log(e);
          }
        }

        // 常规逻辑：取不到英国地区弹窗再走正常优先级判定
        if (!result.data || !Object.keys(result.data).length) {
          try {
            result =
              (await queryIpDismiss({
                bizType: requestBizType
                  .split(',')
                  .filter(
                    (i) =>
                      ![
                        ACCOUNT_TRANSFER_SPECIAL_DIALOG,
                        ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG,
                        'ENGLAND_SPECIAL_DIALOG',
                      ].includes(i),
                  )
                  .join(','),
                scene: currentPathScene,
              })) || {};
          } catch (e) {
            console.log(e);
          }
        }
        if (result.data && Object.keys(result.data).length) {
          const obj = {};
          Object.keys(result.data).forEach((key) => {
            if (result.data[key]?.dismiss) {
              const lastShowTimestamp = storage.getItem(`GBIZ_DIALOG_SHOW_TIMESTAMP_${key}`) || 0;
              const durationTime = result.data[key]?.notice?.durationTime || 0;
              const now = Date.now();
              obj[key] = { ...result.data[key], visible: now - +durationTime > +lastShowTimestamp };
            }
          });
          setDialogInfo(obj);
        }
      })();
    }
  }, [requestBizType, currentPathScene, realInteraction.pass]);

  if (!requestBizType) {
    return null;
  }

  return (
    <ThemeProvider theme={theme || 'light'}>
      {Object.keys(dialogInfo).map((key) => {
        if (dialogInfo[key]?.visible) onShow && onShow(dialogInfo[key]);
        return (
          <Dialog
            key={key}
            passType={realInteraction.passType}
            notice={dialogInfo[key]?.notice}
            bizType={dialogInfo[key]?.bizType}
            visible={dialogInfo[key]?.visible}
            currentLang={currentLang}
            userInfo={userInfo}
            onClose={() => {
              setDialogInfo((i) => {
                const afterVal = { ...i, [key]: { ...dialogInfo[key], visible: false } };
                onHide && onHide(afterVal[key]);
                return afterVal;
              });
            }}
          />
        );
      })}
    </ThemeProvider>
  );
};

export default CommonDialog;
