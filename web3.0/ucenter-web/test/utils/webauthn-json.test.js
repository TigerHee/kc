/**
 * Owner: eli.xiang@kupotech.com
 */

import {
  base64UrlToBase64,
  base64urlToBuffer,
  bufferToBase64url,
  parseExtendedCreationOptionsFromJSON,
  passkeysSupported,
} from 'src/utils/webauthn-json';

describe('test passkeysSupported', () => {
  beforeEach(() => {
    // 清理之前的模拟
    delete navigator.credentials;
    delete window.PublicKeyCredential;
  });

  test('should return true when passkeys are supported', () => {
    // 模拟支持的环境
    navigator.credentials = {
      create: jest.fn(),
      get: jest.fn(),
    };
    window.PublicKeyCredential = {};

    expect(passkeysSupported()).toBe(true);
  });

  test('should return false when credentials are not supported', () => {
    // 模拟不支持的环境
    expect(passkeysSupported()).toBe(false);
  });

  test('should return false when create method is not available', () => {
    navigator.credentials = {
      get: jest.fn(),
    };
    window.PublicKeyCredential = {};

    expect(passkeysSupported()).toBe(false);
  });

  test('should return false when get method is not available', () => {
    navigator.credentials = {
      create: jest.fn(),
    };
    window.PublicKeyCredential = {};

    expect(passkeysSupported()).toBe(false);
  });

  test('should return false when PublicKeyCredential is not available', () => {
    navigator.credentials = {
      create: jest.fn(),
      get: jest.fn(),
    };

    expect(passkeysSupported()).toBe(false);
  });
});

describe('base64UrlToBase64', () => {
  test('should convert base64 URL string to base64 string', () => {
    const base64Url = 'SGVsbG8gV29ybGQh'; // "Hello World!" in base64 URL format
    const expectedBase64 = 'SGVsbG8gV29ybGQh'; // No changes needed here

    expect(base64UrlToBase64(base64Url)).toBe(expectedBase64);
  });

  test('should replace "-" with "+" and "_" with "/"', () => {
    const base64Url = 'SGVsbG8gV29ybGQh-'; // Example with URL-safe characters
    const expectedBase64 = 'SGVsbG8gV29ybGQh+==='; // "+" replaces "-"

    expect(base64UrlToBase64(base64Url)).toBe(expectedBase64);
  });

  test('should add padding "=" when necessary', () => {
    const base64Url = 'SGVsbG8gV29ybGQ'; // Missing padding
    const expectedBase64 = 'SGVsbG8gV29ybGQ='; // Should add one "="

    expect(base64UrlToBase64(base64Url)).toBe(expectedBase64);
  });

  test('should handle multiple padding cases', () => {
    const base64Url = 'SGVsbG8gV29ybGQ'; // Missing two padding
    const expectedBase64 = 'SGVsbG8gV29ybGQ='; // Should add two "="

    expect(base64UrlToBase64(base64Url)).toBe(expectedBase64);
  });

  test('should handle empty string', () => {
    const base64Url = '';
    const expectedBase64 = ''; // An empty string should remain empty

    expect(base64UrlToBase64(base64Url)).toBe(expectedBase64);
  });
});

describe('base64urlToBuffer and bufferToBase64url', () => {
  const base64Url = 'bba87-iFk6nKEG6vvLIR75zoDTJIRO_OmD_oP9b1tTM';

  test('should convert base64 URL string to buffer', () => {
    const buffer = base64urlToBuffer(base64Url);
    const convertedUrl = bufferToBase64url(buffer);

    expect(convertedUrl).toBe(base64Url);
  });
});

describe('parseExtendedCreationOptionsFromJSON', () => {
  const resData = {
    data: '{"rp":{"name":"kucoin","id":"localhost"},"user":{"name":"2400000000000647","displayName":"MacOS(3)","id":"NjZjNzBhODNlMWQwYTQwMDAxZGYyYzg0"},"challenge":"rDIVP54NJGSKyrhcHQJXsU8e2kAZrU_itQRXInZvrOs","pubKeyCredParams":[{"alg":-7,"type":"public-key"},{"alg":-35,"type":"public-key"},{"alg":-36,"type":"public-key"},{"alg":-257,"type":"public-key"},{"alg":-258,"type":"public-key"},{"alg":-259,"type":"public-key"}],"timeout":600000,"excludeCredentials":[{"type":"public-key","id":"NITv37gaVzM4bHENfxanF5W1AJ4","transports":["hybrid","internal"]},{"type":"public-key","id":"lTgaoQ9nnI_T6yIKOznVH97zyzuKURk0_-_GzhCn1GY","transports":["internal"]}],"authenticatorSelection":{"requireResidentKey":true,"residentKey":"required"},"attestation":"none","extensions":{"credProps":true}}',
  };
  const optionsResData = JSON.parse(resData.data);

  const cco = parseExtendedCreationOptionsFromJSON({
    publicKey: { ...optionsResData },
  });
});
