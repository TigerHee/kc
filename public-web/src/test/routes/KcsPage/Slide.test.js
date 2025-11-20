/**
 * Owner: chris@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import '@testing-library/jest-dom';
import { act, cleanup, screen } from '@testing-library/react';
import Slide, { HeaderSlide, WebBannerSlide } from 'src/routes/KcsPage/components/Slide';
import { customRender } from 'src/test/setup';

describe('test slide', () => {
  test('test slide', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <Slide currentLevel={1} userLevel={1} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('809aa3a4b0344000a315')).toBeInTheDocument();
  });

  test('test slide', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <Slide currentLevel={4} userLevel={4} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('809aa3a4b0344000a315')).toBeInTheDocument();
  });

  test('test slide', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <Slide currentLevel={3} userLevel={4} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('0acace9fd4634000adcd')).toBeInTheDocument();
  });

  test('test HeaderSlide', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <HeaderSlide currentLevel={1} userLevel={1} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('K1')).toBeInTheDocument();
  });

  test('test WebBannerSlide', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <WebBannerSlide currentLevel={1} userLevel={1} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('K1')).toBeInTheDocument();
  });

  test('test WebBannerSlide userLevel >= currentLevel', async () => {
    const fn = jest.fn();
    act(() => {
      customRender(
        <ThemeProvider>
          <WebBannerSlide currentLevel={2} userLevel={3} levelConfig={{}} updateLevel={fn} />
        </ThemeProvider>,
      );
    });
    expect(await screen.findByText('K2')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
