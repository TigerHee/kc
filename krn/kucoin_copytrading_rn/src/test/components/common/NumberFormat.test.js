import React from 'react';

import NumberFormat from 'components/Common/NumberFormat';
import {customRender as render} from '../../setup';

describe('NumberFormat', () => {
  it('formats number correctly', () => {
    const {getByText} = render(<NumberFormat>1234.56</NumberFormat>);
    expect(getByText(/1,234.56/)).toBeTruthy();
  });

  it('supports isProfitNumber', () => {
    const {getByText} = render(
      <NumberFormat isProfitNumber>{123.45}</NumberFormat>,
    );
    expect(getByText(/123/)).toBeTruthy();
  });

  it('supports beforeText and afterText', () => {
    const {getByText} = render(
      <NumberFormat beforeText="$" afterText=" USDT">
        123.45
      </NumberFormat>,
    );
    expect(getByText(/\$123.45 USDT/)).toBeTruthy();
  });
});
