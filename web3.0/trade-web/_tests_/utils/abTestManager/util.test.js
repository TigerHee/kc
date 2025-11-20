import { makeTaskABTestResultByFetch, convertPromiseRespTask } from 'src/utils/abTestManager/util';

// makeTaskABTestResultByFetch 测试
describe('makeTaskABTestResultByFetch', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should reject if abTestKey is not provided', async () => {
    await expect(
      makeTaskABTestResultByFetch(null, () => Promise.resolve()),
    ).rejects.toBeUndefined();
  });

  it('should reject if promiseFetchFnc is not a function', async () => {
    await expect(makeTaskABTestResultByFetch('key', null)).rejects.toBeUndefined();
  });

  it('should resolve with correct data', async () => {
    const mockFetch = jest.fn().mockResolvedValue('mockData');
    await expect(makeTaskABTestResultByFetch('key', mockFetch)).resolves.toEqual({
      key: 'mockData',
    });
  });

  it('should reject if promiseFetchFnc throws an error', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('fetch error'));
    const abTestKey = 'testKey';

    await expect(makeTaskABTestResultByFetch('someKey', mockFetch)).rejects.toBeUndefined();
  });
});

describe('convertPromiseRespTask', () => {
  it('should aggregate fulfilled promises into a single object', () => {
    const promisedResults = [
      { status: 'fulfilled', value: { a: 1 } },
      { status: 'fulfilled', value: { b: 2 } },
      { status: 'rejected', reason: 'error' }, // This should be ignored
    ];
    expect(convertPromiseRespTask(promisedResults)).toEqual({ a: 1, b: 2 });
  });

  it('should return an empty object if no promises are fulfilled', () => {
    const promisedResults = [
      { status: 'rejected', reason: 'error1' },
      { status: 'rejected', reason: 'error2' },
    ];
    expect(convertPromiseRespTask(promisedResults)).toEqual({});
  });
});
