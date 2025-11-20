/**
 * Owner: jesse.shao@kupotech.com
 */
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'hooks';
import QRCode from 'qrcode.react';
import loadable from '@loadable/component';
import ShareModel from 'components/ShareModel';
import { SUPPORT_GALLERY_VERSION, sharePoster, SHARE_CONFIG } from './config';
import { KUCOIN_HOST_COM } from 'utils/siteConfig';
import { create } from 'utils/createImg';
import saveAs from 'utils/saveAs';
import preloadImg from 'utils/preloadImg';
import { compareVersion } from 'helper';

const GbizShareModuleLoadable = loadable.lib(() => System.import('@remote/share'));

let _timer = null;
const posterBgId = 'posterBgLuckydraw';
let imgMemoMap = {}; // 图片缓存
let nowId = '';

const _PosterShare = (props, ref) => {
  // v3 统一逻辑
  const shareV3 = props.GbizShareModule?.useShareV3?.();

  const {
    btnClickCheck = undefined, // 点击按钮前置检查
    setShareLoading = () => {}, // 点击分享的loading管理
    namespace = 'luckydrawTurkey',
    shareUrl = '',
    shareConfigure = {},
    // 是否让客户端绘制底部 qrcode 信息，默认 false
    // 当为 true 时，app 里的分享海报会自动切掉底部 240px 的高度，让 app 去绘制底部
    // 否则 app 底部不会有 copy link 按钮
    useAppRender = false,
    needQrCode = false,
  } = props || {};
  const shareConfig = SHARE_CONFIG[namespace]({ ...shareConfigure });
  const [shareShow, setShareShow] = useState(false);
  const { isInApp, currentLang, appVersion } = useSelector(state => state.app);
  const { inviteCode } = useSelector(state => state[namespace]);
  const imgBack = useRef(null); // 海报背景图

  const isZh = currentLang === 'zh_CN' || currentLang === 'zh_HK';
  const originShareLink = shareUrl || `${KUCOIN_HOST_COM}/r/rf/${inviteCode}`;
  const shareLink = shareV3?.updateToShareV3UniversalRcode
    ? (shareV3?.updateToShareV3UniversalRcode?.(originShareLink) || originShareLink)
    : originShareLink;
  const ads = shareV3?.ads;
  const shareTitle = useMemo(() => {
    const str = shareConfig.shareTitle;
    return encodeURIComponent(str);
  }, [shareConfig]);
  // 支持多海报分享
  const supportGallery = compareVersion(appVersion, SUPPORT_GALLERY_VERSION) >= 0;
  // 支持新版分享组件
  const useNewShareVersion = useAppRender && isInApp && compareVersion(appVersion, '3.89.0') >= 0;
  // 最新的分享邀请码
  const rcode = shareV3?.shareData?.referralCode;
  // 分享海报的二维码
  const getQRCode = useMemo(() => {
    return (
      <QRCode
        size={60}
        value={shareLink}
        id="luckydraw_share_code"
        style={{ position: 'absolute', visibility: 'hidden', zIndex: -1 }}
      />
    );
  }, [shareLink]);

  useEffect(() => {
    let func = res => {
      imgBack.current = res;
    };
    // 预加载海报图
    imgBack.current = '';
    imgMemoMap = {};
    preloadImg(shareConfig.posterBg, posterBgId)
      .then(res => {
        func(res);
      })
      .catch(err => {
        // .info({ content: err, theme: 'dark' });
      });

    return () => {
      func = () => {};
    };
  }, [isInApp, shareConfig.posterBg]);

  useEffect(() => {
    return () => {
      clearInterval(_timer);
      _timer = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    goShare: () => {
      shareHandle();
    },
    visible: shareShow,
  }));

  const shareHandle = async () => {
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
            // .info({ content: 'build failed, please try again ', theme: 'dark' });
          } else {
            createImg(isInApp);
          }
        }
      }, 500);
    }
  };

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = (path, isUseImg = true) => {
    if (!path) {
      return;
    }
    if (!isInApp && !isUseImg) {
      setShareShow(true);
      return;
    }
    if (isInApp) {
      // 直接调起app分享
      sharePoster(supportGallery, shareLink, {
        useNewShareVersion,
        rcode,
        needQrCode
      });
    } else {
      // 下载
      saveAs(path, `poster_${Date.now()}`);
    }
  };

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = (isUseImg = true) => {
    if (imgMemoMap[nowId]) {
      goUseImage(imgMemoMap[nowId], isUseImg);
    } else {
      setShareLoading(true);
      // 保证state更新，动画出现
      setTimeout(async () => {
        const splitByZeroString = currentLang !== 'en_US';
        let texts = [...shareConfig.shareTexts];
        // 创建
        create({
          isZh: splitByZeroString,
          hidePre: !!isInApp,
          quality: 0.95,
          format: 'jpeg',
          bg: imgBack.current || null,
          texts,
          imgsCommon: [
            {
              img: document.getElementById('luckydraw_share_code'),
              x: 300,
              y: 600,
              width: 55,
              height: 55,
            },
          ],
          maxWidth: 300,
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
  };

  if (!shareV3?.isReady) {
    return null;
  }

  if (isInApp) {
    return null;
  }

  return (
    <React.Fragment>
      <ShareModel
        open={shareShow}
        showCopy={true}
        onCancel={() => setShareShow(false)}
        isZh={isZh}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        createImg={createImg}
        poster={imgMemoMap[nowId]}
        ads={ads}
      />
      <div>{getQRCode}</div>
    </React.Fragment>
  );
};

const PosterShare = forwardRef(_PosterShare);

const PosterShareLoadable = forwardRef((props, ref) => {
  const {children, ...rest} = props || {};
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
