import ScoreLarge from 'src/routes/AccountPage/Security/Score/components/ScoreLarge/index';
import { customRender } from 'test/setup';

jest.mock('lottie-web', () => {
  return {
    loadAnimation: jest.fn(() => ({
      destroy: jest.fn(),
      play: jest.fn(),
      stop: jest.fn(),
      setSpeed: jest.fn(),
    })),
  };
});

describe('test SecurityScore', () => {
  beforeEach(() => {
    global.__webpack_public_path__ = '';
    global.DEPLOY_PATH = '';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );
    jest.doMock('@kucoin-base/i18n', () => {
      return {
        __esModule: true,
        ...jest.requireActual('@kucoin-base/i18n'),
        basename: '',
        currentLang: 'en_US',
        useLocale: () => ({ isRTL: false }),
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test large page', () => {
    customRender(<ScoreLarge
      score={99}
      level="Low"
      list={[]}
      lottieName="security_score_low"
    />, {});
  });
});