/**
 * 业务组件，动态海报分享
 */
import React, { useCallback, useState, useEffect, useRef, useImperativeHandle } from 'react';
import QRCode from 'qrcode.react';
import { useTheme, useSnackbar, ThemeProvider, Snackbar, Notification } from '@kufox/mui';
import { css } from '@emotion/react';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import saveAs from './utils/saveAs';
import { getIsInApp } from './utils/helper';
import ShareModal from './ShareModal';
// html2canvas这里只能用png svg在safari会有展示不正常的问题
import { tenantConfig } from './tenantConfig';

import { useShareV3 } from './shareV3';
import { useLang } from './hookTool';
import { loadImageAsBase64 } from './utils/image-utils';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const useStyles = ({ canvasSize }) => {
  return {
    asImgWrap: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      &[data-is-app='true'] {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -100;
        visibility: hidden;
      }
    `,
    bg: css`
      width: ${canvasSize.width}px;
      height: auto;
      z-index: 1;
    `,
    footer: css`
      width: ${canvasSize.width}px;
      min-height: 56px;
      background: #00142a;
      z-index: 1;
      display: flex;
      align-items: center;
      padding: 6px;
    `,
    left: css`
      flex: 1;
      display: flex;
      align-items: center;
    `,
    logo: css`
      width: 28px;
      min-width: 28px;
      max-width: 28px;
      height: 28px;
      margin-right: 4px;
    `,
    right: css`
      width: 36px;
      min-width: 36px;
      max-width: 36px;
      height: 36px;
      background: #fff;
      padding: 3px;
    `,
    textWrapper: css`
      margin-right: 4px;
      flex: 1;
    `,
    up: css`
      font-weight: 500;
      font-size: 12px;
      line-height: 1.1;
      color: #ffffff;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      transform: scale(0.95);
      transform-origin: left center;
    `,
    down: css`
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: rgba(255, 255, 255, 0.6);
      transform: scale(0.9);
      transform-origin: left center;
    `,
  };
};

let shareHandleCb = () => {};
window.ShareModalV2_imgMemoMap = {}; // 图片缓存
const imgMemoMap = window.ShareModalV2_imgMemoMap;

// 由于dynamic无法获取ref,所以这里只能onRefReady回调中获取ref https://github.com/vercel/next.js/issues/2842  https://github.com/umijs/umi/issues/5287
const ShareModalV2 = ({ onRefReady, ...restProps }) => {
  // v3 统一逻辑
  const shareV3 = useShareV3();
  const { t: _t } = useLang();

  const { message } = useSnackbar();
  const theme = useTheme();
  const {
    btnClickCheck = undefined, // 点击按钮前置检查
    shareLink: originShareLink = '', // 分享给好友的链接
    shareTitle = '', // 分享给好友的文案
    shareImg = undefined, // 背景图
    // shareTexts = [], // 背景图上的文案
    shareModalTitle = '', // 分享弹窗title
    canvasSize = { width: 265, height: 454 },
    shareContent = undefined, // 自定义分享内容
    keepV2Rcode, // FIXME: 当产品要求用老 2.0 rcode 不处理成统一的 rcode 时使用
    rootProps = {},
    diyModalShareClick, // 分享渠道点击回调
    diyModalTitle, // 顶部自定义内容
    onlyUseWebShare, // 只用web的分享, 传递为true时在app内也用h5/pc的分享！！
    onCancel, // 点击关闭回调
  } = restProps || {};
  const shareLink = keepV2Rcode?.length
    ? originShareLink
    : shareV3.updateToShareV3UniversalRcode(originShareLink);
  const { ads = {} } = shareV3;

  // cache key
  const nowId = shareLink || 'default';
  const qrcodeDomId = `share-QRCode-url-${nowId}`;

  const isInApp = getIsInApp();
  const isUseAppShare = isInApp && !onlyUseWebShare; // 使用App分享

  const styles = useStyles({
    color: theme.colors,
    breakpoints: theme.breakpoints,
    isInApp: isUseAppShare,
    canvasSize,
  });
  const { shareFooterLogo } = tenantConfig;

  const [brandLogo, setBrandLogo] = useState(shareFooterLogo); // 站点logo图片

  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const renderDomAsImgIdRef = useRef(`renderDomAsImgId_${Math.random()}`);
  // 必须是相对路径url或者base64，否则无法下载
  const downloadImg = () => {
    if (imgMemoMap[renderDomAsImgIdRef.current]) {
      saveAs(imgMemoMap[renderDomAsImgIdRef.current], `poster_${Date.now()}`);
    } else {
      message.error('The image is loading, please try again later.');
    }
  };

  // 生成base64
  const createBase64 = useCallback(
    (callback) => {
      if (imgMemoMap[renderDomAsImgIdRef.current] && callback) {
        callback(imgMemoMap[renderDomAsImgIdRef.current]);
      } else {
        // 获取dom结构
        const node = document.getElementById(renderDomAsImgIdRef.current);
        if (!node) return;

        const scale = window.devicePixelRatio || 2;
        const { width, height, cavanScale = 1 } = canvasSize;
        const canvasWidth = Math.floor(width * cavanScale);
        const canvasHeight = Math.floor(height * cavanScale);

        html2canvas(node, {
          scale,
          width: canvasWidth,
          height: canvasHeight,
          cacheBust: true,
          useCORS: true,
        })
          .then((canvas) => {
            const dataUrl = canvas.toDataURL('image/jpeg', 1);
            // 缓存base64
            imgMemoMap[renderDomAsImgIdRef.current] = dataUrl;
            if (callback) {
              callback(dataUrl);
            }
          })
          .catch(() => {
            const param = {
              height: height * scale,
              width: width * scale,
              quality: 1,
              cacheBust: true,
              style: {
                transform: `scale(${scale})`,
                transformOrigin: '0 0',
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
              },
            };
            domtoimage
              .toJpeg(node, param)
              .then((dataUrl) => {
                // 缓存base64
                imgMemoMap[renderDomAsImgIdRef.current] = dataUrl;
                if (callback) {
                  callback(dataUrl);
                }
              })
              .catch((error) => {
                console.error('dom to image error!', error);
              });
          });
      }
    },
    [canvasSize],
  );

  const shareHandle = useCallback(
    async (callback) => {
      const checked = typeof btnClickCheck === 'function' ? await btnClickCheck() : true;
      if (!checked) {
        return;
      }
      // 展示弹窗
      setShareShow(true);
      // 保存回调以当base64生成好时给app回传
      shareHandleCb = callback;
      // app内多次触发，直接回调
      if (isUseAppShare && imgMemoMap[renderDomAsImgIdRef.current] && callback) {
        callback(imgMemoMap[renderDomAsImgIdRef.current]);
      }
    },
    [btnClickCheck, isUseAppShare],
  );

  const ref = useRef({});

  useImperativeHandle(ref, () => ({
    // 业务项目可直接调用此方法
    goShare: shareHandle,
    visible: shareShow,
  }));

  useEffect(() => {
    onRefReady && onRefReady(ref.current);
  }, [onRefReady]);

  useEffect(() => {
    const init = async () => {
      const imgBase64 = await loadImageAsBase64(shareFooterLogo);
      if (imgBase64) setBrandLogo(imgBase64);
    };
    init();
  }, [shareFooterLogo]);

  const renderDomAsImg = () => {
    const shareTexts = shareV3.updateToShareV3UniversalTexts(
      [
        { text: _t('69ti912QyqQK3RLThoqqNL') },
        { text: _t('h2RhjtaW236Cy1ofAMdsY7', { num: 8200 }) },
      ],
      { shareLink, keepV2Rcode },
    );
    const mainTitle = shareTexts?.[0]?.text || _t('69ti912QyqQK3RLThoqqNL');
    const subTitle = shareTexts?.[1]?.text || _t('h2RhjtaW236Cy1ofAMdsY7', { num: 8200 });
    return (
      <div
        css={styles.asImgWrap}
        id={renderDomAsImgIdRef.current}
        className="g-biz-asImgWrap"
        data-is-app={isUseAppShare ? 'true' : ' false'}
      >
        {shareContent || null}
        <img
          className="g-biz-share-bg"
          alt="share-bg"
          src={shareImg}
          css={styles.bg}
          onLoad={() => {
            createBase64(shareHandleCb);
          }}
          crossOrigin="anonymous"
        />
        <div css={styles.footer} className="g-biz-asImgWrap-footer">
          <div css={styles.left}>
            <img alt="logo" src={brandLogo} css={styles.logo} crossOrigin="anonymous" />
            <div css={styles.textWrapper}>
              <div css={styles.up}>
                {mainTitle}
                {/* {get(shareTexts, '0', 'Start trading BTC, ETH and KCS now!')} */}
              </div>
              <div css={styles.down}>
                {subTitle}
                {/* {get(shareTexts, '1', 'Download KuCoin APP')} */}
              </div>
            </div>
          </div>
          <div css={styles.right}>
            <QRCode
              crossOrigin="anonymous"
              size={30}
              value={shareLink}
              id={qrcodeDomId}
              level="Q"
            />
          </div>
        </div>
      </div>
    );
  };

  const onModalCancel = () => {
    setShareShow(false);
    typeof onCancel === 'function' && onCancel();
  };

  if (!shareV3.isReady) {
    return null;
  }

  // app内只赋予生成图片功能，不展示modal 2025.07.01 但其实app里面还是要自己单独写渲染逻辑是个大坑！！！ 可以看看 https://klarkchat.sg.larksuite.com/wiki/DnAtwLiS6ioMnQkGHuYlRoKegAb
  if (isUseAppShare) {
    return renderDomAsImg();
  }

  return (
    <>
      <ShareModal
        open={shareShow}
        onCancel={onModalCancel}
        renderDomAsImg={renderDomAsImg}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        createImg={downloadImg}
        shareModalTitle={shareModalTitle}
        ads={ads}
        rootProps={rootProps}
        diyModalShareClick={diyModalShareClick}
        diyModalTitle={diyModalTitle}
      />
    </>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <ShareModalV2 {...props} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
