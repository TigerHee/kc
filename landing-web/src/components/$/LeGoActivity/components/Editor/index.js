/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 运营活动模板-活动配置界面
 */
import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import Editor from '@react-page/editor';
import Decimal from 'decimal.js';
import moment from 'moment';
import { debounce, includes, isEmpty } from 'lodash';
import { useDispatch } from 'dva';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'hooks';
import { EditorContext } from '@lego-page/utils';
import { useLogin } from 'src/hooks';
import { useIsMobile } from 'src/components/Responsive';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import Toast from 'components/Toast';
import { _t, _tHTML, addLangToPath } from 'utils/lang';
import { getSignUpUrl, handleSignUp as _handleSignUp } from 'components/$/MarketCommon/config';
import CommonDialog from 'components/$/MarketCommon/CommonDialog';
import JsBridge from 'utils/jsBridge';
import keysEquality from 'utils/tools/keysEquality'
import { sensors } from 'utils/sensors';
import { pull, post } from 'utils/request';
import { kucoinStorage } from 'utils/storage';
import { getLocalBase, ALL_LANGS } from 'config';
import { formatNumber, separateNumber, numberFixed, searchToJson } from 'helper';
import EmptyDark from '../common/Empty';

import useUserInfo, { useNewCode } from '../../hook/useUserInfo';
import './style.less';
import siteCfg from 'src/utils/siteConfig';
import useTemplatePlugins from './useTemplatePlugins';
import loadable from '@loadable/component';
const NewPosterShare = loadable(() => import('../NewShare/index'));
const ShareModal = loadable(() => import('../Share/ShareModal'));

const LANGS = ALL_LANGS.map(item => ({
  lang: item.key,
  label: item.label,
}));

const __objs = {};

const _isInApp =  JsBridge.isApp();
/**
 * <RestrictNotice
      userInfo={user}
      pathname={pathname}
      currentLang={currentLang}
    />
 */

