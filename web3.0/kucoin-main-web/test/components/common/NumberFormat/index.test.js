import React from 'react';
import { customRender } from 'test/setup';
import NumberFormat from 'src/components/common/NumberFormat';

describe('NumberFormat', () => {
  it('renders number', () => {
    const { container } = customRender(
      <NumberFormat
        options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      >
        12
      </NumberFormat>,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
