/**
 * Owner: chris@kupotech.com
 */
import ThemeProvider from '@kux/mui/ThemeProvider';
import { useLocale } from '@kucoin-base/i18n';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { evtEmitter } from 'helper';
import Swiper, { SwiperWeb } from 'src/routes/KcsPage/components/Banner/Swiper';
import Context from 'src/routes/KcsPage/components/Context';
import { EVENT } from 'src/routes/KcsPage/config';
import { customRender } from 'src/test/setup';
const { getEvt } = evtEmitter;
const event = getEvt(EVENT);

jest.mock('src/components/LottieProvider', () => jest.fn(() => <div>MockComponent</div>));

describe('test convetPage', () => {
  test('test Swiper component', async () => {
    const fn = jest.fn();
    const { queryAllByText } = customRender(
      <ThemeProvider>
        <Swiper
          currentLevel={1}
          userLevel={1}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
          isLottieReady={true}
        />
      </ThemeProvider>,
    );
    event.emit('updateLevel', 2, { init: true });
    event.emit('updateLevel', 4);
    expect(queryAllByText('e00aa1c68b994000a66e')[0]).toBeInTheDocument();
  });

  test('test Swiper component level 4', async () => {
    const fn = jest.fn();
    const { queryAllByText } = customRender(
      <ThemeProvider>
        <Swiper
          currentLevel={4}
          userLevel={4}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
        />
      </ThemeProvider>,
    );
    expect(queryAllByText('bf0ae100edec4000a2dc')[0]).toBeInTheDocument();
  });

  test('test WEB Swiper component', async () => {
    const fn = jest.fn();
    const { getByText } = customRender(
      <ThemeProvider>
        <SwiperWeb
          currentLevel={1}
          userLevel={1}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
        />
      </ThemeProvider>,
    );
    expect(getByText('bf0ae100edec4000a2dc')).toBeInTheDocument();
  });

  test('test WEB Swiper component RTL', async () => {
    const fn = jest.fn();
    useLocale.mockReturnValue({ isRTL: true, currentLang: 'en' });
    const { getByText } = customRender(
      <ThemeProvider>
        <SwiperWeb
          currentLevel={1}
          userLevel={1}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
        />
      </ThemeProvider>,
    );
    expect(getByText('bf0ae100edec4000a2dc')).toBeInTheDocument();
  });

  test('test WEB Swiper component with none exists level', async () => {
    const fn = jest.fn();
    const { getByText } = customRender(
      <ThemeProvider>
        <SwiperWeb
          currentLevel={6}
          userLevel={8}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
        />
      </ThemeProvider>,
    );
  });

  test('test WEB Swiper component level 4', async () => {
    const fn = jest.fn();
    const { getByText } = customRender(
      <ThemeProvider>
        <SwiperWeb
          currentLevel={4}
          userLevel={4}
          updateLevel={fn}
          goUpgradeHandle={fn}
          upgradeHandle={fn}
        />
      </ThemeProvider>,
    );
    expect(getByText('c0b380143bc04000a828')).toBeInTheDocument();
  });

  test('test Swiper component level 4 isSm=false', async () => {
    const fn = jest.fn();
    const { queryAllByText } = customRender(
      <ThemeProvider>
        <Context.Provider value={{ isSm: false }}>
          <Swiper
            currentLevel={4}
            userLevel={4}
            updateLevel={fn}
            goUpgradeHandle={fn}
            upgradeHandle={fn}
          />
        </Context.Provider>
      </ThemeProvider>,
    );
    expect(queryAllByText('bf0ae100edec4000a2dc')[0]).toBeInTheDocument();
  });

  afterEach(cleanup);
});
