/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import style from './style.less';

const SwiperButton = ({ props, icon }) => {
  const { onClick, func } = props;
  const _onClick = useCallback(() => {
    if (typeof func === 'function') {
      func();
    }
    if (typeof onClick === 'function') {
      onClick();
    }
  }, [func, onClick]);
  return (
    <section className={`${style.swiperDiv} ${icon}`} onClick={_onClick}>
      <div className={style.swiperButton}>
        <svg
          width="19"
          height="16"
          viewBox="0 0 19 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={style.img}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.0418 7.9936L6.58271 14.4524L7.99689 15.8667L15.8703 7.99363L8.00345 0.126794L6.58923 1.54101L13.0418 7.9936Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export const PrevButton = (props) => <SwiperButton icon="prev" props={props} />;

export const NextButton = (props) => {
  return <SwiperButton icon="next" props={props} />;
};
