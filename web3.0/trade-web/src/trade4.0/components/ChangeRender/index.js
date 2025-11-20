/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { isNil } from 'lodash';
import styled from '@emotion/styled';
import { floadToPercent } from '@/utils/format';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';

const Root = styled.span`
  ${({ value, up, down, theme }) => {
    let color = theme.colors.text30;
    if (value > 0) {
      color = up;
    } else if (value < 0) {
      color = down;
    }
    return `color: ${color}`;
  }}
`;

const ChangeRender = React.memo(
  ({ value, changeValue, withPrefix, render, ...otherProps }) => {
    const priceChangeColor = usePriceChangeColor();
    const changeVal = +(isNil(changeValue) ? value : changeValue);

    // let prefix = null;
    // if (withPrefix && changeVal > 0) {
    //   prefix = '+';
    // }

    return (
      <Root value={changeVal} {...priceChangeColor} {...otherProps}>
        {/* {prefix} */}
        {render ? render(value) : floadToPercent(value, { isPositive: !!withPrefix })}
      </Root>
    );
  },
);

ChangeRender.defaultProps = {
  value: 0,
};

export default ChangeRender;
