/**
 * Owner: iron@kupotech.com
 */
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@kc/mui/lib/styles';
import cls from 'clsx';
import map from 'lodash/map';
import { Spin } from '@kc/mui';
import MsgItem from './MsgItem';
// import { SCROLL_DISTANCE } from '../../config';

const useStyle = makeStyles(() => {
  return {
    msgWindow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 17,
      overflowY: 'scroll',
      overflowX: 'hidden',
      '-webkit-overflow-scrolling': 'touch',
    },
    timeMsg: {
      fontSize: 12,
      paddingBottom: 20,
      textAlign: 'center',
      color: 'rgba(0, 0, 0, .4)',
    },
  };
});

export default (props) => {
  const {
    className,
    msgData,
    // addMsgReads,
    // getResource,
    // reSendMsg,
    showPrevImg,
    onScrollToTop,
    currentAvatar,
    otherAvatar,
    hasMore,
    currentUser,
    onResendClick,
  } = props;
  const styles = useStyle();
  const msgWindowRef = useRef(null);
  const msgItemWrapperRef = useRef(null);
  // const [reRenderMsgReads, setReRenderMsgReads] = useState(0); // 根据一个随机数来使子组件重新渲染
  // 判断当前是否人为往上滚了，如果是人为已经往上滚了，新消息来了则不需要自动滚动到底部
  const [isReadHistory, setIsReadHistory] = useState(false);
  const [msgDataLength, setMsgDataLength] = useState(0);
  const isBottom = useRef(true);

  useEffect(() => {
    if (msgData.length) {
      setMsgDataLength(msgData.length);
    }
  }, [msgData]);

  const msgWindowScrollToView = useCallback(() => {
    const timer = setTimeout(() => {
      const el = msgWindowRef.current;
      el &&
        el.scrollTo({
          left: 0,
          top: el.scrollHeight,
          // behavior: 'smooth',
        });
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    !isReadHistory && msgWindowScrollToView();
  }, [isReadHistory, msgWindowScrollToView, msgDataLength]);

  useEffect(() => {
    const el = msgWindowRef.current;
    if (!el) {
      return;
    }
    // 如果滚动弹窗接近底部，则获取新消息时，滚动窗口
    const lastItem = msgData[msgData.length - 1] || {};
    if (isBottom.current || lastItem.to !== currentUser) {
      msgWindowScrollToView();
    }
  }, [msgData]);

  return (
    <div
      className={cls(styles.msgWindow, className)}
      ref={msgWindowRef}
      onScroll={(e) => {
        if (!isReadHistory) {
          setIsReadHistory(true);
        }
        const el = e.target;
        // console.log(el, el.scrollTop, el.scrollHeight);
        if (el && el.scrollTop < 300 && onScrollToTop && hasMore) {
          el.scrollTo(0, 300);
          onScrollToTop();
        }
        isBottom.current = Math.abs(el.scrollTop + el.offsetHeight - el.scrollHeight) < 1;
      }}
    >
      {hasMore ? (
        <div
          style={{
            height: '300px',
            paddingTop: '200px',
            lineHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      ) : null}
      <div ref={msgItemWrapperRef}>
        {map(msgData, (item) => {
          if (item.type === 'time') {
            return (
              <div key={item.key} className={styles.timeMsg}>
                {item.time}
              </div>
            );
          }
          return (
            <MsgItem
              {...item}
              currentAvatar={currentAvatar}
              otherAvatar={otherAvatar}
              key={item.key}
              parent={msgWindowRef}
              showPrevImg={showPrevImg}
              onResendClick={onResendClick}
              data={item}
            />
          );
        })}
      </div>
    </div>
  );
};
