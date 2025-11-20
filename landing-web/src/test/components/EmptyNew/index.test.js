/*
 * Owner: herin.yao@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';

import EmptyNew from 'components/EmptyNew';

describe('test EmptyNew', () => {
  it.skip('with description and subDescription', () => {
    const { container } = render(<EmptyNew className="test" description="description" subDescription="subDescription" img="/test.png" />);
    expect(container.querySelector('.test')).not.toBeNull();
    expect(container.querySelector('.Ku_land_empty_description')).not.toBeNull();
    expect(container.querySelector('.Ku_land_empty_sub_description')).not.toBeNull();
  });

  it.skip('without description and subDescription', () => {
    const { container } = render(<EmptyNew className="test" img="/test.png" />);
    expect(container.querySelector('.test')).not.toBeNull();
    expect(container.querySelector('.Ku_land_empty_description')).toBeNull();
    expect(container.querySelector('.Ku_land_empty_sub_description')).toBeNull();
  });
});
