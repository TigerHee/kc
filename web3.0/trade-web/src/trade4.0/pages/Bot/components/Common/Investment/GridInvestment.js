/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'dva';
import { floatText } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import Decimal from 'decimal.js/decimal';

const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-column-gap: 6px;
`;
const Grid = styled.span`
  font-size: 12px;
  border-radius: 6px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background-color: ${(props) => props.theme.colors.cover4};
  color: ${(props) => props.theme.colors.text40};
  transition: all 0.3s linear;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary8};
    color: ${(props) => props.theme.colors.primary};
  }
`;
// 百分比
const Percents = [25, 50, 75, 100];
export default React.memo(({ onGridChange, className }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const handleClick = useCallback(
    (e) => {
      if (!isLogin) {
        return;
      }
      const percent = e.target.dataset.percent;
      if (percent === 'min') {
        onGridChange(percent);
      } else {
        onGridChange(Number(Decimal(percent).times(0.01).toFixed(2)));
      }
    },
    [isLogin, onGridChange],
  );
  return (
    <GridBox className={className}>
      <Grid data-percent="min" onClick={handleClick}>
        {_t('gridwidget1')}
      </Grid>
      {Percents.map((per) => {
        return (
          <Grid key={per} data-percent={per} onClick={handleClick}>
            {floatText(per)}
          </Grid>
        );
      })}
    </GridBox>
  );
});
