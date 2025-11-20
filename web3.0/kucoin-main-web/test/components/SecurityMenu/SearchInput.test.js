/**
 * Owner: larvide.peng@kupotech.com
 */
import React from 'react';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';
import SearchInput from 'src/components/SecurityMenu/SearchInput';
import history from '@kucoin-base/history';

jest.mock('@kux/mui', () => {
  const originalModule = jest.requireActual('@kux/mui');
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => {
      return {
        breakpoints: {
          down: jest.fn(),
        },
        colors: {
          icon: 'red',
        },
      };
    },
    useMediaQuery: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true),
  };
});
jest.mock('@kucoin-base/history', () => ({
  push: jest.fn(),
}));

describe('SearchInput Component', () => {
  const mockOnChangeArticleAnchor = jest.fn();
  const mockOnEnterHandler = jest.fn();
  const mockOnClearSearch = jest.fn();
  const mockUpdateInputValue = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SearchInput component', () => {
    customRender(
      <SearchInput
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onEnterHandler={mockOnEnterHandler}
        onClearSearch={mockOnClearSearch}
        updateInputValue={mockUpdateInputValue}
        onClose={mockOnClose}
        iconSize={20}
        isHomePage={true}
      />,
    );
    expect(screen.getByPlaceholderText('86fd144a90fa4000a7e5')).toBeInTheDocument();
  });

  test('calls updateInputValue on input change', () => {
    const historyPushMock = jest.fn(() => true);
    jest.spyOn(history, 'push').mockImplementation(historyPushMock);
    customRender(
      <SearchInput
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onEnterHandler={mockOnEnterHandler}
        onClearSearch={mockOnClearSearch}
        updateInputValue={mockUpdateInputValue}
        onClose={mockOnClose}
        iconSize={20}
      />,
    );
    const input = screen.getByPlaceholderText('86fd144a90fa4000a7e5');
    fireEvent.change(input, { target: { value: 'a' } });
    expect(mockUpdateInputValue).toHaveBeenCalledWith('a');
    expect(screen.queryAllByTestId('security_search_item')).not.toHaveLength(0);
    fireEvent.click(screen.queryAllByTestId('security_search_item')[0]);
    expect(mockOnChangeArticleAnchor).toBeCalledTimes(1);
    expect(historyPushMock).toBeCalledTimes(0);
  });

  test('calls onEnterHandler on Enter key press', () => {
    const historyPushMock = jest.fn(() => true);
    jest.spyOn(history, 'push').mockImplementation(historyPushMock);
    customRender(
      <SearchInput
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onEnterHandler={mockOnEnterHandler}
        onClearSearch={mockOnClearSearch}
        updateInputValue={mockUpdateInputValue}
        onClose={mockOnClose}
        iconSize={20}
        isHomePage={true}
      />,
    );
    const input = screen.getByPlaceholderText('86fd144a90fa4000a7e5');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockOnEnterHandler).toHaveBeenCalled();
    expect(mockOnClearSearch).toHaveBeenCalled();
    expect(historyPushMock).toBeCalledTimes(1);
  });

  test('renders filtered list based on input value', () => {
    customRender(
      <SearchInput
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onEnterHandler={mockOnEnterHandler}
        onClearSearch={mockOnClearSearch}
        updateInputValue={mockUpdateInputValue}
        onClose={mockOnClose}
        iconSize={20}
      />,
    );
    const input = screen.getByPlaceholderText('86fd144a90fa4000a7e5');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getAllByRole('dropdown')).not.toHaveLength(0);
  });
});
