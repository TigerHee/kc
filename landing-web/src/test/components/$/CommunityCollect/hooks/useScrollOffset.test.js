/**
 * Owner: lucas.l.lu@kupotech.com
 */
import * as hooks from '@kux/mui/hooks';
import { useScrollOffset } from 'components/$/CommunityCollect/hooks/useScrollOffset';

jest.mock('@kux/mui/hooks', () => {
  const originalModule = jest.requireActual('@kux/mui/hooks');

  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('useScrollOffset', () => {
  it('should be default return ok', () => {
    jest.spyOn(hooks, 'useMediaQuery').mockReturnValue(false);

    const result = useScrollOffset();
    expect(result).toEqual(-170);
  });

  it('should be down1439 return ok', () => {
    jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === '1439px',
        },
      });
    });

    const result = useScrollOffset();
    expect(result).toEqual(-154);
  });

  it('should be downSm return ok', () => {
    jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === 'sm',
        },
      });
    });

    const result = useScrollOffset();
    expect(result).toEqual(-83);
  });

  it('顶飘的场景，不在 app，ok', () => {
    const r = jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === 'sm',
        },
      });
    });

    const result = useScrollOffset({
      isInApp: false,
      enableRestrictNotice: true,
      restrictNoticeHeight: 40,
    });
    expect(result).toEqual(-39 - 44 - 40);
    r.mockClear();

    const r2 = jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === '1439px',
        },
      });
    });

    const result2 = useScrollOffset({
      isInApp: false,
      enableRestrictNotice: true,
      restrictNoticeHeight: 40,
    });
    expect(result2).toEqual(-194);
  });

  it('顶飘的场景，在 app，ok', () => {
    const r = jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === 'sm',
        },
      });
    });

    const result = useScrollOffset({
      isInApp: true,
      enableRestrictNotice: false,
      restrictNoticeHeight: 40,
    });
    expect(result).toEqual(-39);
    r.mockClear();

    const r2 = jest.spyOn(hooks, 'useMediaQuery').mockImplementation((fn) => {
      return fn({
        breakpoints: {
          down: (px) => px === '1439px',
        },
      });
    });

    const result2 = useScrollOffset({
      isInApp: true,
      enableRestrictNotice: true,
      restrictNoticeHeight: 40,
    });
    expect(result2).toEqual(-194);
  });
})
;
