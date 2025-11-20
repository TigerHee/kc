import {showToast} from '@krn/bridge';

import {queryClient} from 'config/queryClient';
import onError from 'utils/showError';

// Mock dependencies
jest.mock('@krn/bridge', () => ({
  showToast: jest.fn(),
}));

jest.mock('config/queryClient', () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

describe('showError.js', () => {
  let mockDispatch;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockDispatch = jest.fn();
  });

  describe('onError', () => {
    it('should handle 401 unauthorized error', () => {
      const error = {code: '401'};
      onError(error, mockDispatch);

      // Should dispatch app/update with isLogin false
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'app/update',
        payload: {isLogin: false, userInfo: null},
      });

      // Should dispatch leadInfo/update
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'leadInfo/update',
        payload: {isLeadTrader: false, activeLeadSubAccountInfo: null},
      });

      // Should clear query client cache
      expect(queryClient.clear).toHaveBeenCalled();

      // Should not show toast for 401
      expect(showToast).not.toHaveBeenCalled();
    });

    it('should show toast for non-401 errors with message', () => {
      const error = {msg: 'Test error message'};
      onError(error, mockDispatch);

      expect(showToast).toHaveBeenCalledWith('Test error message');
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(queryClient.clear).not.toHaveBeenCalled();
    });

    it('should handle errors without message', () => {
      const error = {code: '500'};
      onError(error, mockDispatch);

      expect(showToast).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(queryClient.clear).not.toHaveBeenCalled();
    });

    it('should handle null/undefined error', () => {
      onError(null, mockDispatch);

      expect(showToast).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(queryClient.clear).not.toHaveBeenCalled();
    });
  });
});
