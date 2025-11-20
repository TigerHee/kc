/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 业务组件，动态海报分享
 */
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'dva';
import QRCode from 'qrcode.react';
import { SHARE_APP_HOST } from 'config';
import { useIsMobile } from 'components/Responsive';
import Toast from 'components/Toast';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST as LANDING_HOST_CONFIG } from 'utils/siteConfig';
import { addLangToPath, _t, _tHTML } from 'utils/lang';
import { create } from 'utils/createImg';
import saveAs from 'utils/saveAs';
import { getIsAndroid, isIOS } from 'helper';
import preloadImg from 'utils/preloadImg';
import ShareModel from '../ShareModel';
import {
  MAXLENGTH_LANGS,
  LONG_TITLE_LANGS,
  getWebHost,
  isHttps,
} from './config';

// 固定写死的分享host
const LANDING_HOST_STATIC = `${SHARE_APP_HOST}/land`;

let _timer = null;
let imgMemoMap = {}; // 图片缓存
let nowId = ''; // 当前处理的奖品id
const preLoadId = 'poster_share_preload'; // 预加载图片，元素ID
const defaultBgId = 'activety_post_share'; // 默认的分享二维码元素ID
const logoId = 'activity_logo_template_logo_id';

const logoSrc = 'https://assets.staticimg.com/cms/media/8yFNNobvL263YuWQjsFyIJwzA2WIFpT4y2ij2CxOf.png';
// 是否允许只下载图片
const isAllowOnlyPoster = false;

/**
 * 大多数场景下，参数传递样例：
 * poster: {en_US: 'xxx', zh_CN: 'xxx'}, xxx为图片资源cdn链接
 * link: `/LearnToEarn?rcode=${inviteCode}`
 * title: '活动主标题'
 * subTitle: '活动副标题'
 * @param {*} props 
 * @param {*} ref 
 * @returns 
 */
