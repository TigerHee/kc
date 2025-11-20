/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-05 17:19:54
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-01 17:15:19
 * @FilePath: /trade-web/_tests_/components/EnhanceIndiaComplianceTipWrap.test.js
 * @Description: 
 */
import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';

import { renderWithTheme } from "_tests_/test-setup";

import '@testing-library/jest-dom/extend-expect';

import { useToggle } from 'ahooks';

import EnhanceIndiaComplianceTipWrap, { TooltipContent } from 'src/trade4.0/pages/Orders/Common/OrderListCommon/EnhanceIndiaComplianceTipWrap.js';

jest.mock('ahooks', () => ({
  useToggle: jest.fn(),
}));

jest.mock('src/trade4.0/hooks/useIsH5', () => ({
  __esModule: true,

  default: jest.fn(),
}));

describe('EnhanceIndiaComplianceTipWrap', () => {
  it('renders without crashing', () => {
    useToggle.mockReturnValue([false, { toggle: jest.fn() }]);

    const { wrapper } = renderWithTheme(<EnhanceIndiaComplianceTipWrap taxRate={0.18} />);

    
    expect(wrapper).toBeTruthy();
  });

  it('opens the dialog when the info icon is clicked', () => {
    const mockToggle = jest.fn();

    useToggle.mockReturnValue([false, { toggle: mockToggle }]);

    const { wrapper } = renderWithTheme(<EnhanceIndiaComplianceTipWrap taxRate={0.18} />);

    expect(wrapper).toBeTruthy();
  });

  it('renders TooltipContent correctly', () => {
    const { wrapper } = renderWithTheme(<TooltipContent taxRate={0.18} />);

    expect(wrapper.getByText(/common_tax_tips/)).toBeInTheDocument();
  });
});
