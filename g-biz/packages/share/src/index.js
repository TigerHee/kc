/**
 * 业务组件，动态海报分享
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
} from 'react';
import QRCode from 'qrcode.react';
import { useSnackbar, ThemeProvider, Notification, Snackbar } from '@kufox/mui';
import { create } from './utils/createImg';
import saveAs from './utils/saveAs';
import preloadImg from './utils/preloadImg';
import { getIsInApp } from './utils/helper';
import ShareModal from './ShareModal';
import { useShareV3 } from './shareV3/useShareV3';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

let _timer = null;
const posterBgId = 'posterBg';
let imgMemoMap = {}; // 图片缓存

// 由于dynamic无法获取ref,所以这里只能onRefReady回调中获取ref https://github.com/vercel/next.js/issues/2842  https://github.com/umijs/umi/issues/5287
const PosterShare = ({ onRefReady, ...restProps }) => {
  // v3 统一逻辑
  const shareV3 = useShareV3();

  const {
    btnClickCheck = undefined, // 点击按钮前置检查
    setShareLoading = () => {}, // 点击分享的loading管理
    shareLink: originShareLink = '', // 分享给好友的链接
    shareTitle = '', // 分享给好友的文案
    shareImg = undefined, // 背景图
    shareTexts: originShareTexts = [], // 背景图上的文案
    // 外部传入
    shareModalTitle = '', // 分享弹窗title
    rootProps = {},
    theme,
    keepV1Rcode, // 需要固定展示的rcode,不跟着share-to-frinds返回的营销code走
  } = restProps || {};
  const shareLink = keepV1Rcode?.length
    ? originShareLink
    : shareV3.updateToShareV3UniversalRcode(originShareLink);
  // cache key
  const nowId = shareLink || 'default';
  const qrcodeDomId = `share-QRCode-url-${nowId}`;
  const { ads = {} } = shareV3;
  const { message } = useSnackbar();
  const isInApp = getIsInApp() || false;

  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const imgBack = useRef(null); // 海报背景图

  // 分享海报的二维码
  const getQRCode = useMemo(() => {
    return (
      <QRCode
        size={60}
        value={shareLink}
        id={qrcodeDomId}
        style={{ position: 'absolute', visibility: 'hidden', zIndex: -1, left: 0, top: 0 }}
      />
    );
  }, [shareLink, qrcodeDomId]);

  // const base64ToBlob = (code) => {
  //   try {
  //     const parts = code.split(';base64,');
  //     const contentType = parts[0].split(':')[1];
  //     const raw = window.atob(parts[1]);
  //     const rawLength = raw.length;
  //     const uInt8Array = new Uint8Array(rawLength);
  //     for (let i = 0; i < rawLength; ++i) {
  //       uInt8Array[i] = raw.charCodeAt(i);
  //     }
  //     return new Blob([uInt8Array], {
  //       type: contentType,
  //     });
  //   } catch (error) {
  //     return null;
  //   }
  // };

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = useCallback(
    (path, isUseImg = true, genImageCallback) => {
      if (!path) {
        return;
      }
      if (!isInApp && !isUseImg) {
        setShareShow(true);
        return;
      }
      if (isInApp) {
        // 把生成好的图片回调给app方法
        if (typeof genImageCallback === 'function') {
          genImageCallback(path);
        }
      } else {
        // 下载
        // const blobData = base64ToBlob(path);
        // const savePath = blobData ? URL.createObjectURL(blobData) : path;
        saveAs(path, `poster_${Date.now()}`);
      }
    },
    [isInApp],
  );

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = useCallback(
    (isUseImg = true, callback) => {
      const shareTexts = shareV3.updateToShareV3UniversalTexts(originShareTexts, {
        shareLink,
        keepV1Rcode,
      });
      if (imgMemoMap[nowId]) {
        goUseImage(imgMemoMap[nowId], isUseImg, callback);
      } else {
        setShareLoading(true);
        // 保证state更新，动画出现
        setTimeout(async () => {
          // 创建
          create({
            isZh: shareV3.splitByZeroString,
            hidePre: !!isInApp,
            quality: 0.95,
            format: 'jpeg',
            bg: imgBack.current || null,
            texts: [...shareTexts],
            shapes: [
              {
                color: '#fff',
                x: 293,
                y: 590,
                width: 70,
                height: 70,
              },
            ],
            // 底部黑框框里面的 内容 一般是左边是logo 右边是二维码； 翻转小语种的话就是右边logo 左边二维码
            imgsCommon: [
              {
                img: document.getElementById(qrcodeDomId),
                x: 295,
                y: 592,
                width: 66,
                height: 66,
              },
            ],
            maxWidth: 300,
          })
            .then((res) => {
              setShareLoading(false);
              imgMemoMap[nowId] = res;
              goUseImage(res, isUseImg, callback);
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
      shareV3,
      shareLink,
      nowId,
      keepV1Rcode,
      qrcodeDomId,
    ],
  );

  const shareHandle = useCallback(
    async (callback) => {
      const checked = typeof btnClickCheck === 'function' ? await btnClickCheck() : true;
      if (!checked) {
        return;
      }
      // 创建动态海报进行分享，创建前确保背景图片已经加载完成
      if (imgBack.current) {
        createImg(isInApp, callback);
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
              message.warning('build failed, please try again', { theme: 'dark' });
            } else {
              createImg(isInApp, callback);
            }
          }
        }, 500);
      }
    },
    [btnClickCheck, createImg, isInApp, message, setShareLoading],
  );

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
          message.warning(err, { theme: 'dark' });
        });
    }

    return () => {
      func = () => {};
    };
  }, [message, shareImg]);

  const ref = useRef({});

  useImperativeHandle(ref, () => ({
    // 业务项目可直接调用此方法
    goShare: shareHandle,
    visible: shareShow,
  }));

  useEffect(() => {
    onRefReady && onRefReady(ref.current);
  }, [onRefReady]);

  if (!shareV3.isReady) {
    return null;
  }

  // app内只赋予生成图片功能，不展示modal
  if (isInApp) {
    return getQRCode;
  }

  return (
    <>
      <ShareModal
        open={shareShow}
        onCancel={() => setShareShow(false)}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        createImg={createImg}
        poster={imgMemoMap[nowId]}
        shareModalTitle={shareModalTitle}
        ads={ads}
        rootProps={rootProps}
        theme={theme}
      />
      <div>{getQRCode}</div>
    </>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <PosterShare {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
