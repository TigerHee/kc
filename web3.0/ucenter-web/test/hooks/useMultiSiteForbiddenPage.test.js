import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { push } from 'src/utils/router';

jest.mock('@kucoin-gbiz-next/hooks');

jest.mock('src/utils/router', () => ({
  push: jest.fn(),
}));

const TestComponent = () => {
  return <div>Test</div>;
};

describe('withMultiSiteForbiddenPage', () => {
  const mockUseMultiSiteConfig = {
    multiSiteConfig: {
      module1: {
        key1: true,
        key2: false,
      },
    },
  };

  beforeEach(() => {
    useMultiSiteConfig.mockReturnValue(mockUseMultiSiteConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect if config key is not allowed', () => {
    renderHook(() => withMultiSiteForbiddenPage(<TestComponent />, 'module1', 'key2', '/back'));

    waitFor(() => expect(push).toHaveBeenCalledWith('/back'));
  });

  it('should not redirect if config key is allowed', () => {
    renderHook(() => withMultiSiteForbiddenPage(<TestComponent />, 'module1', 'key1', '/back'));

    waitFor(() => expect(push).not.toHaveBeenCalled());
  });
});
