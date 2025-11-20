/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import Staking from 'src/routes/KcsPage/components/Staking';
import { customRender } from 'src/test/setup';

// jest.mock('src/hooks/useTouch.js', () => jest.fn());
jest.mock('src/hooks/useTouch', () =>
  jest.fn(() => {
    return {
      default: () => {},
    };
  }),
);

jest.mock('src/components/BaseDrawer', () => jest.fn(() => null));

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useMediaQuery: jest.fn(),
    useSnackbar: () => {
      return {
        message: {
          success: () => {},
        },
      };
    },
  };
});

describe('test convetPage', () => {
  test('test Staking component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Staking
            userLevel={1}
            currentLevel={1}
            isSm={true}
            overview={{
              lock_amount: 12,
              demand_apr: '12',
            }}
            totalKcs={100}
          />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('b7abfc6b61504000a62f')).toBeInTheDocument();
  });

  test('test level 0', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Staking
            userLevel={0}
            currentLevel={0}
            isSm={true}
            isLogin={true}
            overview={{
              lock_amount: 12,
              demand_apr: '12',
            }}
            totalKcs={100}
          />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('b7abfc6b61504000a62f')).toBeInTheDocument();
  });

  test('test Staking sm component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Staking
            userLevel={1}
            currentLevel={1}
            isSm={false}
            isLogin={true}
            overview={{
              lock_amount: 12,
              demand_apr: '12',
              income_release_amount: '12',
            }}
            totalKcs={100}
          />
        </ThemeProvider>,
        {
          user: {
            user: {},
          },
        },
      );
    });
    expect(await screen.findByText('b7abfc6b61504000a62f')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
