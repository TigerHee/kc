import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@kux/mui';
import useSecurityGuard from 'src/hooks/security/useSecurityGuard';
import { LEVEL_ENUMS } from 'src/constants/security/score';

// Mock dependencies
jest.mock('src/utils/storage');
jest.mock('src/utils/router');
jest.mock('utils/ga');

const mockTheme = {
  colors: {
    primary: '#1199FA',
    complementary: '#F5A623',
    icon: '#808A9D'
  }
};

const mockStore = {
  getState: () => ({
    user: {
      user: {
        uid: 'test-uid'
      }
    },
    securityGuard: {
      cacheResult: {
        level: LEVEL_ENUMS.HIGH
      }
    }
  }),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

const wrapper = ({ children }) => (
  <Provider store={mockStore}>
    <ThemeProvider theme={mockTheme}>
      {children}
    </ThemeProvider>
  </Provider>
);

describe('useSecurityGuard', () => {
  beforeEach(() => {
    window._SITE_CONFIG_ = {
      functions: {
        security_guard: true
      }
    };
    jest.clearAllMocks();
  });

  it('should not fetch data when security guard is disabled', () => {
    window._SITE_CONFIG_.functions.security_guard = false;
    
    renderHook(() => useSecurityGuard(), { wrapper });
    
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});