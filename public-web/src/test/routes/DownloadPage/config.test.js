/**
 * Owner: John.Qi@kupotech.com
 */
import * as config from 'src/routes/DownloadPage/config';

describe('config', () => {
  test('test config', () => {
    expect(Object.keys(config).length).toBe(1);
  });

  test('downloadChannel', () => {
    expect(config.downloadChannel.apk).toBe('apk');
    expect(config.downloadChannel.googlePlay).toBe('googlePlay');
    expect(config.downloadChannel.appStore).toBe('appStore');
    expect(config.downloadChannel.qr).toBe('qr');
  });
});
