/**
 * Owner: ella.wang@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import Right from 'src/routes/KcsPage/components/Right';
import { customRender } from 'src/test/setup';

describe('test convetPage', () => {
  test('test FAQ component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Right />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('ce88dba37bb24000a558')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
