import {
  formatNumberKMB,
  dropZero,
  roundByStep,
  formatNumber,
  readableNumber,
  thousandPointed,
  toNonExponential,
  transUnix,
  numberResolve,
  isMinStep,
  floadToPercent,
  intlFormatNumberTransfer,
  formatLittleSize,
  formatLittlePercent,
  lessThanMinValue,
} from 'src/trade4.0/utils/format.js';

describe('formatNumberKMB 函数', () => {
  test('没有value', () => {
    expect(formatNumberKMB()).toBe('-');
  });

  test('value = 非数字', () => {
    expect(formatNumberKMB('a')).toBe('-');
  });

  test('minStep > value', () => {
    expect(formatNumberKMB(0.0001)).toBe('<0.01');
  });

  test('数值大于1000000000000', () => {
    expect(formatNumberKMB(1100000000000)).toBe('1.100T');
  });

  test('数值大于1000000000', () => {
    expect(formatNumberKMB(1100000000)).toBe('1.100B');
  });

  test('数值大于1000000', () => {
    expect(formatNumberKMB(1100000)).toBe('1.10M');
  });

  test('数值大于1000', () => {
    expect(formatNumberKMB(1100)).toBe('1.10K');
  });
  test('数值小于1000', () => {
    expect(formatNumberKMB(100)).toBe('100');
  });
});

describe('dropZero 函数', () => {
  test('没有参数', () => {
    expect(dropZero()).toBe('-');
  });

  test('参数 = 0', () => {
    expect(dropZero(0)).toBe('-');
  });

  test('参数为整数', () => {
    expect(dropZero(10)).toBe('10');
  });

  test('参数浮点数', () => {
    expect(dropZero(10.0002)).toBe('10.0002');
  });

  test('参数字符串浮点数', () => {
    expect(dropZero('10.000200000')).toBe('10.0002');
  });
});

describe('roundByStep 函数', () => {
  test('noRound 为 true', () => {
    expect(roundByStep('0.001', { step: 0.1, noRound: true }).toFixed()).toBe('0.001');
  });

  test('noRound 为 false', () => {
    expect(roundByStep('0.56', { step: 4 }).toFixed()).toBe('0');
    expect(roundByStep('0.56', { step: 4, round: 0 }).toFixed()).toBe('4');
  });
});

describe('formatNumber 函数', () => {
  test('没有value', () => {
    expect(formatNumber()).toBe(0);
  });

  test('value = 0', () => {
    expect(formatNumber(0)).toBe(0);
  });

  test('value为非数字', () => {
    expect(formatNumber('-')).toBe('-');
  });

  test('fixed小于0', () => {
    expect(formatNumber('1000.00', { fixed: -1, step: 10 })).toBe('1,000');
  });

  test('fixed = 2', () => {
    expect(formatNumber('1000.555', { fixed: 2, dropZ: false })).toBe('1,000.55');
  });

  test('round 向上取', () => {
    expect(formatNumber('1000.555', { fixed: 2, dropZ: false, round: 4 })).toBe('1,000.56');
  });

  test('不加千分位', () => {
    expect(formatNumber('1000.555', { fixed: 2, dropZ: false, round: 4, pointed: false })).toBe(
      '1000.56',
    );
  });

  test('取负数', () => {
    expect(formatNumber('1000.555', { fixed: 2, dropZ: false, round: 4, negate: true })).toBe(
      '-1,000.56',
    );
  });
});

describe('readableNumber 函数', () => {
  test('没有参数', () => {
    expect(readableNumber()).toBe();
  });

  test('参数为非数字', () => {
    expect(readableNumber('-')).toBe('-');
  });

  test('参数 < 1000000', () => {
    expect(readableNumber(10.555555)).toBe('10.555555');
  });

  test('参数 > 1000000', () => {
    expect(readableNumber(1000000.505555)).toBe('1,000,000.50');
  });
});

describe('thousandPointed 函数', () => {
  test('参数为非数字', () => {
    expect(thousandPointed('-')).toBe('-');
  });

  test('参数 > 1000000', () => {
    expect(thousandPointed(1000000.5)).toBe('1,000,000.5');
  });
});

