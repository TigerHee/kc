/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import Header from 'src/components/Premarket/containers/Header.js';
import { customRender } from 'src/test/setup';
const { useSelector } = require('src/hooks/useSelector');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ goBack: jest.fn() })),
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => 'light'),
  };
});

describe('test Header', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  test('test Header with pc', async () => {
    const { result } = customRender(<Header>Header</Header>, {});
    expect(result).toBe();
  });

  test('renders correctly', () => {
    isApp.mockReturnValue(true);
    useHistory.mockReturnValue({ goBack: jest.fn() });
    customRender(
      <Header theme="dark" showMyOrder={true} showMore={true}>
        Header
      </Header>,
      {},
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  test('test Header with h5', async () => {
    isApp.mockReturnValue(true);
    useHistory.mockReturnValue({ goBack: jest.fn() });
    customRender(
      <Header theme="dark" showMyOrder={true} showMore={true}>
        Header
      </Header>,
      {},
    );

    const buttons = document.querySelectorAll('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[2]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });

  test('test Header with h5 args not default', async () => {
    isApp.mockReturnValue(false);
    useHistory.mockReturnValue({ goBack: jest.fn() });
    customRender(<Header showMyOrder={false}>Header</Header>, { user: { user: {} } });
  });

  test('test Header with erroe', async () => {
    isApp.mockReturnValue(false);
    useHistory.mockReturnValue({ goBack: undefined });
    customRender(<Header showMyOrder={false}>Header</Header>, { user: { user: {} } });
  });
});
