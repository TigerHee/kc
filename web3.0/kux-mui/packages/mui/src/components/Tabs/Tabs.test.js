import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent } from '../../../test/test-utils';
import Tabs from './index';
import Tab from '../Tab';

describe('Tabs component', () => {
  const { render } = createRender();

  it('renders Tabs component with default props', () => {
    render(<Tabs data-testid="yourTabsTestId" />);

    expect(screen.getByTestId('yourTabsTestId')).toBeInTheDocument();
  });

  it('renders Tabs with specific variant 1', () => {
    render(<Tabs variant="bordered" data-testid="yourStyledComponent" />);

    expect(screen.getByTestId('yourStyledComponent')).toHaveClass('KuxTabs-borderedContainer');
  });

  it('renders Tabs with specific variant 2', () => {
    render(<Tabs variant="line" data-testid="yourStyledComponent" />);

    expect(screen.getByTestId('yourStyledComponent')).toHaveClass('KuxTabs-lineContainer');
  });

  it('handles tab click and invokes onChange callback', () => {
    const mockOnChange = jest.fn();
    render(
      <Tabs onChange={mockOnChange}>
        <Tab value="1" data-testid="tab1">
          Tab 1
        </Tab>
        <Tab value="2" data-testid="tab2">
          Tab 2
        </Tab>
      </Tabs>,
    );

    fireEvent.click(screen.getByTestId('tab1'));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('applies correct class when tab is selected', () => {
    render(
      <Tabs value="2">
        <Tab value="1" data-testid="tab1">
          Tab 1
        </Tab>
        <Tab value="2" data-testid="tab2">
          Tab 2
        </Tab>
      </Tabs>,
    );

    expect(screen.getByTestId('tab2')).toHaveClass('KuxTab-selected');
    expect(screen.getByTestId('tab1')).not.toHaveClass('KuxTab-selected');
  });
});
