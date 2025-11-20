import loadScript from 'src/utils/loadScript';

test('test loadScript', () => {
  expect(loadScript()).resolves.toBe();
  expect(loadScript('', { async: true, text: 'text' })).resolves.toBe();
});
