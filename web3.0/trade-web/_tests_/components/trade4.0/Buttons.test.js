import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import { renderWithTheme } from '_tests_/test-setup';
import '@testing-library/jest-dom';
import Buttons from 'src/trade4.0/pages/Assets/components/Buttons/index.js';

afterEach(cleanup);

describe('Buttons', () => {
  it('renders buttons list correctly', () => {
    renderWithTheme(<Buttons />);
    expect(screen.getByText('margin.borrow')).toBeInTheDocument();
    expect(screen.getByText('margin.repay')).toBeInTheDocument();
    expect(screen.getByText('transfer.s')).toBeInTheDocument();
  });
});
