/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { _t } from 'Bot/utils/lang';
import { Div } from '../Widgets';

const Box = styled(Div)`
  height: 30px;
  border-radius: 80px;
  background-color: ${({ theme }) => theme.colors.cover4};
  position: relative;
  display: flex;
  overflow: hidden;
`;
const Text = styled.span`
  flex: 1;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  display: flex;
  border-radius: 80px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${({ theme, value, name }) => {
    if (value === name) {
      if (name === 'long') {
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.textEmphasis,
        };
      }
      if (name === 'short') {
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.textEmphasis,
        };
      }
    }
    return {
      color: theme.colors.text60,
    };
  }}
`;
/**
 * @description: 做多/做空按钮
 * @return {*}
 */
export default React.memo(({ value, onChange, ...rest }) => {
  const onChangeJack = (dir) => {
    if (dir !== value) {
      onChange(dir);
    }
  };
  return (
    <Box mt={8} mb={10} {...rest}>
      <Text value={value} name="long" onClick={() => onChangeJack('long')}>
        {_t('futrgrid.zuoduo')}
      </Text>
      <Text value={value} name="short" onClick={() => onChangeJack('short')}>
        {_t('futrgrid.zuokong')}
      </Text>
    </Box>
  );
});
