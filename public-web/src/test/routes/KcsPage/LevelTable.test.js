/**
 * Owner: chris@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import LevelTable from 'src/routes/KcsPage/components/LevelTable';
import { customRender } from 'src/test/setup';

describe('test convetPage', () => {
  test('test LevelTable component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <LevelTable />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('40c706b1fa8a4000a643')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
