/*
 * owner: borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Box, styled } from '@kux/mui';
import { useBoolean } from 'ahooks';
import html2canvas from 'html2canvas';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import Loading from './components/Loading';
const isInApp = JsBridge.isApp();

const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  left: 9999px;
  top: 9999px;
  z-index: -100;
`;

const AppShare = forwardRef((props, ref) => {
  const { children, width = 265, height = 454, needPreload, ...restProps } = props;
  const renderDomAsImgIdRef = useRef(`renderDomAsImgId_${Math.random()}`);
  const [isLoading, { setFalse, setTrue }] = useBoolean(false);

  useImperativeHandle(ref, () => ({
    goShare: goShare,
  }));

  const goShare = useCallback(
    (callback) => {
      if (isLoading) return;
      // 获取dom结构
      const node = document.getElementById(renderDomAsImgIdRef.current);
      if (!node) return;
      setTrue();
      const scale = window.devicePixelRatio || 2;

      html2canvas(node, { scale, width, height, cacheBust: true, useCORS: true })
        .then((canvas) => {
          setFalse();
          const dataUrl = canvas.toDataURL('image/jpeg', 1);
          // 缓存base64
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
              width: `${width}px`,
              height: `${height}px`,
            },
          };
          import('dom-to-image').then(({ default: domtoimage }) => {
            domtoimage
              .toJpeg(node, param)
              .then((dataUrl) => {
                if (callback) {
                  callback(dataUrl);
                }
              })
              .catch((error) => {
                setFalse();
                console.error('dom to image error!', error);
              });
          });
        });
    },
    [isLoading, setTrue, width, height, setFalse],
  );

  if (!isInApp) return null;

  return (
    <>
      <Container width={width} height={height} id={renderDomAsImgIdRef.current} {...restProps}>
        {children}
      </Container>
      <Loading isVisible={isLoading} />
    </>
  );
});

export default React.memo(AppShare);
