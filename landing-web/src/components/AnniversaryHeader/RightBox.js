/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import PropTypes from 'prop-types';
import { debounce, isNil } from 'lodash';
import { sensors } from 'utils/sensors';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { Button, Avatar } from '@kufox/mui';
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import LangSelector from 'components/Header/LangSelector';
import styles from './style.less';

const RightBox = ({
  customRightOpt,
  showCheckedImg,
  checkedImgUrl,
  showAvatar,
  noUserInfo,
  blockId,
  sensorData,
  darkLang,
}) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { isInApp, supportCookieLogin } = useSelector(state => state.app);
  const { showName = '' } = useSelector(state => state.kcCommon);
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const appLoginParams = rcode ? `?rcode=${rcode}` : '';
  const handleLogin = useCallback(
    () => {
      // 在App里面，同时支持注入Cookie登录
      if (isInApp && supportCookieLogin) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/user/login${appLoginParams}`,
          },
        });
        return;
      }
      dispatch({
        type: 'user/update',
        payload: {
          showLoginDrawer: true,
        },
      });
    },
    [isInApp, supportCookieLogin, appLoginParams, dispatch],
  );
  //拉起登录弹窗
  const onClickLogin = useCallback(
    debounce(
      () => {
        if (!isLogin) {
          // 埋点
          !isNil(blockId) && sensors.trackClick([blockId, '1'], { ...(sensorData || {}) });
          // 拉起登陆的埋点
          handleLogin();
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [],
  );
  //已经登陆的话，则渲染昵称，如果没有登陆，则展示注册按钮
  const renderRightContent = useMemo(
    () => {
      if (isNil(isLogin)) {
        return '';
      }
      // noUserInfo = true， 无论是否登录，都不显示用户信息、登录按钮
      if (noUserInfo) return null;
      if (isLogin) {
        return showAvatar ? (
          <div className={styles.avatar}>
            <Avatar size="middle">{showName}</Avatar>
          </div>
        ) : (
          <div className={styles.nickBox}>{`Hi,${showName}`}</div>
        );
      }
      return (
        <Button type="primary" onClick={onClickLogin} className={styles.btnBox}>
          {_t('apiKing.logIn')}
        </Button>
      );
    },
    [isLogin, onClickLogin, showName, showAvatar, noUserInfo],
  );

  return (
    <section className={styles.rightBox}>
      <Fragment>{renderRightContent}</Fragment>
      <LangSelector
        showCheckedImg={showCheckedImg}
        checkedImgUrl={checkedImgUrl}
        className={!darkLang ? 'land-lang-selector' : 'land-lang-selector-dark'}
      />
      <Fragment>{customRightOpt}</Fragment>
    </section>
  );
};

RightBox.propTypes = {
  showCheckedImg: PropTypes.bool, // 是否展示选中语言展示的图片
  checkedImgUrl: PropTypes.string, // 选中语言展示的图片
  customRightOpt: PropTypes.any, // 自定义操作
  showAvatar: PropTypes.bool, // 是否展示头像框
  blockId: PropTypes.string, // 埋点的blockId
  sensorData: PropTypes.object, // 埋点的额外传递数据
};

RightBox.defaultProps = {
  showCheckedImg: false,
  checkedImgUrl: '',
  customRightOpt: undefined,
  showAvatar: true,
  blockId: null,
  sensorData: {},
};

export default RightBox;
