/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import Eligibility from 'src/routes/KcsPage/components/Eligibility';
import { customRender } from 'src/test/setup';

describe('test convetPage', () => {
  test('test Eligibility component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Eligibility levelConfig={{ color: '#fff', bgColor: '#000', scopeColor: '#0f0' }} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('4b30c257c4bd4000abf5')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
