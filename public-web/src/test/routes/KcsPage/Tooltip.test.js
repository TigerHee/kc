/**
 * Owner: chris@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import Context from 'src/routes/KcsPage/components/Context.js';
import Tooltip from 'src/routes/KcsPage/components/Tooltip';
import { customRender } from 'src/test/setup';

describe('test Tooltip', () => {
  test('test Tooltip component with sm', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider value={{ isSm: true }}>
            <Tooltip title="tip">
              <div>Click</div>
            </Tooltip>
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('Click')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Click'));
    expect(await screen.findByText('tip')).toBeInTheDocument();
  });

  test('test Tooltip component with empty title string', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider value={{ isSm: true }}>
            <Tooltip title="">
              <div>Click</div>
            </Tooltip>
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(screen.queryByText('Click')).not.toBeInTheDocument();
  });

  test('test Tooltip component without title', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider value={{ isSm: true }}>
            <Tooltip>
              <div>Click</div>
            </Tooltip>
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(screen.queryByText('Click')).not.toBeInTheDocument();
  });

  test('test Tooltip component', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider value={{ isSm: false }}>
            <Tooltip title="tip">
              <div>Click</div>
            </Tooltip>
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('Click')).toBeInTheDocument();
    fireEvent.mouseOver(screen.getByText('Click'));
    expect(await screen.findByText('tip')).toBeInTheDocument();
  });

  test('test Tooltip component title', async () => {
    act(() => {
      customRender(
        <ThemeProvider>
          <Context.Provider value={{ isSm: false }}>
            <Tooltip>
              <div>Click</div>
            </Tooltip>
          </Context.Provider>
        </ThemeProvider>,
      );
    });
    expect(screen.queryByText('Click')).toBeNull();
  });

  afterEach(cleanup);
});
