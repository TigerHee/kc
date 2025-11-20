import {storage} from '@krn/toolkit';

import {queryClient} from 'config/queryClient';
import {QueryClientCacheController} from 'utils/query-client-cache-controller';

// Mock dependencies
jest.mock('@krn/toolkit', () => ({
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock('config/queryClient', () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

describe('query-client-cache-controller.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('QueryClientCacheController', () => {
    describe('resetQueriesByParentUid', () => {
      it('should clear cache when UID changes', async () => {
        storage.getItem.mockResolvedValueOnce('old-uid');

        await QueryClientCacheController.resetQueriesByParentUid('new-uid');

        expect(queryClient.clear).toHaveBeenCalled();
        expect(storage.setItem).toHaveBeenCalledWith(
          'CACHE_PARENT_UID',
          'new-uid',
        );
      });

      it('should not clear cache when UID remains the same', async () => {
        storage.getItem.mockResolvedValueOnce('same-uid');

        await QueryClientCacheController.resetQueriesByParentUid('same-uid');

        expect(queryClient.clear).not.toHaveBeenCalled();
        expect(storage.setItem).toHaveBeenCalledWith(
          'CACHE_PARENT_UID',
          'same-uid',
        );
      });

      it('should not clear cache when no previous UID exists', async () => {
        storage.getItem.mockResolvedValueOnce(null);

        await QueryClientCacheController.resetQueriesByParentUid('new-uid');

        expect(queryClient.clear).not.toHaveBeenCalled();
        expect(storage.setItem).toHaveBeenCalledWith(
          'CACHE_PARENT_UID',
          'new-uid',
        );
      });
    });

    describe('resetQueries', () => {
      it('should clear cache and reset UID when cache exists', async () => {
        storage.getItem.mockResolvedValueOnce('existing-uid');

        await QueryClientCacheController.resetQueries();

        expect(queryClient.clear).toHaveBeenCalled();
        expect(storage.setItem).toHaveBeenCalledWith('CACHE_PARENT_UID', '');
      });

      it('should not clear cache when no cache exists', async () => {
        storage.getItem.mockResolvedValueOnce(null);

        await QueryClientCacheController.resetQueries();

        expect(queryClient.clear).not.toHaveBeenCalled();
        expect(storage.setItem).not.toHaveBeenCalled();
      });
    });
  });
});
