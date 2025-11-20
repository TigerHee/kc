/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { Button, IButtonProps } from '@kux/design';
import { LoadingSmallIcon } from '@kux/iconpack';
import noop from 'lodash-es/noop';
import styles from './styles.module.scss';
import clsx from 'clsx';

interface Props {
  onChange?: typeof noop;
  countTime?: number;
  countText?: string;
  countLabel?: string;
}

/**
 * @param {onChange} function onChange 回调函数 默认 空函数
 * @param {disabled} Boolean 是否 disable 默认 true
 * @param {localTimeKey} string 本地的倒计时key
 * @param {countText} string 按钮的文字
 * @param {countLabel} string 倒计时的单位
 */
export default function SendCodeBtn(props: Omit<IButtonProps, 'children'> & Props = {}) {
  const {
    onChange = noop,
    disabled = true,
    loading = false,
    countTime = 0,
    countText,
    countLabel = 's',
    ...other
  } = props;

  const isCount = useMemo(() => countTime > 0, [countTime]);

  const handleSendCode = (e) => {
    // 防止触发父级的的规则校验
    e?.preventDefault();
    e?.stopPropagation();
    onChange();
  };
  return (
    <Button
      className={styles.btn}
      onClick={handleSendCode}
      type="text"
      disabled={Boolean(disabled) || Boolean(isCount)}
      {...other}
    >
      {loading ? (
        <LoadingSmallIcon className={styles.loadingIcon} size={18} />
      ) : isCount ? (
        <span className={clsx(styles.text, styles.isCount)}>{`${countTime}${countLabel || ''}`}</span>
      ) : (
        <span className={styles.text}>{countText}</span>
      )}
    </Button>
  );
}
