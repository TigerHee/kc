import {
  REGEXP,
  initFile,
  getFileUrl,
  getTimestampByZone,
  getSystemTimestamp,
} from 'src/routes/Listing/common/config.js';

describe('REGEXP', () => {
  test('only_en_and_num', () => {
    expect(REGEXP.only_en_and_num.test('abc123')).toBeTruthy();
    expect(REGEXP.only_en_and_num.test('abc')).toBeFalsy();
    expect(REGEXP.only_en_and_num.test('123')).toBeFalsy();
  });

  test('en_and_num', () => {
    expect(REGEXP.en_and_num.test('abc123')).toBeTruthy();
    expect(REGEXP.en_and_num.test('abc')).toBeTruthy();
    expect(REGEXP.en_and_num.test('123')).toBeTruthy();
    expect(REGEXP.en_and_num.test('abc!')).toBeFalsy();
  });

  test('begin_and_end_no_blank', () => {
    expect(REGEXP.begin_and_end_no_blank.test('hello world')).toBeTruthy();
    expect(REGEXP.begin_and_end_no_blank.test(' hello world')).toBeFalsy();
    expect(REGEXP.begin_and_end_no_blank.test('hello world ')).toBeFalsy();
  });

  test('email', () => {
    expect(REGEXP.email.test('test@example.com')).toBeTruthy();
    expect(REGEXP.email.test('test@.com')).toBeFalsy();
  });

  test('phone', () => {
    expect(REGEXP.phone.test('1234567890')).toBeTruthy();
    expect(REGEXP.phone.test('123-456-7890')).toBeFalsy();
  });

  test('uid', () => {
    expect(REGEXP.uid.test('123456')).toBeTruthy();
    expect(REGEXP.uid.test('abc123')).toBeFalsy();
  });
});

describe('initFile', () => {
  test('multiple files', () => {
    const input = [
      {
        fileId: '1',
        fileName: 'file1.jpg',
        originalUrl: 'https://example.com/file1.jpg',
        expiredAt: '2023-01-01',
      },
      {
        fileId: '2',
        fileName: 'file2.jpg',
        originalUrl: 'https://example.com/file2.jpg',
        expiredAt: '2023-01-01',
      },
    ];

    const expectedOutput = [
      {
        uid: '1',
        name: 'file1.jpg',
        status: 'done',
        url: 'https://example.com/file1.jpg',
        expiredAt: '2023-01-01',
      },
      {
        uid: '2',
        name: 'file2.jpg',
        status: 'done',
        url: 'https://example.com/file2.jpg',
        expiredAt: '2023-01-01',
      },
    ];

    expect(initFile(input)).toEqual(expectedOutput);
  });

  test('single file', () => {
    const input = {
      fileId: '1',
      fileName: 'file1.jpg',
      originalUrl: 'https://example.com/file1.jpg',
      expiredAt: '2023-01-01',
    };

    const expectedOutput = [
      {
        uid: '1',
        name: 'file1.jpg',
        status: 'done',
        url: 'https://example.com/file1.jpg',
        expiredAt: '2023-01-01',
      },
    ];

    expect(initFile(input)).toEqual(expectedOutput);
  });

  test('empty input', () => {
    expect(initFile([])).toBeUndefined();
    expect(initFile({})).toBeUndefined();
  });
});

describe('getFileUrl', () => {
  test('with array values', () => {
    const input = {
      dueDiligenceInfo: [
        {
          uid: '1',

          name: 'file1.jpg',

          url: 'https://example.com/file1.jpg',

          expiredAt: '2023-01-01',
        },
      ],

      kycInformation: [
        {
          uid: '2',

          name: 'file2.jpg',

          url: 'https://example.com/file2.jpg',

          expiredAt: '2023-01-01',
        },
      ],

      remark: ['Some remark'],
    };

    const expectedOutput = {
      dueDiligenceInfo: {
        expiredAt: '2023-01-01',
        fileId: '1',
        fileName: 'file1.jpg',
        fileUrl: 'https://example.com/file1.jpg',
      },
      kycInformation: [
        {
          expiredAt: '2023-01-01',
          fileId: '2',
          fileName: 'file2.jpg',
          fileUrl: 'https://example.com/file2.jpg',
        },
      ],
      majorLegalEntity: {},
      legalOpinion: {},
      projectWhitePaper: {},
      signedVersion: {},
      securityReviewReport: {},
      remark: '[object Object]',
    };

    expect(getFileUrl(input)).toEqual(expectedOutput);
  });
});

describe('getSystemTimestamp', () => {
  it('should convert UTC timestamp to system timestamp correctly', () => {
    // Mocking Date.getTimezoneOffset to return a specific value

    const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;

    Date.prototype.getTimezoneOffset = jest.fn(() => -480); // Beijing timezone (UTC+8)

    const utcTimestamp = Date.UTC(2023, 0, 1, 0, 0, 0); // 2023-01-01T00:00:00.000Z

    const expectedSystemTimestamp = utcTimestamp - 8 * 60 * 60 * 1000; // Beijing time

    expect(getSystemTimestamp(utcTimestamp)).toBe(expectedSystemTimestamp);

    // Restore the original getTimezoneOffset method

    Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
  });

  it('should handle different timezones correctly', () => {
    // Mocking Date.getTimezoneOffset to return a specific value

    const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;

    Date.prototype.getTimezoneOffset = jest.fn(() => 300); // New York timezone (UTC-5)

    const utcTimestamp = Date.UTC(2023, 0, 1, 0, 0, 0); // 2023-01-01T00:00:00.000Z

    const expectedSystemTimestamp = utcTimestamp + 5 * 60 * 60 * 1000; // New York time

    expect(getSystemTimestamp(utcTimestamp)).toBe(expectedSystemTimestamp);

    // Restore the original getTimezoneOffset method

    Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
  });
});
