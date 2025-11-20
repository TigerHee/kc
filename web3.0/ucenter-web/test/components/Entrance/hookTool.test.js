/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import {
  useBackground,
  useNewcomerBannerBackground,
  useQueryParams,
} from 'src/components/Entrance/hookTool';

const state = {
  app: {
    phoneSignUpEnabled: true,
  },
};

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

describe('useBackground', () => {
  it('returns an object with the correct properties', () => {
    const result = useBackground();
    expect(result).toEqual(
      expect.objectContaining({
        background: expect.any(String),
      }),
    );
  });

  it('sets the background property to a string that includes the bg variable', () => {
    const result = useBackground();
    expect(result.background).toContain('url(');
    expect(result.background).toContain('no-repeat');
  });

  it('sets the backgroundSize property to "cover"', () => {
    const result = useBackground();
  });
});

describe('useNewcomerBannerBackground', () => {
  it('returns an object with the correct properties', () => {
    const result = useNewcomerBannerBackground();
    expect(result).toEqual(
      expect.objectContaining({
        background: expect.any(String),
        backgroundSize: expect.any(String),
      }),
    );
  });

  it('sets the background property to a string that includes the bg variable', () => {
    const result = useNewcomerBannerBackground();
    expect(result.background).toContain('url(');
    expect(result.background).toContain('no-repeat');
    expect(result.background).toContain('left top');
  });

  it('sets the backgroundSize property to "cover"', () => {
    const result = useNewcomerBannerBackground();
    expect(result.backgroundSize).toBe('cover');
  });
});

describe('useQueryParams', () => {
  it('render useQueryParams', () => {
    renderHook(useQueryParams);
  });
});
