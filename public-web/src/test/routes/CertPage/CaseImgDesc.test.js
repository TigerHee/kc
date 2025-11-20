/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import CaseImgDesc from 'src/routes/CertPage/CaseImgDesc';
import { customRender } from 'src/test/setup';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useMediaQuery: jest.fn(),
}));

describe('test CertPage', () => {
  test('test CaseImgDesc component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <CaseImgDesc />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('7825252898794000adea')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
