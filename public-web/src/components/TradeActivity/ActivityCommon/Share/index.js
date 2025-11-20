/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { startsWith } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import GbizShareV2 from 'src/components/common/GbizShareV2';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath, _t } from 'tools/i18n';

const { KUCOIN_HOST_COM } = siteCfg;
const posterBg = `https://assets.staticimg.com/cms/media/4IoGkF4GWHcHMlTBVSUKN1A1ZSPAtRBybOIBxYZh2.png?t=${Date.now()}`;

const shareImgs = {};

// web采用公共组件弹框，app使用原生单图分享
export default ({ utmSource }) => {
  const shareRef = useRef(null);

  const referralCode = useSelector((state) => state.user.referralCode, shallowEqual);
  const appInfo = useSelector((state) => state.app.appInfo, shallowEqual);
  const shareInfo = useSelector((state) => state.rocketZone.shareInfo, shallowEqual);
  const shareModal = useSelector((state) => state.rocketZone.shareModal);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const { shareImg = posterBg, shareUrl } = shareInfo || {};
  const { webHost } = appInfo || {};

  const isInApp = JsBridge.isApp();

  const onRefReady = useCallback((node) => {
    console.log('ShareMyCard GbizShare onRefReady', node);
    shareRef.current = node;
  }, []);

  const shareLink = useMemo(() => {
    let shareHost = KUCOIN_HOST_COM;
    if (webHost) {
      shareHost = startsWith(webHost, 'https') ? webHost : `https://${webHost}`;
    }

    return addLangToPath(`${shareHost}${shareUrl}${referralCode ? `?rcode=${referralCode}` : ''}`);
  }, [webHost, shareUrl, referralCode]);

  const getBase64 = (img) => {
    function getBase64Image(img) {
      if (!img) {
        console.log('img is null');
        return;
      }
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL();
      return dataURL;
    }
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = img;
    image.alt = 'share image';
    return new Promise((resolve, reject) => {
      image.onload = function () {
        resolve(getBase64Image(image)); //将base64传给done上传处理
      };
    });
  };

  const handleShare = useCallback(
    (imgPath) => {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'share',
          category: 'img',
          pic: imgPath,
          needQrCode: true,
          rcode: referralCode, // 可选,ios旧版本有问题，建议加上
          qrCodeUrl: shareLink, // 可选,默认分享注册链接
          linkUrl: shareLink, // 可选,默认分享注册链接 (文档里适用于文本分享)
          utmSource,
        },
      });
    },
    [referralCode, shareLink, utmSource],
  );

  const openShareModal = useCallback(() => {
    if (!shareImg) {
      console.log('share image not be empty');
      return;
    }

    if (isInApp) {
      if (shareImgs[shareImg]) {
        handleShare(shareImgs[shareImg]);
      } else {
        // 生成图片,然后单张图片分享
        getBase64(`${shareImg}?t=${Date.now()}`).then(
          (imgPath) => {
            shareImgs[shareImg] = imgPath;
            handleShare(imgPath);
          },
          (err) => {
            console.log(err, 'getBase64 error');
          },
        );
      }
    } else {
      shareRef.current?.goShare && shareRef.current?.goShare();
    }
  }, [isInApp, shareLink, shareImg, referralCode, handleShare]);

  useEffect(() => {
    if (shareModal) {
      openShareModal();
    }
  }, [shareModal, openShareModal]);

  if (!isInApp) {
    return (
      <>
        <GbizShareV2
          shareTitle={_t('dRGwUPpWiKvkJQos24q78K')}
          shareLink={shareLink}
          shareImg={shareImg}
          onRefReady={onRefReady}
          canvasSize={{ width: 245, height: 418 }}
          theme={currentTheme}
        />
      </>
    );
  }
  return null;
};
