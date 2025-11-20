/*
 * Owner: jesse.shao@kupotech.com
 */
import {
  pull,
  post,
  getNamespaceUrl,
  getRequestBaseUrl,
  setCsrf,
  setKuCoinCsrf,
  setXVersion,
  requestFetch,
  postJson,
  del,
  fetchHandle,
} from 'utils/request';
// import request from 'utils/request';

jest.mock('utils/request', () => ({
  ...jest.requireActual('utils/request'),
  default: jest.fn().mockImplementationOnce(() => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        rej({ code: '500' });
      });
    });
  }),
}));

jest.mock('../../utils/fetch', () => {
  const fn = () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({ code: '500' });
      });
    });
  };

  fn.interceptors = {
    request: {
      async use() {},
    },
  };
  return fn;
});

jest.mock('../../utils/storage', () => {
  return {
    getItem: jest.fn(() => {
      return '_x_version';
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

describe('test request', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('test pull', () => {
    expect(pull).toBeDefined();
    expect(post).toBeDefined();
    expect(setXVersion).toBeDefined();
    expect(postJson).toBeDefined();
    expect(del).toBeDefined();
    expect(fetchHandle).toBeDefined();
    expect(requestFetch).toBeDefined();
    // const response = pull('https://jsonplaceholder.typicode.com/posts/1');
    // const response = pull('https://jsonplaceholder.typicode.com/posts/1');
    const response = pull('http://localhost:2999/next-web/_api');
    const response2 = pull('http://localhost:2999/next-web/_api?b=2', { c: 121 });

    expect(setXVersion()).toBe(undefined);
    expect(Object.prototype.toString.call(response)).toEqual('[object Promise]');
    expect(Object.prototype.toString.call(response2)).toEqual('[object Promise]');
  });

  test('test post', () => {
    const response = post('http://localhost:2999/next-web/_api');
    const response2 = post('http://localhost:2999/next-web/_api?', { c: 213 });

    expect(Object.prototype.toString.call(response)).toEqual('[object Promise]');
    expect(Object.prototype.toString.call(response2)).toEqual('[object Promise]');
  });

  test('test postJson', () => {
    const response = postJson('http://localhost:2999/next-web/_api');

    expect(Object.prototype.toString.call(response)).toEqual('[object Promise]');
  });

  test('test del', () => {
    const response = del('http://localhost:2999/next-web/_api');
    const response2 = post('http://localhost:2999/next-web/_api?', { c: 3 });

    expect(Object.prototype.toString.call(response)).toEqual('[object Promise]');
    expect(Object.prototype.toString.call(response2)).toEqual('[object Promise]');
  });

  test('test requestFetch', () => {
    const response = requestFetch('http://localhost:2999/next-web/_api');
    const response2 = requestFetch('http://localhost:2999/next-web/_api?');

    expect(Object.prototype.toString.call(response)).toEqual('[object Promise]');
    expect(Object.prototype.toString.call(response2)).toEqual('[object Promise]');
  });

  test('fetchHandle should return a Promise', () => {
    const response = Promise.resolve({ success: true });
    const conf = {};
    const result = fetchHandle(response, conf);
    expect(result).toBeInstanceOf(Promise);
  });

  test('fetchHandle should call onOk function', async () => {
    const response = Promise.resolve({ success: true });
    const onOk = jest.fn();
    const conf = { onOk };
    await fetchHandle(response, conf);
    expect(onOk).toHaveBeenCalledWith({ success: true });
  });

  test('fetchHandle should call onError function', async () => {
    const response = Promise.reject({ success: false });
    const onError = jest.fn();
    const conf = { onError };
    await fetchHandle(response, conf).catch(() => {});
    expect(onError).toHaveBeenCalledWith({ success: false });
  });

  test('fetchHandle should show default success message when onOkFn is not a function', async () => {
    const response = Promise.resolve({ success: true });
    const message = { success: jest.fn() };
    const conf = { message };
    await fetchHandle(response, conf);
    expect(message.success).toHaveBeenCalledWith('成功');
  });

  test('fetchHandle should show success message when passed in', async () => {
    const response = Promise.resolve({ success: true });
    const message = { success: jest.fn() };
    const conf = { message, onOk: () => '自定义成功消息' };
    await fetchHandle(response, conf);
    expect(message.success).toHaveBeenCalledWith('自定义成功消息');
  });

  test('fetchHandle should show success message when passed in err', async () => {
    const response = Promise.reject({ success: true });
    const message = {
      success: jest.fn(),
      error: jest.fn(),
    };
    const conf = { message, onOk: () => '自定义成功消息', onError: jest.fn(() => 'foo') };
    await fetchHandle(response, conf);
    expect(message.error).toHaveBeenCalledTimes(1);
  });

  test('fetchHandle should show success message when passed in err', async () => {
    const response = Promise.reject({ success: true });
    const message = {
      success: jest.fn(),
      error: jest.fn(),
    };
    const conf = {
      message,
      onOk: () => '自定义成功消息',
      onError: jest.fn(() => 2),
    };
    await fetchHandle(response, conf);
    expect(message.error).toHaveBeenCalledTimes(1);
  });

  test('fetchHandle should show default error message when onError is not a function', async () => {
    const response = Promise.reject({ success: false });
    const message = { error: jest.fn() };
    const conf = { message };
    await fetchHandle(response, conf).catch(() => {});
    expect(message.error).toHaveBeenCalledWith('请求错误');
  });

  test('fetchHandle should show error message when passed in', async () => {
    const response = Promise.reject({ success: false });
    const message = { error: jest.fn() };
    const conf = { message, onError: () => '自定义错误消息' };
    await fetchHandle(response, conf).catch(() => {});
    expect(message.error).toHaveBeenCalledWith('自定义错误消息');
  });

  test('test getNamespaceUrl', () => {
    expect(getNamespaceUrl).toBeDefined();
    expect(getNamespaceUrl('a')).toBeDefined();
    expect(getNamespaceUrl('a')('b')).toBe('/ab');
  });

  test('test getRequestBaseUrl', () => {
    expect(getRequestBaseUrl).toBeDefined();
    expect(getRequestBaseUrl('a')).toBe('/_api');
  });

  test('test setCsrf', () => {
    expect(setCsrf).toBeDefined();
    expect(setCsrf('a')).toBe(undefined);
  });

  test('test setKuCoinCsrf', () => {
    expect(setKuCoinCsrf).toBeDefined();
    expect(setKuCoinCsrf('a')).toBe(undefined);
  });
});
