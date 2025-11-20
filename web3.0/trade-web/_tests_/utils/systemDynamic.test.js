import systemDynamic from 'src/utils/systemDynamic';
import { renderWithTheme } from '_tests_/test-setup';
import React from 'react';

describe('systemDynamic', () => {
  test('test dynamic', () => {
    const Index = systemDynamic('@remote/entrance', 'Index');
    const {
      wrapper: { asFragment },
    } = renderWithTheme(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});
