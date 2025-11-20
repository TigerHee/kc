/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 公共组件，静态海报分享
 */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Button } from '@kufox/mui';
import JsBridge from 'utils/jsBridge';
import { create } from 'utils/createImg';
import saveAs from 'utils/saveAs';
import preloadImg from 'utils/preloadImg';
// import { ga } from 'utils/ga';
import ShareModel from 'components/ShareModel';
// import styles from './styles.less';

let _timer = null;
const posterBgId = 'posterBgCommon';
let imgMemo = ''; // 图片缓存

const PosterShare = props => {
  const {
    selfBtnFunc, // 返回自定义按钮的方法
    className = '', // 按钮样式
    btnText = '', // 按钮文字
    btnClickCheck = undefined, // 点击按钮前置检查
    isZh = false,
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    isInApp = false,
    poster = '', // 需要分享的海报图
  } = props || {};
  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const [shareLoading, setShareLoading] = useState(false); // 分享loading
  const imgBack = useRef(''); // 海报背景图

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = useCallback(
    (path, isUseImg = true) => {
      if (!path) {
        return;
      }
      if (!isInApp && !isUseImg) {
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
      }
    },
    [isInApp],
  );

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = useCallback(
    (isUseImg = true) => {
      console.log('--createImg--');
      if (imgMemo) {
        goUseImage(imgMemo, isUseImg);
      } else {
        setShareLoading(true);
        // 保证state更新，动画出现
        setTimeout(() => {
          // 创建
          create({
            isZh,
            hidePre: !!isInApp,
            quality: 1,
            format: 'png',
            bg: imgBack.current || null,
          })
            .then(res => {
              setShareLoading(false);
              imgMemo = res;
              goUseImage(res, isUseImg);
            })
            .catch(err => {
              console.error(err);
              setShareLoading(false);
            });
        }, 100);
      }
    },
    [goUseImage, isZh, isInApp],
  );

  const shareHandle = useCallback(() => {
    // ga('');
    const checked = typeof btnClickCheck === 'function' ? btnClickCheck() : true;
    if (!checked) {
      return;
    }
    if (!isInApp) {
      // 浏览器中直接展示图片即可
      setShareShow(true);
    } else {
      // app需要提供base64进行分享，创建前确保图片已经加载完成
      if (imgBack.current) {
        createImg();
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
              // .info({ content: 'build failed, please try again' });
            } else {
              createImg();
            }
          }
        }, 500);
      }
    }
  }, [btnClickCheck, createImg, isInApp]);

  useEffect(() => {
    return () => {
      clearInterval(_timer);
      _timer = null;
    };
  }, []);

  useEffect(() => {
    let func = res => {
      imgBack.current = res;
    };
    // 预加载海报图
    if (poster) {
      imgBack.current = '';
      imgMemo = '';
      preloadImg(poster, posterBgId)
        .then(res => {
          func(res);
        })
        .catch(err => {
          // .info({ content: err });
        });
    }

    return () => {
      func = () => {};
    };
  }, [poster]);

  return (
    <>
      {typeof selfBtnFunc === 'function' ? (
        selfBtnFunc({ loading: shareLoading, onClick: shareHandle })
      ) : (
        <Button className={className} loading={shareLoading} onClick={shareHandle}>
          {btnText}
        </Button>
      )}
      {/* 浏览器分享弹窗 */}
      {!isInApp && (
        <ShareModel
          open={shareShow}
          onCancel={() => {
            // ga('');
            setShareShow(false);
          }}
          isZh={isZh}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          createImg={createImg}
          poster={poster}
        />
      )}
    </>
  );
};

export default PosterShare;
