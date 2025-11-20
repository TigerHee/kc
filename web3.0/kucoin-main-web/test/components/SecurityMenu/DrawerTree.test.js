/**
 * Owner: larvide.peng@kupotech.com
 */
import React from 'react';
import history from '@kucoin-base/history';
import DrawerTree from 'src/components/SecurityMenu/DrawerTree.js';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('@kux/mui', () => {
  const originalModule = jest.requireActual('@kux/mui');
  return {
    __esModule: true,
    ...originalModule,
    useTheme: () => {
      return {
        colors: {
          icon: 'red',
          primary: 'blue',
          layer: 'green',
          text: '#ffffff',
          text20: '#ffffff',
          text60: '#ffffff',
          cover2: 'red',
          divider80: 'red',
        },
      };
    },
    useMediaQuery: jest.fn(() => true),
  };
});
jest.mock('@kucoin-base/history', () => ({
  push: jest.fn(),
}));

describe('DrawerTree Component', () => {
  const mockOnClose = jest.fn();
  const mockOnChangeArticleAnchor = jest.fn();
  const mockOnSerch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders DrawerTree component', () => {
    customRender(
      <DrawerTree
        show={true}
        onClose={mockOnClose}
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onSerch={mockOnSerch}
      />,
    );
    expect(screen.getByText('eea697de6c2b4000a2c9')).toBeInTheDocument();
  });

  test('renders search input', () => {
    customRender(
      <DrawerTree
        isHomePage={true}
        show={true}
        onClose={mockOnClose}
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onSerch={mockOnSerch}
      />,
    );
    expect(screen.getByPlaceholderText('86fd144a90fa4000a7e5')).toBeInTheDocument();
  });

  test('calls onChangeArticleAnchor when an article is selected in mobile view', () => {
    const { getByTestId } = customRender(
      <DrawerTree
        isHomePage={false}
        show={true}
        onClose={mockOnClose}
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onSerch={mockOnSerch}
      />,
    );
    const input = screen.getByPlaceholderText('86fd144a90fa4000a7e5');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(getByTestId('search_button'));
    expect(mockOnSerch).toBeCalledTimes(1);
    const listItem = screen.getByText('6466d82f9d854000a50f');
    fireEvent.click(listItem);
    expect(screen.getByTestId('security_sm_cancel_button')).toBeInTheDocument();
  });

  test('renders filtered list based on input value', () => {
    const historyPushMock = jest.fn(() => true);
    jest.spyOn(history, 'push').mockImplementation(historyPushMock);
    const { getByTestId } = customRender(
      <DrawerTree
        isHomePage={true}
        show={true}
        onClose={mockOnClose}
        onChangeArticleAnchor={mockOnChangeArticleAnchor}
        onSerch={mockOnSerch}
      />,
    );
    const input = screen.getByPlaceholderText('86fd144a90fa4000a7e5');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(getByTestId('search_button'));
    expect(historyPushMock).toHaveBeenCalled();
    expect(screen.getByText('fc5a3212ae234000a1cc')).toBeInTheDocument();
  });

  test('test SecurityMenu DrawerTree', () => {
    const handleClose = jest.fn();
    const show = false;
    const onChangeArticleAnchor = jest.fn();
    const onSerch = jest.fn();
    const { container } = customRender(
      <DrawerTree
        isHomePage={false}
        show={show}
        onClose={handleClose}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('test SecurityMenu DrawerTree', () => {
    const handleClose = jest.fn();
    const onChangeArticleAnchor = jest.fn();
    const onSerch = jest.fn();
    const { container, rerender } = customRender(
      <DrawerTree
        isHomePage={false}
        show={false}
        onClose={handleClose}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <DrawerTree
        isHomePage={false}
        show={true}
        onClose={handleClose}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
      />,
    );
  });

  test('test SecurityMenu DrawerTree', () => {
    const handleClose = jest.fn();
    const onChangeArticleAnchor = jest.fn();
    const onSerch = jest.fn();
    const { queryAllByPlaceholderText } = customRender(
      <DrawerTree
        isHomePage={false}
        show={false}
        onClose={handleClose}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
      />,
    );
    expect(queryAllByPlaceholderText('86fd144a90fa4000a7e5')).toHaveLength(0);
  });

  test('test SecurityMenu DrawerTree', () => {
    jest.mock('@kux/mui', () => {
      const originalModule = jest.requireActual('@kux/mui');
      return {
        __esModule: true,
        ...originalModule,
        useTheme: () => {
          return {
            colors: {
              icon: 'red',
              primary: 'blue',
              layer: 'green',
              text: '#ffffff',
              text20: '#ffffff',
              text60: '#ffffff',
              cover2: 'red',
              divider80: 'red',
            },
          };
        },
        useMediaQuery: jest.fn(() => false),
      };
    });
    const handleClose = jest.fn();
    const onChangeArticleAnchor = jest.fn();
    const onSerch = jest.fn();
    const { queryAllByTestId } = customRender(
      <DrawerTree
        isHomePage={false}
        show={true}
        onClose={handleClose}
        onChangeArticleAnchor={onChangeArticleAnchor}
        onSerch={onSerch}
        onEnterHandler={jest.fn()}
      />,
    );
    expect(queryAllByTestId('search_button')).toHaveLength(1);
    expect(onChangeArticleAnchor).toBeCalledTimes(0);
  });
});
