/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import noop from 'lodash/noop';
import { Input } from '@kufox/mui';
import { css } from '@emotion/react';
import SendCodeBtn from '../SendCodeBtn';
import { useLang } from '../../hookTool';

const useStyles = () => {
  return {
    root: css`
      display: 'flex';
    `,
    input: css`
      display: 'flex';
      flex: 'auto';
    `,
    sendCodeBtnBox: css`
      position: 'absolute';
      right: 0;
      top: -4px;
    `,
    sendCodeBtn: css`
      min-width: '100px';
    `,
  };
};

export default function TextFieldSendCode(props = {}) {
  const {
    onChange = noop,
    onSendCode = noop,
    countTimeOver = noop,
    disabled,
    countTime = 30,
    loading,
    value,
    size = 'large',
    label,
  } = props;

  const classes = useStyles();
  const { t } = useLang();

  const handleSendCode = async () => {
    if (loading) return;
    onSendCode();
  };

  return (
    <div css={classes.root}>
      <Input
        value={value}
        variant="standard"
        css={classes.input}
        onChange={onChange}
        size={size}
        label={label}
        suffix={
          <div css={classes.sendCodeBtnBox}>
            <SendCodeBtn
              variant="text"
              css={classes.sendCodeBtn}
              loading={loading}
              disabled={disabled}
              onChange={handleSendCode}
              countTime={countTime}
              countTimeOver={countTimeOver}
              countText={t('send')}
              size={size}
            />
          </div>
        }
      />
    </div>
  );
}
