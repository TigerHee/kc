/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 业务组件，动态海报分享
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'hooks';
import QRCode from 'qrcode.react';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import loadable from '@loadable/component';
import { create } from 'utils/createImg';
import saveAs from 'utils/saveAs';
import preloadImg from 'utils/preloadImg';
import JsBridge from 'utils/jsBridge';
import { compareVersion, isIOS } from 'helper';
import ShareModel from './ShareModel';

const GbizShareModuleLoadable = loadable.lib(() => System.import('@remote/share'));

let _timer = null;
const posterBgId = 'posterBg';
let imgMemoMap = {}; // 图片缓存
let nowId = ''; // 当前处理的奖品id
const logoId = 'activity_logo_template_logo_id';
const logoSrc =
  'https://assets.staticimg.com/cms/media/8yFNNobvL263YuWQjsFyIJwzA2WIFpT4y2ij2CxOf.png';

// App 分享组件Api 文档 https://k-devdoc.atlassian.net/wiki/spaces/APP/pages/50940424
const _PosterShare = (props, ref) => {
  // v3 统一逻辑
  const shareV3 = props.GbizShareModule?.useShareV3?.();
  // v3 分享弹窗引用g-biz的组件，该页面只提供入口数据
  // ./ShareModel组件兜底
  const ShareModels = props.GbizShareModule?.ShareModelCard || <ShareModel />;

  const {
    btnClickCheck = undefined, // 点击按钮前置检查
    setShareLoading = () => {}, // 点击分享的loading管理
    shareLink: originShareLink = '', // 分享给好友的链接
    shareTexts: originShareTexts = [], // 背景图上的文案
    shareTitle = '', // 分享给好友的文案
    shareImg = undefined, // 背景图
    shareType = 'default', // app分享海报类型：默认default / 多海报画廊gallery
    needInit = false, // 分享时是否重新绘制分享图，默认false
    onShareCallback = () => {}, // 分享时的回调，可以在这里面埋点
    onVisibleChange,
    roundBorder = false,
    customFooterElement = false, // 分享底图底部的黑底，左下角kc logo是否自动带上
    rootProps = {}, // 分享弹窗rootProps
    darkMode = false,
    needQrCode = false, // 是否显示底部带二维码的footer 默认false
    utmSource,
    // 是否让客户端绘制底部 qrcode 信息，默认 false
    // 当为 true 时，app 里的分享海报会自动切掉底部 240px 的高度，让 app 去绘制底部
    // 否则 app 底部不会有 copy link 按钮
    useAppRender = false,
    onlyUseWebShare = false, // 只使用web的分享 不使用App的原生分享
    ...restProps
  } = props || {};
  const shareLink = shareV3?.updateToShareV3UniversalRcode
    ? shareV3?.updateToShareV3UniversalRcode?.(originShareLink) || originShareLink
    : originShareLink;

  const ads = shareV3?.ads;
  const { message } = useSnackbar();
  const { isInApp, appVersion, currentLang } = useSelector((state) => state.app, );

  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const imgBack = useRef(null); // 海报背景图
  const logoImg = useRef(); // logo 背景图
  // app支持多海报分享
  const supportGallery = compareVersion(appVersion, '3.45.0') >= 0;
  // 支持新版分享组件
  const useNewShareVersion = useAppRender && isInApp && compareVersion(appVersion, '3.89.0') >= 0;
  // 最新的分享邀请码
  const rcode = shareV3?.shareData?.referralCode;

  const isUseAppShare = isInApp && !onlyUseWebShare; // 使用App分享


  // 分享海报
  const sharePoster = useCallback(
    (imgPath) => {
      // app多海报画廊
      if (supportGallery && shareType === 'gallery') {
        JsBridge.open({
          type: 'func',
          params: {
            name: 'share',
            category: 'gallery',
            data: JSON.stringify({
              galleryType: 'CUSTOMER_INVITE',
              galleryLink: shareLink,
              needQrCode: true,
            }),
          },
        });
        return;
      }
      const isInIos = isIOS();
      // app默认分享
      JsBridge.open({
        type: 'func',
        params: {
          name: 'share',
          category: 'img',
          pic: imgPath,
          rcode,
          needQrCode,
          qrCodeUrl: shareLink, // footer二维码链接 默认注册链接 只有当needQrCode 是true 的时候才会生效
          utmSource,
          // FIXME: 新版分享组件在 安卓 和 ios 实现不一样，所以我们要交给客户端绘制底部。
          ...(!isInIos && useNewShareVersion
            ? {
                needQrCode: true,
              }
            : {}),
        },
      });
    },
    [supportGallery, shareType, shareLink, needQrCode, rcode, utmSource, useNewShareVersion],
  );

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = useCallback(
    (path, isUseImg = true, appClickSaveAsImg) => {
      const isUseWebShare = (isInApp && onlyUseWebShare) || (!isInApp && !isUseImg); // 使用web分享

      if (!path) {
        return;
      }
      if (typeof appClickSaveAsImg === 'function') {
        appClickSaveAsImg(path);
        return;
      }
      if (isUseWebShare) {
        setShareShow(true);
        if (typeof onVisibleChange === 'function') onVisibleChange(true);
        return;
      }
      if (isUseAppShare) {
        // 直接调起app分享
        sharePoster(path);
      } else {
        // 下载
        saveAs(path, `poster_${Date.now()}`);
      }
    },
    [isInApp, sharePoster, onVisibleChange, isUseAppShare, onlyUseWebShare],
  );

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = useCallback(
    (isUseImg = true, appClickSaveAsImg) => {
      const shareTexts = shareV3?.updateToShareV3UniversalTexts
        ? shareV3?.updateToShareV3UniversalTexts?.(originShareTexts) || originShareTexts
        : originShareTexts;
      if (imgMemoMap[nowId] && !needInit) {
        goUseImage(imgMemoMap[nowId], isUseImg, appClickSaveAsImg);
      } else {
        setShareLoading(true);
        const splitByZeroString = currentLang !== 'en_US';
        // 保证state更新，动画出现
        setTimeout(async () => {
          // 创建
          create({
            isZh: splitByZeroString,
            hidePre: !!isUseAppShare,
            quality: 0.95,
            format: 'jpeg',
            bg: imgBack.current || null,
            texts: [...shareTexts],
            shapes: [
              ...(customFooterElement
                ? [
                    {
                      color: '#2D2D2F', // 2024 12.17 新的海报规范要改底部框框的颜色为#2D2D2F
                      x: 0,
                      y: 583,
                      width: 375,
                      height: 84,
                    },
                  ]
                : []),
              {
                color: '#fff',
                x: customFooterElement ? 309 : 293,
                y: customFooterElement ? 600 : 590,
                width: customFooterElement ? 52 : 70,
                height: customFooterElement ? 52 : 70,
              },
            ],
            imgsCommon: [
              {
                img: document.getElementById('newShare-QRCode-url'),
                x: customFooterElement ? 311 : 295,
                y: customFooterElement ? 602 : 592,
                width: customFooterElement ? 48 : 66,
                height: customFooterElement ? 48 : 66,
              },
              ...(customFooterElement && logoImg.current
                ? [
                    {
                      img: logoImg.current,
                      x: 12,
                      y: 606,
                      width: 38,
                      height: 38,
                    },
                  ]
                : []),
            ],
            maxWidth: 300,
            ...restProps,
          })
            .then((res) => {
              setShareLoading(false);
              imgMemoMap[nowId] = res;
              goUseImage(res, isUseImg, appClickSaveAsImg);
            })
            .catch((err) => {
              console.error(err);
              setShareLoading(false);
            });
        }, 100);
      }
    },
    [
      goUseImage,
      setShareLoading,
      isInApp,
      originShareTexts,
      needInit,
      customFooterElement,
      restProps,
      isUseAppShare,
      shareV3,
      currentLang,

    ],
  );

  const shareHandle = useCallback(async () => {
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
      _timer = setInterval(() => {
        time += 500;
        if (imgBack.current || time > 20000) {
          setShareLoading(false);
          clearInterval(_timer);
          _timer = null;
          if (time > 20000) {
            message.warning('build failed, please try again');
          } else {
            createImg(isInApp);
          }
        }
      }, 500);
    }
  }, [btnClickCheck, createImg, isInApp, message, setShareLoading]);

  useEffect(() => {
    return () => {
      clearInterval(_timer);
      _timer = null;
    };
  }, []);

  useEffect(() => {
    let func = (res) => {
      imgBack.current = res;
    };

    // 预加载海报图
    if (shareImg) {
      imgBack.current = '';
      imgMemoMap = {};
      preloadImg(shareImg, posterBgId)
        .then((res) => {
          func(res);
        })
        .catch((err) => {
          message.warning(err);
        });
      // 预加载logo
      preloadImg(logoSrc, logoId).then((res) => {
        logoImg.current = res;
      });
    }

    return () => {
      func = () => {};
    };
  }, [message, shareImg]);

  useImperativeHandle(ref, () => ({
    goShare: () => {
      onShareCallback?.();
      shareHandle();
    },
    visible: shareShow,
  }));

  // 分享海报的二维码
  const getQRCode = useMemo(() => {
    return (
      <QRCode
        size={60}
        value={shareLink}
        id="newShare-QRCode-url"
        style={{ position: 'absolute', visibility: 'hidden', zIndex: -1 }}
      />
    );
  }, [shareLink]);

  if (!shareV3?.isReady) {
    return null;
  }

  if (isUseAppShare) {
    return getQRCode;
  }

  return (
    <React.Fragment>
      <ShareModels
        open={shareShow}
        onCancel={() => {
          setShareShow(false);
          if (typeof onVisibleChange === 'function') onVisibleChange(false);
        }}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        createImg={createImg}
        poster={imgMemoMap[nowId]}
        roundBorder={roundBorder}
        rootProps={rootProps}
        darkMode={darkMode}
        ads={ads}
        {...restProps}
      />
      <>{getQRCode}</>
    </React.Fragment>
  );
};

const PosterShare = forwardRef(_PosterShare);

const PosterShareLoadable = forwardRef((props, ref) => {
  const { children, ...rest } = props || {};
  return (
    <GbizShareModuleLoadable>
      {(module) => {
        return (
          <PosterShare
            {...rest}
            ref={ref}
            GbizShareModule={module}
          >
            {children}
          </PosterShare>
        )
      }}
    </GbizShareModuleLoadable>
  )
});

export default PosterShareLoadable;