describe('toNonExponential 函数', () => {
  test('参数为非数字', () => {
    expect(toNonExponential('-')).toBe('-');
  });

  test('科学计数法转换', () => {
    expect(toNonExponential('1e-10')).toBe('0.0000000001');
  });
});

describe('transUnix 函数', () => {
  test('去掉纳秒', () => {
    expect(transUnix(1703602434515000)).toBe('1703602434515');
  });
});

describe('numberResolve 函数', () => {
  test('value < 100000', () => {
    expect(numberResolve(1000.99999, 3)).toBe('1,000.999');
  });

  test('value > 100000', () => {
    expect(numberResolve(100000.99999)).toBe('100.0K');
  });

  test('value > 1000000', () => {
    expect(numberResolve(1000000.99999)).toBe('1.00M');
  });
});

describe('isMinStep 函数', () => {
  test('value 是 step 整数倍', () => {
    expect(isMinStep(999, 3)).toBe(true);
    expect(isMinStep(3, 3)).toBe(true);
  });
  test('value 不是 step 整数倍', () => {
    expect(isMinStep(3, 2)).toBe(false);
  });
});

describe('floadToPercent 函数', () => {
  test('没有value', () => {
    expect(floadToPercent()).toBe();
  });

  test('value = 非数字', () => {
    expect(floadToPercent('a')).toBe('a');
  });

  test('转换成百分比', () => {
    expect(floadToPercent('0.1')).toBe('+10%');
  });
});

describe('intlFormatNumberTransfer 函数', () => {
  test('使用组件库方法处理金融数字', () => {
    expect(intlFormatNumberTransfer({ value: '1000.095', precision: 2 })).toBe('1,000.10');
    expect(intlFormatNumberTransfer({ value: '1000.095' })).toBe('1,000.095');
  });
});

describe('formatLittleSize 函数', () => {
  test('没有value', () => {
    expect(formatLittleSize()).toBe();
  });

  test('value = 非数字', () => {
    expect(formatLittleSize({ value: 'a' })).toBe('a');
  });

  test('value = null', () => {
    expect(formatLittlePercent({ value: null })).toBe(null);
  });

  test('value小于最小精度值', () => {
    expect(
      formatLittleSize({
        value: '0.001',
        fixed: 2,
        withSign: true,
      }),
    ).toBe('< 0.01');
  });

  test('value大于最小精度值 & 带sign', () => {
    expect(
      formatLittleSize({
        value: '1234.5678',
        fixed: 2,
        withSign: true,
      }),
    ).toBe('+1,234.56');
  });

  test('value大于最小精度值 & 不带sign', () => {
    expect(
      formatLittleSize({
        value: '1234.5678',
        fixed: 2,
      }),
    ).toBe('1,234.56');
  });
});

describe('formatLittlePercent 函数', () => {
  test('没有value', () => {
    expect(formatLittlePercent()).toBe();
  });

  test('value = 非数字', () => {
    expect(formatLittlePercent({ value: 'a' })).toBe('a');
  });

  test('value = null', () => {
    expect(formatLittlePercent({ value: null })).toBe(null);
  });

  test('value小于最小精度值', () => {
    expect(
      formatLittlePercent({
        value: '0.00001',
      }),
    ).toBe('< 0.01%');
  });

  test('value大于最小精度值 & 带sign', () => {
    expect(
      formatLittlePercent({
        value: '0.12345678',
      }),
    ).toBe('+12.34%');
  });

  test('value大于最小精度值 & 不带sign', () => {
    expect(
      formatLittlePercent({
        isPositive: false,
        value: '0.12345678',
      }),
    ).toBe('12.34%');
  });
});

describe('lessThanMinValue 函数', () => {
  test('value 小于最小精度值且大于0', () => {
    expect(lessThanMinValue('0.000001123', 5)).toBe('< 0.00001');
  });
  test('value 大于最小精度值', () => {
    expect(lessThanMinValue('0.12345678', 5)).toBe(false);
  });
  test('value 小于0且绝对值小于最小精度值', () => {
    expect(lessThanMinValue('-0.000001', 5)).toBe('> -0.00001');
  });
  test('value 小于0且绝对值大于最小精度值', () => {
    expect(lessThanMinValue('-0.12345678', 5)).toBe(false);
  });
  test('value 等于0', () => {
    expect(lessThanMinValue('0', 5)).toBe(false);
  });
});
