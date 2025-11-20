import {
  checkIsAllComplete,
  getCurrentCardOrderIndex,
  getCurrentCardOrderNumber,
  getFormatCommonError,
  getLastCardStatus,
  getOneClickPromiseList,
  getOneClickWrapperPromise,
  getStatus,
  isDone,
} from 'src/routes/AccountPage/Transfer/components/OneClickProcess/utils';

jest.mock('src/services/user_transfer');
jest.mock('src/tools/i18n');
jest.mock('src/routes/AccountPage/Transfer/components/OneClickProcess/constants');

describe('isDone', () => {
  it('should expose a function', () => {
    expect(isDone(null)).toBe(false);
    expect(isDone({})).toBe(true);
    expect(isDone({ a: [1, 2, 3] })).toBe(false);
  });
});
describe('getStatus', () => {
  it('should expose a function', () => {
    expect(getStatus).toBeDefined();
  });
});
describe('getFormatCommonError', () => {
  it('should expose a function', () => {
    expect(getFormatCommonError).toBeDefined();
  });
});
describe('getOneClickWrapperPromise', () => {
  it('should expose a function', () => {
    expect(getOneClickWrapperPromise).toBeDefined();
  });
});
describe('getOneClickPromiseList', () => {
  it('should expose a function', () => {
    expect(getOneClickPromiseList).toBeDefined();
  });
});
describe('getLastCardStatus', () => {
  it('should expose a function', () => {
    expect(getLastCardStatus).toBeDefined();
  });
});
describe('getCurrentCardOrderIndex', () => {
  it('should expose a function', () => {
    expect(getCurrentCardOrderIndex).toBeDefined();
  });
});
describe('getCurrentCardOrderNumber', () => {
  it('should expose a function', () => {
    expect(getCurrentCardOrderNumber).toBeDefined();
  });
});
describe('checkIsAllComplete', () => {
  it('should expose a function', () => {
    expect(checkIsAllComplete).toBeDefined();
  });
});
