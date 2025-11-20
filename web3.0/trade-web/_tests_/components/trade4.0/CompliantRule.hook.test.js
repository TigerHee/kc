import { renderHook } from '@testing-library/react-hooks';
import { useDisplayRule } from '@/components/CompliantRule/hook';
import { getBrandSite } from '@/utils/brand';

const FUTURES_PNL_TAX = 'test';

jest.mock('@/utils/brand', () => ({
  getBrandSite: jest.fn(),
}));

describe('CompliantRule/hook useDisplayRule', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    window.resetMock();
  });
  it.each([
    {
      desc: 'normal not match ssg',
      mock: {
        brandSite: 'AA',
      },
      spm: FUTURES_PNL_TAX,
      expect: {
        displayRule: false,
      },
    },
    {
      desc: 'normal match ssg',
      mock: {
        brandSite: 'KC',
      },
      spm: FUTURES_PNL_TAX,
      expect: {
        displayRule: false,
      },
    },
    {
      desc: 'not match all',
      mock: {
        brandSite: 'AA',
        ua: '123',
      },
      spm: 'noMatch',
      expect: {
        displayRule: true,
      },
    },
    {
      desc: 'no spm',
      mock: {
        brandSite: 'TH',
      },
      spm: undefined,
      expect: {
        displayRule: false,
      },
    },
  ])(
    'test useDisplayRule -> $desc',
    ({ mock: { brandSite, ua = 'SSG_ENV' }, spm, expect: { displayRule } }) => {
      window.setMock('navigator');
      window.navigator.userAgent = ua;
      getBrandSite.mockReturnValue(brandSite);
      const { result: ret1 } = renderHook(() => useDisplayRule(spm));
      expect(ret1.current).toBe(displayRule);
    },
  );
});
