/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { floatText } from 'Bot/helper';
import Decimal from 'decimal.js/decimal';
import { Div } from '../Widgets';

const GridBox = styled(Div)`
  display: grid;
  grid-template-columns: repeat(${({ num }) => num}, auto);
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
  &:hover, &.active {
    background-color: ${(props) => props.theme.colors.primary8};
    color: ${(props) => props.theme.colors.primary};
  }
`;
// 百分比
export default React.memo(({ percents = [], onGridChange, value, ...rest }) => {
  const handleClick = useCallback(
    (e) => {
      const percent = e.target.dataset.percent;
      onGridChange(Number(Decimal(percent).times(0.01).toFixed(2)));
    },
    [onGridChange],
  );
  return (
    <GridBox num={percents.length} {...rest}>
      {percents.map((per) => {
        return (
          <Grid key={per} data-percent={per} onClick={handleClick} className={+value === per ? 'active' : ''}>
            {floatText(per)}
          </Grid>
        );
      })}
    </GridBox>
  );
});
