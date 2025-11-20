import { METHOD_INFOS } from 'src/routes/AccountPage/Security/Score/constants';

Object.keys(METHOD_INFOS).forEach(key => {
  test(`test METHOD_INFOS.${key}`, () => {
    const obj = METHOD_INFOS[key];
    expect(obj.hasOwnProperty('name')).toBe(true);
    expect(obj.name()).toBeTruthy();
    expect(obj.hasOwnProperty('desc')).toBe(true);
    expect(obj.desc()).toBeTruthy();
    expect(obj.webUrl).toBeTruthy();
    expect(obj.appUrl).toBeTruthy();
    if (obj.checkDeviceSupport) {
      expect(obj.hasOwnProperty('noSupportedTitle')).toBe(true);
      expect(obj.noSupportedTitle()).toBeTruthy();
      expect(obj.hasOwnProperty('noSupportedDesc')).toBe(true);
      expect(obj.noSupportedDesc()).toBeTruthy();
    }
  })
})