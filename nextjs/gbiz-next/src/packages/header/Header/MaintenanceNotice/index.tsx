/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResponsive } from '@kux/design';

import Marquee from 'react-fast-marquee';
import { useTranslation } from 'tools/i18n';
import closeIcon from '../../static/newHeader/maintenance_close.svg';
import styles from './styles.module.scss'


export default (props) => {
  const { maintenance, closeShow } = props;
  const { t } = useTranslation('header');
  const rv = useResponsive();
  const downSmall = rv === 'sm';
  const titleRef = useRef<HTMLSpanElement>(null);
  const titleParentRef = useRef<HTMLDivElement>(null);
  const [needScroll, setNeedScroll] = useState(false);
  const clickClose = useCallback(() => {
    if (typeof closeShow === 'function') {
      closeShow();
    }
  }, [closeShow]);
  const {
    title = '', // 公告内容
    link = '', // 公告跳转链接
    redirectContent = '', // 跳转文本
  } = maintenance || {};

  useEffect(() => {
    // 加上一定的延时，防止拿不到正确的dom size
    setTimeout(() => {
      const titleEl = titleRef.current as HTMLElement;
      const parentEl = titleParentRef.current as HTMLElement;
      if (titleEl && parentEl) {
        const _needScroll = titleEl.clientWidth > parentEl.clientWidth + 12;
        if (_needScroll) {
          // 设置滚动容器的父元素宽度，使react-fast-marquee可以准确计算父容器宽度
          titleEl.style.width = `${titleEl.clientWidth}px`;
          setNeedScroll(true);
        } else {
          setNeedScroll(false);
        }
      }
    }, 100);
  }, [titleRef.current, titleParentRef.current, rv]);

  return (
    <div className={styles.wrapper} style={{height: '40px', lineHeight: '40px'}}>
      <div className={styles.main}>
        <span className={styles.content} ref={titleParentRef}>
          <span ref={titleRef} style={{ display: 'inline-block' }}>
            {needScroll ? (
              <Marquee autoFill delay={1.5} pauseOnHover={!downSmall}>
                {title}
                <span className={styles.marqueeGap} />
              </Marquee>
            ) : (
              <span>{title}</span>
            )}
          </span>
        </span>
        {link && (
          <span className={styles.link}>
            <a href={link} target="_blank">
              {redirectContent || t('view.more')}
            </a>
          </span>
        )}
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img src={closeIcon} onClick={clickClose} alt="close icon" className={styles.closeIcon} />
    </div>
  );
};
