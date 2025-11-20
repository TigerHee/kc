/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Box, styled } from '@kux/mui';
import noop from 'lodash/noop';
import InputPwdBox from '../InputPwdBox';
import SendCodeBtn from '../SendCodeBtn';
import { useLang } from '../../hookTool';

const Wrapper = styled(Box)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 375px;
    margin: 0 auto;
  }
`;

function InputSendCode(props = {}) {
  const {
    onChange = noop,
    onSendCode = noop,
    countTimeOver = noop,
    onUpdateCountTime = noop,
    disabled,
    countTime,
    loading,
    size = 'large',
    value,
  } = props;

  const { t } = useLang();

  const handleSendCode = async () => {
    if (loading) return;
    onSendCode();
  };

  const handleItemPwd = (e) => {
    const val = e.target ? e.target.value : e;
    if (val.length > 6) {
      return;
    }
    onChange(val);
  };

  return (
    <Wrapper display="flex" alignItems="flex-end" flexDirection="column" style={{ width: '100%' }}>
      <Box style={{ width: '100%' }}>
        <InputPwdBox type="text" onChange={handleItemPwd} value={value} />
      </Box>
      <SendCodeBtn
        style={{ flexShrink: 0 }}
        loading={loading}
        disabled={disabled}
        onChange={handleSendCode}
        countTime={countTime}
        countTimeOver={countTimeOver}
        countText={t('send')}
        size={size}
        variant="text"
        onUpdateCountTime={onUpdateCountTime}
      />
    </Wrapper>
  );
}
export default InputSendCode;
