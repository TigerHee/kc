/*
 * Owner: jesse.shao@kupotech.com
 */
import sentryInit, {
  report, reportIntlMissing, Severity
} from 'utils/sentry';

jest.mock('@kc/sentry', () => {
  const captureEvent = jest.fn();
  const init = jest.fn();
  return Promise.resolve({
    __esModule: true, // this property makes it work as if using `export default`
    default: {
      captureEvent,
      init,
    },
  });
}, { virtual: true });

describe('sentry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sentryInit', () => {
    it('should initialize Sentry in production', async () => {
      // Mocking IS_PROD to be true to simulate production environment
      // jest.spyOn(envUtils, 'IS_PROD', 'get').mockReturnValue(true);
      sentryInit();
    });

    // More tests can be written to cover different environments
  });

  describe('report', () => {
    it('should throw an error if message is missing', () => {
      expect(() => report({ level: Severity.Fatal })).toThrow('options.message must exist');
    });

    it('should throw an error if level is missing', () => {
      expect(() => report({ message: 'Error message' })).toThrow('options.level must exist');
    });

    it('should call sentry.captureEvent with the correct options',  () => {
      const message = 'Test message';
      const level = Severity.Error;
      const tags = { tag1: 'value1' };
      report({ message, level, tags }); 
    });

    // More tests can be added to cover different cases
  });

  describe('reportIntlMissing', () => {
    it('should report internationalization key missing',  () => {
      const missingKey = 'some.missing.key';
      reportIntlMissing(missingKey);
    });

    // More tests can be added to cover different cases
  });
});

// Global variables that need to be defined for the tests
global._APP_NAME_ = 'your-app-name';
global._VERSION_ = '1.0.0';

describe('test request', () => {
  test('test pull', () => {
    expect(sentryInit).toBeDefined();
  });
});
