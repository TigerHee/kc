/**
 * Owner: jesse.shao@kupotech.com
 */


import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@kufox/mui';
import { Icon } from 'antd';
import storage from 'utils/storage';
import classnames from 'classnames';
import { _t } from 'utils/lang';
import { debounce } from 'lodash';
import styles from './style.less';

export default ({
  text = _t('send_h5'),
  loadingText,
  countingText = (count) => _t('try.again.cutdown', { cout: count }),
  loading,
  countNumber,
  onClick,
  retryText = _t('resend'),
  countStartFlag,
  buttonProps = {},
  bizKey="",
  shouldContinue= true,
  // ...restProps,
}) => {

  const [count, updateCount] = useState(null);
  const [counted, updateCounted] = useState(false);
  const [hasClick, setHasClick] = useState(false);

  const _storageKey = `count_btn_${bizKey}`;
  const _storageTimeKey = `count_btn_timestamp_${bizKey}`;


  const counter = useCallback((_count) => {
    let timer = null;
    updateCount(_count);
    if(_count > 0) {
      timer = setTimeout(() => {
        counter(_count - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }
    return () => {
      if(timer) {
        clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    if(count > 0 && count < countNumber.time && !counted){
      updateCounted(true);
    }
  }, [count, countNumber, counted])

  useEffect(() => {
    return () => {
      if(shouldContinue) {
        storage.setItem(_storageKey, count || 0);
        storage.setItem(_storageTimeKey, Date.now());
      }
    }
  }, [count]);
  useEffect(() => {
    if(!countNumber || countNumber.time < 1 || !hasClick) {
      return;
    }
    let _counted = storage.getItem(_storageKey);
    const _timestamp = storage.getItem(_storageTimeKey);
    if(_timestamp && _counted) {
      const past = (Date.now() - _timestamp) / 1000;
      _counted = Math.floor(_counted - past > 0 ? _counted - past : 0);
    }
    const counting =  count > 0 && count < countNumber.time ;
    if(!counting && (+_counted || _counted === undefined || _counted === null)) {
      counter(_counted ? +_counted : countNumber.time);
    }
  }, [countNumber, hasClick]);


  const _content = useMemo(() => {
    const counting = count > 0 && count < countNumber.time;
    const _loading = loading ? <Icon type="loading" /> : null;
    const _content = count > 0 ? countingText(count) : (counted ? (retryText || text) : text );
    const _handleClick = debounce((e) => {
      if(loading  || counting){
        return
      }
      setHasClick(Date.now());
      onClick(e);
      storage.removeItem(_storageKey);
    }, 300);
    return <Button {...buttonProps} className={classnames(styles.btn, buttonProps.className, counting ? styles.counting : '')} onClick={_handleClick} >
      {_content}{_loading}
      </Button>
  }, [loading, loadingText, text, count, retryText, counted, countNumber, onClick, buttonProps]);

  return _content;
}
