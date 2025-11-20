/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import About from 'src/routes/KcsPage/components/About';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useMediaQuery: jest.fn(),
}));

describe('test convetPage', () => {
  test('test FAQ component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <About />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('6952d26504264000a92a')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
