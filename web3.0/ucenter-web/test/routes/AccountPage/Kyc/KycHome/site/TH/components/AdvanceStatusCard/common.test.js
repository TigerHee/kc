import { useTheme } from '@kux/mui';
import {
  RightImg,
  VerifiedImg,
} from 'src/routes/AccountPage/Kyc/KycHome/site/TH/components/AdvanceStatusCard/common.js';
import { customRender } from 'test/setup';

// Mock useTheme
jest.mock('@kux/mui', () => ({
  __esModule: true,
  ...jest.requireActual('@kux/mui'),
  useTheme: jest.fn(),
}));

describe('test RightImg', () => {
  test('renders RightImg in light mode', () => {
    useTheme.mockReturnValue({ currentTheme: 'light' });

    customRender(<RightImg />, {});
  });

  test('renders RightImg in dark mode', () => {
    useTheme.mockReturnValue({ currentTheme: 'dark' });

    customRender(<RightImg />, {});
  });
});

describe('test VerifiedImg', () => {
  test('renders VerifiedImg in light mode', () => {
    useTheme.mockReturnValue({ currentTheme: 'light' });

    customRender(<VerifiedImg />, {});
  });

  test('renders VerifiedImg in dark mode', () => {
    useTheme.mockReturnValue({ currentTheme: 'dark' });

    customRender(<VerifiedImg />, {});
  });
});