const PosterShare = (props, ref) => {
  const {
    poster = {}, // 分享海报底图{en_US: 'xxx', zh_CN: 'xxx'}, value为图片资源cdn链接，必传
    posterUrl = '', // 单个分享海报底图,
    posterConfig, // 海报分享相关配置，文案、二维码等错位或者需要调整这些元素位置时，才需要传
    link = '', // 分享链接 比如 `/LearnToEarn?rcode=${inviteCode}` ，必传
    title, // 分享主标题，必传
    subTitle, // 分享副标题， 必传
    btnClickCheck = undefined, // 点击按钮前置检查
    setShareLoading = () => {}, // 点击分享的loading管理
    type = 'activity', // 默认是活动分享海报，可以不传
    socialTitle, // 自定义跳转社群，链接Title，默认是分享主标题，需要不拉起分享弹窗，就能跳转社群时，自定义跳转社群的text参数
  } = props || {};

  const {
    defaultLang = window._DEFAULT_LANG_, // 对应语言取不到图片，使用默认语种图片, 非必传
    posterBgId = defaultBgId, // 分享图，元素ID，默认会自动生成，非必传
    withStatic = true, // 是否写死landingHost .com域名，否则使用siteConfig对应landingHost
    fixLabel, // 文字排版fix处理
    customConfig = {}, // 自定义分享海报排版，自定义元素等
  } = posterConfig || {};

  const { isInApp, currentLang, appInfo } = useSelector(state => state.app);
  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const imgBack = useRef(''); // 海报背景图
  const logoImg = useRef(); // logo 背景图
  const _shareModel = useRef(null); // 分享组件实例
  const [options, updateOptions] = useState({});


  const onlyDownloadChanel = useRef('');
  
  const isMobile = useIsMobile();

  /* 社群跳转链接-标题 */
  const shareTitle = useMemo(() => {
    return encodeURIComponent(title);
  }, [title]);

  // 分享给好友的链接
  const shareLink = useMemo(() => {
    // 如果指定http开头，则直接使用
    const isStatic = isHttps(link);
    if (isStatic) return link;
    // 进行host拼接
    let host = '';
    const { webHost } = appInfo;
    if (isInApp && webHost) {
      // 通过App获取host
      host = `${getWebHost(webHost)}/land`;
    } else {
      host = withStatic ? LANDING_HOST_STATIC : LANDING_HOST_CONFIG;
    }
    return addLangToPath(`${host}${link}`);
  }, [appInfo, isInApp, link, withStatic]);

  const isActiveOnlyPoster = useMemo(() => {
    if (!isAllowOnlyPoster) return;
    if (isIOS()) return true;
    if (getIsAndroid()) return false;
  }, []);

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = useCallback(
    (path, isUseImg = true) => {
      if (!path) {
        return;
      }

      if ((!isInApp && !isUseImg) || !!onlyDownloadChanel.current) {
        setShareShow(true);
        return;
      }
      if (isInApp) {
        // 直接调起app分享
        JsBridge.open({
          type: 'func',
          params: {
            name: 'share',
            category: 'img',
            pic: path,
          },
        });
      } else {
        // 下载
        saveAs(path, `poster_${Date.now()}`);
        return;
      }
    },
    [isInApp, onlyDownloadChanel.current],
  );

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = useCallback(
    (isUseImg = true) => {
      if (imgMemoMap[nowId]) {
        goUseImage(imgMemoMap[nowId], isUseImg);
      } else {
        let {
          positionY_top = 583 + 10,
          positionY_bottom = 605 + 8,
          firstWidth = 223,
          titleX = 70,
        } = fixLabel ? fixLabel({ currentLang }) || {} : {};

        if (!fixLabel) {
          // 默认的多语言图片适配
          if (MAXLENGTH_LANGS.indexOf(currentLang) > -1) {
            positionY_top = 612;
            positionY_bottom = 629;
            firstWidth = 220;
          }
          if (LONG_TITLE_LANGS.indexOf(currentLang) > -1) {
            positionY_top = 617;
            positionY_bottom = 635;
          }
        }

        setShareLoading(true);
        // 保证state更新，动画出现
        setTimeout(async () => {
          let texts = [
            /* 分享主标题配置 */
            {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '400',
              text: title,
              x: titleX,
              y: positionY_top,
              lineHeight: 23,
              lineSpace: 0,
              needCompute: true,
              firstWidth,
              maxWidth: firstWidth,
              newLine: true,
              wordSpace: 2,
              ...(customConfig?.title || {}),
            },
            /* 分享副标题配置 */
            {
              color: '#b8c6d8',
              fontSize: 12,
              fontWeight: '400',
              text: subTitle,
              x: titleX,
              y: positionY_bottom,
              lineHeight: 15,
              lineSpace: 0,
              needCompute: true,
              newLine: true,
              firstWidth,
              maxWidth: firstWidth,
              wordSpace: 2,
              ...(customConfig?.subTitle || {}),
            },
          ];
          // 创建
          create({
            height: 642,
            isZh: false,
            hidePre: !!isInApp,
            quality: 0.95,
            format: 'jpeg',
            bg: imgBack.current || null,
            texts: [
              ...texts,
              ...(customConfig?.texts || []),
            ],
            shapes: [
              {
                color: '#1A1E29',
                x: 0,
                y: 561,
                width: 375,
                height: 81,
              },
              {
                color: '#fff',
                x: 313,
                y: 574,
                width: 50,
                height: 50,
              },
              ...(customConfig?.shapes || []),
            ],
            imgsCommon: [
              {
                img: document.getElementById(posterBgId),
                x: 316,
                y: 577,
                width: 44,
                height: 44,
              },
              ...(customConfig?.imgsCommon || []),
              ...(logoImg.current ? [{
                img: logoImg.current,
                x: 12,
                y: 583,
                width: 38,
                height: 38,
              }] : []),
            ],
            maxWidth: 300,
            ...(customConfig?.createConfig || {}),
          })
            .then(res => {
              setShareLoading(false);
              imgMemoMap[nowId] = res;
              goUseImage(res, isUseImg);
            })
            .catch(err => {
              console.error(err);
              setShareLoading(false);
            });
        }, 100);
      }
    },
    [goUseImage, currentLang, setShareLoading, type, posterBgId,
      title, subTitle, customConfig, isInApp, fixLabel, options],
  );
  
  // 分享海报底图
  const bg = (poster && poster[currentLang]) || posterUrl;

  const shareHandle = useCallback(
    async () => {
      const checked = typeof btnClickCheck === 'function' ? await btnClickCheck() : true;
      if (!checked) {
        return;
      }
      // 创建动态海报进行分享，创建前确保背景图片已经加载完成
      if (imgBack.current) {
        createImg(isInApp);
      } else {
        setShareLoading(true);
        // 监听imgBack.current是否有值，最多等待20秒
        let time = 0;
        clearInterval(_timer);
        _timer = setInterval(() => {
          time += 500;
          if (imgBack.current || time > 20000) {
            setShareLoading(false);
            clearInterval(_timer);
            _timer = null;
            if (time > 20000) {
              const msg = 'poster share build failed, please try again ';
              Toast({ msg, type: 'warning' });
              console.error(msg, bg);
            } else {
              createImg(isInApp);
            }
          }
        }, 500);
      }
    },
    [btnClickCheck, createImg, isInApp, setShareLoading, bg],
  );

  useEffect(() => {
    return () => {
      clearInterval(_timer);
      _timer = null;
    };
  }, []);


  useEffect(
    () => {
      let func = res => {
        imgBack.current = res;
      };
      
      // 预加载海报图
      if (bg) {
        imgBack.current = '';
        imgMemoMap = {};
        preloadImg(bg, preLoadId)
          .then(res => {
            func(res);
          })
          .catch(err => {
            console.error(err);
          });
        // 预加载logo
        preloadImg(logoSrc, logoId).then(res => {
          logoImg.current = res;
        });
      }

      return () => {
        func = () => {};
      };
    },
    [bg],
  );

  useImperativeHandle(ref, () => ({
    goShare: (options) => {
      onlyDownloadChanel.current = '';
      shareHandle();
      updateOptions(options)
    },
    // 打开下载分享海报弹窗，弹窗里面可以跳转社群链接
    clickSocial: (chanel) => {
      if (isActiveOnlyPoster) {
        onlyDownloadChanel.current = chanel;
        shareHandle();
        return;
      }
      if (_shareModel.current) _shareModel.current.openSocial(chanel);
    },
    visible: shareShow,
  }));

  // 分享海报的二维码
  const QRCodeView = useMemo(
    () => {
      return (
        <>
          <QRCode
            size={50}
            value={shareLink}
            id={posterBgId}
            style={{ position: 'absolute', visibility: 'hidden', zIndex: -1 }}
          />
        </>
      );
    },
    [shareLink, posterBgId],
  );

  /* if (isInApp) {
    return QRCodeView;
  } */

  return (
    <React.Fragment>
      <ShareModel
        ref={_shareModel}
        isInApp={isInApp}
        open={shareShow}
        onlyDownloadChanel={onlyDownloadChanel.current}
        onCancel={() => {
          setShareShow(false);
          onlyDownloadChanel.current = '';
        }}
        isZh={false}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        socialTitle={socialTitle}
        createImg={createImg}
        poster={imgMemoMap[nowId]}
        options={options}
      />
      {QRCodeView}
    </React.Fragment>
  );
};

export default forwardRef(PosterShare);