const LegoPlayGround = ({ preview = false }) => {
  const { pathname } = useLocation();
  const { currentLang, isInApp, supportCookieLogin, appVersion, ipRestrictCountry: _ipRestrictCountry } = useSelector(
    (state) => state.app,
    keysEquality([
      'currentLang',
      'isInApp',
      'supportCookieLogin',
      'appVersion',
      'ipRestrictCountry',
    ])
  );
  const currency = useSelector((state) => state.currency);
  const categories = useSelector((state) => state.categories);
  const _user = useSelector((state) => state.user?.user);
  const { isLogin, handleLogin, handleLogout } = useLogin();
  const isMobile = useIsMobile();
  const { config, supportLangs, standardLang } = useSelector((state) => state.legoActivityPage);
  const { content, templateCode, ..._activityConfig } = config || {};
  const dispatch = useDispatch();
  const shareRef = useRef(null);
  const goShare = useCallback(
    debounce(
      async (posterUrl, isShow, options) => {
        shareRef?.current?.goShare(posterUrl, isShow, options);
      },
      300,
      { leading: true, trailing: false },
    ),
    [],
  );
  
  // 语言fix
  const activityConfig = useMemo(() => {
    let {
      langs = [],
      standardLang,
      ...otherConfig
    } = _activityConfig || {};

    // 语言地区合规
    const ipRestrictCountry = window.ipRestrictCountry || _ipRestrictCountry;
    
    if (!ipRestrictCountry) return _activityConfig;
    if (ipRestrictCountry === standardLang) {
      standardLang = window._DEFAULT_LANG_;
    }
    if (langs.length) {
      const restrictIndex = langs?.findIndex(i => i === ipRestrictCountry);
      if (ipRestrictCountry && restrictIndex !== -1) {
        langs && (langs[restrictIndex] = window._DEFAULT_LANG_);
      }
      if (langs.includes(standardLang)) {
        langs = langs.filter(i => i !== standardLang);
      }
    }
    return {
      langs,
      standardLang,
      ...otherConfig,
    }
  }, [_activityConfig, _ipRestrictCountry]);
  
  // 获取模版插件
  const cellPlugins = useTemplatePlugins(templateCode);

  const user = useUserInfo({ user: _user, templateCode });
  const isUseNewCode = useNewCode(templateCode);
  // 是否使用新的share组件 目前只有涨跌幅模版使用新的分享
  const isNewShare = useMemo(() => ['prophet'].includes(templateCode), [templateCode]);
  // 新的分享
  const goNewShare = useCallback(
    debounce(
      async (data) => {
        shareRef?.current?.goShare();
      },
      300,
      { leading: true, trailing: false },
    ),
    [shareRef],
  );

  const languages = useMemo(() => {
    return LANGS.filter((item) => supportLangs.includes(item.lang));
  }, [supportLangs]);

  const currentActivityLang = useMemo(() => {
    if (includes(supportLangs, currentLang)) return currentLang;
    return standardLang;
  }, [currentLang, supportLangs, standardLang]);


  // 获取邀请码
  useEffect(() => {
    if (!isLogin || !templateCode) return;
    dispatch({
      type: 'legoActivityPage/getInviteCode',
      payload: {
        isUseNewCode,
      },
    });
  }, [dispatch, isLogin, isUseNewCode, templateCode]);

  // 语言统一
  useEffect(() => {
    if (preview) return;
    const langInStore = kucoinStorage.getItem('lang');
    const langInQuery = searchToJson()?.lang;
    const { isExist: langInPath } = getLocalBase();

    const userLang = (_user && _user.language) || langInStore || langInPath || langInQuery;
    const isLoad = !isEmpty(supportLangs) && (userLang || currentLang) 
    // landing当前语言不支持活动配置的所有语言，则更新landing语言为活动standardLang
    const isNotExist = !includes(supportLangs, userLang) || !includes(supportLangs, currentLang)
    if (isLoad) {
      const lang = isNotExist ? standardLang : userLang || currentLang;
      dispatch({
        type: 'app/selectLang',
        payload: {
          lang: lang !== currentLang ? lang : currentLang,
          donotChangeUser: true,
        },
      })
    }
  }, [currentLang, supportLangs, standardLang, dispatch, _user, preview]);

  // 获取当前顶飘是否展示的状态
  const isShowRestrictNotice = useSelector((s) => s['$header_header']?.isShowRestrictNotice, 'ignore');
  // 获取顶飘高度（做布局偏移可能需要）
  const restrictNoticeHeight = useSelector((s) => s['$header_header']?.restrictNoticeHeight, 'ignore');


  const [_sensors, update_Sensors] = useState(sensors);
  const [socket, updateSocket] = useState({});
  
  const [RestrictNotice, udpateNoticeComponent] = useState(null);

  useEffect(() => {
    const loadHeader = async () => {
      return new Promise((resolve, reject) => {
        // app不需要显示合规顶飘
        if (_isInApp) return;
        setTimeout(() => {
          System.import('@remote/header').then(res => {
            const _RestrictNotice = res?.RestrictNotice || null;
            if (_RestrictNotice) {
              udpateNoticeComponent(() => _RestrictNotice)
            }
          });
        }, 5000);
      });
    };

    const init = async () => {
      const sensorsRes = await import('@kc/sensors');
      const socketRes = await import('@kc/socket');
      loadHeader();

      const __sensors = sensorsRes?.default || sensorsRes;

      if (socketRes.getInstance) {
        const socket = socketRes.getInstance();
        updateSocket(socket);
      }
      update_Sensors({
        ...sensors,
        sa: __sensors,
        spm: __sensors.spm
      });
    }; 
    init();
  }, []);

  const values = {
    // 公共状态
    currency,
    categories,
    isAdmin: false,
    simpleI18n: false,
    isInApp,
    isMobile,
    appVersion,
    isLogin,
    siteCfg,
    // 登录、退出方法
    handleLogin,
    handleLogout,
    handleSignUp: (channelCode) => {
      _handleSignUp(isInApp, supportCookieLogin, getSignUpUrl(channelCode));
    },
    handleClickShare: isNewShare ? goNewShare : goShare,
    _t,
    _tHTML,
    addLangToPath,
    _dispatch: dispatch,
    activityConfig,
    JsBridge,
    sensors: _sensors,
    currentLang: currentActivityLang,
    pull,
    post,
    // 标准组件
    Toast,
    EmptyDark,
    // 工具方法
    formatNumber,
    separateNumber,
    numberFixed,
    Decimal,
    moment,
    __objs,
    user,
    socket,
    restrictNotice: {
      RestrictNotice: (props) => {
        if (!RestrictNotice) return null;
        return (
          <RestrictNotice {...props} />
        )
      },
      isShowRestrictNotice,
      restrictNoticeHeight,
      user: _user,
      pathname,
      currentLang
    }
  };

  return (
    <div className={'page'} data-inspector="Lego2.0Page">
      {isNewShare ? (
        <NewPosterShare ref={shareRef} />
      ) : (
        <ShareModal ref={shareRef} type="activity" />
      )}
      <EditorContext.Provider value={values}>
        <Editor
          insertEnabled={false}
          previewEnabled={false}
          layoutEnabled={false}
          resizeEnabled={false}
          readOnly
          lang={currentActivityLang}
          languages={languages}
          cellPlugins={cellPlugins}
          value={content || {}}
        />
      </EditorContext.Provider>
      <CommonDialog namespace="legoActivityPage" />
      <AppleDisclaim className={templateCode} />
    </div>
  );
};

export default LegoPlayGround;
