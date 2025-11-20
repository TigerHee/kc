import React from 'react';
import { fireEvent } from '@testing-library/react';
import { useDispatch } from 'dva';
import ModuleTabs from 'src/trade4.0/components/ModuleTabs/index.js';
import { renderWithTheme } from '_tests_/test-setup';

jest.mock('dva', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('ModuleTabs', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render tabs and handle tab change', () => {
    const tabs = [
      {
        id: 'tab1',
        getComponent: () => 'Tab 1 content',
        renderName: () => 'Tab 1',
      },
      {
        id: 'tab2',
        getComponent: () => 'Tab 2 content',
        renderName: () => 'Tab 2',
      },
      {
        id: undefined,
        getComponent: () => '3',
        renderName: () => null,
      },
    ];

    const {
      wrapper: { getByText, queryByText },
    } = renderWithTheme(<ModuleTabs tabs={tabs} />);

    // Check that the first tab is active
    expect(getByText('Tab 1 content')).toBeInTheDocument();
    expect(queryByText('Tab 2 content')).not.toBeInTheDocument();

    // Click on the second tab
    fireEvent.click(getByText('Tab 2'));

    // Check that the second tab is now active
    expect(queryByText('Tab 1 content')).not.toBeInTheDocument();
    expect(getByText('Tab 2 content')).toBeInTheDocument();

    // Check that the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setting/updateInLayoutIdMap',
      payload: {
        tab1: 0,
        tab2: 1,
      },
    });
  });
});
