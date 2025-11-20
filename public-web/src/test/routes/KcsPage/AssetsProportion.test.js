/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import AssetsProportion from 'src/routes/KcsPage/components/Banner/AssetsProportion';
import Context from 'src/routes/KcsPage/components/Context.js';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useMediaQuery: jest.fn(),
}));

describe('test AssetsProportion', () => {
  test('test AssetsProportion component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider
            value={{ isSm: true, overview: { kcs_assets_ratio: 1, lock_amount_hour: 2 } }}
          >
            <AssetsProportion />
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('ebee8d20ab8a4000aad3')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
