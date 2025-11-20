/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { Button, styled } from '@kux/mui';
import { ICLoadingOutlined } from '@kux/icons';
import noop from 'lodash/noop';

const ExtendButton = styled(Button)`
  height: auto;
  opacity: 1;
  /* margin-top: 16px !important; */
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.isCount ? props.theme.colors.text40 : props.theme.colors.primary)};
`;

const ExtendLoading = styled(ICLoadingOutlined)`
  color: ${(props) => props.theme.colors.primary};
  animation: rotate-ani 2s linear infinite;
  @keyframes rotate-ani {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * @param {onChange} function onChange 回调函数 默认 空函数
 * @param {disabled} Boolean 是否 disable 默认 true
 * @param {localTimeKey} string 本地的倒计时key
 * @param {countText} string 按钮的文字
 * @param {countLabel} string 倒计时的单位
 */
export default function SendCodeBtn(props = {}) {
  const {
    variant = 'contained',
    onChange = noop,
    disabled = true,
    loading = false,
    countTime,
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
    <ExtendButton
      {...other}
      onClick={handleSendCode}
      variant={variant}
      type="primary"
      disabled={Boolean(disabled) || Boolean(isCount)}
    >
      {loading ? (
        <ExtendLoading size="18" />
      ) : isCount ? (
        <Text isCount={isCount}>{`${countTime}${countLabel || null}`}</Text>
      ) : (
        <Text>{countText}</Text>
      )}
    </ExtendButton>
  );
}
