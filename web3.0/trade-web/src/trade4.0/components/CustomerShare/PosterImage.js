/**
 * Owner: garuda@kupotech.com
 * 业务组件，动态海报分享
 */
import React, { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';


import clsx from 'clsx';

import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';

import { _t } from 'utils/lang';

import { styled } from '@kux/mui';

import logoPng from '@/assets/share/logo.png';

const saveAs = (uri, filename) => {
  const link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); // Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); // remove the link when done
  } else {
    window.open(uri);
  }
};

const PosterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .img-background {
    position: absolute;
    z-index: -1;
    width: 100%;
    top: 0;
    left: 0;
  }

  .footer {
    min-height: 56px;
    width: 100%;
    background: rgba(29, 29, 29, 0.6);
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 12px 12px 0px 0px;
  }
  .left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .logo {
    width: 30px;
    min-width: 30px;
    max-width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .right {
    width: 36px;
    min-width: 36px;
    max-width: 36px;
    height: 36px;
    background: #f3f3f3;
    padding: 3px;
  }
  .textWrapper {
    margin-right: 4px;
    flex: 1;
    .up {
      font-weight: 500;
      font-size: 12px;
      line-height: 1.1;
      color: #f3f3f3;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      transform: scale(0.95);
      transform-origin: left center;
    }
    .down {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: rgba(243, 243, 243, 0.6);
      transform: scale(0.9);
      transform-origin: left center;
    }
  }
`;

const PosterImage = forwardRef((props, ref) => {
  const {
    className = '', // 分享内容的 className
    shareLink = '', // 分享给好友的链接
    shareTexts = [], // 背景图上的文案
    shareFooter = '', // 分享内容的 footer
    canvasSize = { width: 265, height: 454 },
    shareContent = undefined, // 自定义分享内容
    saveFileName = '', // 保存图片的名字
    shareBackground = undefined, // 分享的背景图
  } = props || {};

  const renderDomAsImgIdRef = useRef(`renderDomAsImgId_${Math.random()}`);
  const posterRef = useRef();

  const mainTitle = shareTexts?.[0] || _t('futures.pnlShare.title');
  const subTitle = shareTexts?.[1];

  // 生成base64
  const generatePoster = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        // 获取dom结构
        const node = document.getElementById(renderDomAsImgIdRef.current);

        if (!node) {
          posterRef.current = null;
          return reject("generatePoster error: don't find element");
        }

        const scale = window.devicePixelRatio || 2;

        const { width, height } = canvasSize;

        const canvas = await html2canvas(node, {
          scale,
          width,
          height,
          cacheBust: true,
          useCORS: true,
        });

        const dataUrl = canvas.toDataURL('image/jpeg', 1);

        // 赋值 base64
        posterRef.current = dataUrl;
        resolve(posterRef.current);
      } catch (error) {
        console.error('generatePoster error: ', error);
        reject(error);
      }
    });
  }, [canvasSize]);

  // 必须是相对路径url或者base64，否则无法下载
  const downloadImg = useCallback(async () => {
    return new Promise((res, rej) => {
      generatePoster()
        .then(() => {
          if (posterRef.current) {
            saveAs(posterRef.current, `${saveFileName || 'poster_'}${Date.now()}`);
            res();
          } else {
            rej('downloadImg error: no poster image current');
          }
        })
        .catch((err) => {
          console.error('downloadImg error: ', err);
          rej(err);
        });
    });
  }, [generatePoster, saveFileName]);

  useImperativeHandle(ref, () => ({
    // 业务项目可直接调用此方法
    generatePoster,
    downloadImg,
    posterValue: posterRef?.current, // 生成图片的 base64 值
  }));

  return (
    <PosterContent
      className={clsx('poster-content', className)}
      id={renderDomAsImgIdRef.current}
      style={{ width: canvasSize?.width, height: canvasSize?.height }}
    >
      {shareBackground}
      {shareContent}
      {shareFooter || (
        <div className="footer">
          <div className="left">
            <img alt="logo" src={logoPng} className="logo" crossOrigin="anonymous" />
            <div className="textWrapper">
              <div className="up">{mainTitle}</div>
              <div className="down">{subTitle}</div>
            </div>
          </div>
          <div className="right">
            <QRCode crossOrigin="anonymous" size={30} value={shareLink} id="qrCode-id" level="Q" />
          </div>
        </div>
      )}
    </PosterContent>
  );
});

export default React.memo(PosterImage);
