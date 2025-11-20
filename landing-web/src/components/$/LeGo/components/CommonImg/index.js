/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, Fragment, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'dva';
import { ErrorOutlined } from '@kufox/icons';
import BScroll from '@better-scroll/core';
import { useIsMobile } from 'components/$/MarketCommon/config';
import { IMG_WIDTH } from 'components/$/LeGo/config';
import styles from './style.less';

const CommonImg = ({ content }) => {
  const isMobile = useIsMobile();
  const { translate } = useSelector((state) => state.lego);
  const [enlarge, setEnlarge] = useState(false);
  const [imgWidth, setImgWidth] = useState('100%');
  const [scroll, setScroll] = useState(undefined);
  const scrollRef = useRef(null);
  const imgUrl = content?.imgUrl && translate ? translate[content.imgUrl] : '';

  useEffect(() => {
    if (enlarge) {
      const bs = new BScroll(scrollRef.current, {
        scrollX: true,
        click: true,
      });
      setScroll(bs);
    } else {
      setScroll(undefined);
    }
  }, [enlarge]);

  useEffect(() => {
    if (scroll) {
      scroll.refresh();
    }
  }, [imgWidth, scroll]);

  // h5 分辨率图片，点击放大
  const handleEnlarge = () => {
    if (isMobile) {
      setEnlarge(true);
    }
  };

  const imgOverlay = useMemo(() => {
    return enlarge ? (
      <Fragment>
        <div className={styles.overlay} ref={scrollRef}>
          <img
            data-testid="enlarge-img"
            src={imgUrl}
            alt=""
            style={{ width: imgWidth }}
            onClick={() => {
              setImgWidth(IMG_WIDTH[imgWidth]);
            }}
          />
        </div>
        <ErrorOutlined
          className={styles.closeIcon}
          size="32"
          color="#fff"
          onClick={() => setEnlarge(false)}
        />
      </Fragment>
    ) : null;
  }, [enlarge, imgUrl, imgWidth]);

  if (!imgUrl) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <img data-block-img onClick={handleEnlarge} src={imgUrl} alt="" />
      </div>
      <Fragment>{imgOverlay}</Fragment>
    </div>
  );
};

export default React.memo(CommonImg);
