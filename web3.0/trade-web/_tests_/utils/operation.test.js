import Decimal from 'decimal.js';
import { 
  transformParam, 
  plus, 
  minus, 
  multiply, 
  min, 
  max, 
  equals, 
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  comparedTo,
  dividedBy,
  percentage,
  round,
  abs,
  toFixed,
  toNonExponential,
  percent
} from 'src/utils/operation.js';

expect.extend({
  decimalEquals(received, argument) {
    const pass = Decimal(received).equals(argument);
    if (pass) {
      return {
        message: () => `expected Decimal ${received} to be Decimal ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected Decimal ${received} not to be Decimal ${argument}`,
        pass: false,
      };
    }
  },
});

describe('transformParam 精度运算前的参数转化', () => {
  test('参数为空或者undefined', () => {
    expect(transformParam(undefined)).decimalEquals(0);
    expect(transformParam(null)).decimalEquals(0);
    expect(transformParam('')).decimalEquals(0);
  });
  test('参数为数字或字符', () => {
    expect(transformParam(12)).decimalEquals(12);
    expect(transformParam('12')).decimalEquals(12);
    expect(transformParam('12test').isNaN()).toBeTruthy();
  })
})

describe('plus 高精度加法运算', () => {
  test('undefined plus 0.1 equals 0.1', () => {
    expect(plus(undefined)(0.1)).decimalEquals(0.1);
  });
  
  test('1 plus 2 equals 3', () => {
    expect(plus(1)(2)).decimalEquals(3);
  });
})

describe('minus 高精度减法运算', () => {
  test('1.1 minus 0.1 equals 1', () => {
    expect(minus(1.1)(0.1)).decimalEquals(1);
  });
})

describe('multiply 高精度乘法运算', () => {
  test('浮点相乘', () => {
    expect(multiply(3.1)(1.2)).decimalEquals(3.72)
  });
  test('整数相乘', () => {
    expect(multiply(-1)(3)).decimalEquals(-3)
  });
  test('参数异常时 处理成0', () => {
    expect(multiply(undefined)(2)).decimalEquals(0)
  })
});

describe('min or max 从所有参数中获取最小或最大参数', () => {
  test('合法参数', () => {
    expect(min(1, 3, 99.3, '4', '-1', -3, undefined)).decimalEquals(-3);
    expect(max(1, 3, 99.3, '4', '-1', -3, undefined)).decimalEquals(99.3);
  });
  test('包含非法参数 返回NaN', () => {
    expect(min(1, 3, 99.3, '4', '-1', -3, undefined, 'not a number').isNaN()).toBeTruthy();
    expect(max(1, 3, 99.3, '4', '-1', -3, undefined, 'not a number').isNaN()).toBeTruthy();
  });
});

describe('equals 判断参数是否相等', () => {
  test('合法参数', () => {
    expect(equals(2)(2)).toBeTruthy();
    expect(equals(2)(-2)).toBeFalsy();
  });
  test('参数为NaN', () => {
    expect(equals(2)(NaN)).toBeFalsy();
  });
});

describe('greaterThan 判断第一个参数是否大于第二个参数', () => {
  test('合法参数', () => {
    expect(greaterThan(2)(-2)).toBeTruthy();
    expect(greaterThan(3)(5)).toBeFalsy();
  });
  test('参数为NaN', () => {
    expect(greaterThan(2)(NaN)).toBeFalsy();
  });
});

describe('greaterThanOrEqualTo 判断第一个参数大于等于第二个参数', () => {
  test('合法参数', () => {
    expect(greaterThanOrEqualTo(2)(2)).toBeTruthy();
    expect(greaterThanOrEqualTo(2)(-2.1)).toBeTruthy();
    expect(greaterThanOrEqualTo(2)(2.1)).toBeFalsy();
  });
  test('参数为NaN', () => {
    expect(greaterThanOrEqualTo(2)(NaN)).toBeFalsy();
  });
});

describe('lessThan 判断第一个参数是否小于第二个参数', () => {
  test('合法参数', () => {
    expect(lessThan(2)(-2)).toBeFalsy();
    expect(lessThan(3)(5)).toBeTruthy();
  });
  test('参数为NaN', () => {
    expect(lessThan(2)(NaN)).toBeFalsy();
  });
});

describe('lessThanOrEqualTo 判断第一个参数小于等于第二个参数', () => {
  test('合法参数', () => {
    expect(lessThanOrEqualTo(2)(2)).toBeTruthy();
    expect(lessThanOrEqualTo(2)(-2.1)).toBeFalsy();
    expect(lessThanOrEqualTo(2)(2.1)).toBeTruthy();
  });
  test('参数为NaN', () => {
    expect(lessThanOrEqualTo(2)(NaN)).toBeFalsy();
  });
});

describe('comparedTo 对比参数大小', () => {
  test('合法参数', () => {
    expect(comparedTo(2)(2)).toBe(0);
    expect(comparedTo(2)(-2.1)).toBe(1);
    expect(comparedTo(2)(2.1)).toBe(-1);
  });
  test('参数为NaN', () => {
    expect(comparedTo(2)(NaN)).toBeNaN();
  });
});

describe('dividedBy 除法', () => {
  test('被除数不为0', () => {
    expect(dividedBy(10)(5)).decimalEquals(2);
  });
  test('被除数为0', () => {
    expect(dividedBy(3)(0)).decimalEquals(0);
  });
});

describe('percentage 转百分数', () => {
  test('合法参数', () => {
    expect(percentage(0.05)).decimalEquals(5);
  });
  test('参数为NaN', () => {
    expect(percentage(NaN).isNaN()).toBeTruthy();
  });
});

describe('round 四舍五入', () => {
  test('小数位小于5', () => {
    expect(round(0.05)).decimalEquals(0);
  });
  test('小数位大于5', () => {
    expect(round(-5.5)).decimalEquals(-6);
  });
});

describe('abs 绝对值', () => {
  test('正负X绝对值相等', () => {
    expect(abs(1)).decimalEquals(abs(-1));
  });
});

describe('toFixed 返回指定位数', () => {
  test('不指定位数', () => {
    expect(toFixed(3.1415926)()).decimalEquals(3.1415926);
  });
  test('指定位数', () => {
    expect(toFixed(3.1415926)(3)).decimalEquals(3.142);
  });
});

describe('toNonExponential 非科学计数法', () => {
  test('参数不是有限数', () => {
    expect(toNonExponential(Math.PI)).decimalEquals(Math.PI);
  });
  test('参数是有限数', () => {
    expect(toNonExponential(5.24e+5).toString()).toBe('524000');
  });
});

describe('percent 计算比例', () => {
  test('参数都是正数', () => {
    expect(percent(5)(80)).decimalEquals(0.0625);
  });
  test('参数有一个是负数', () => {
    expect(percent(-5)(80)).decimalEquals(0.0625);
  });
  test('返回百分值', () => {
    expect(percent(-5)(80, true)).decimalEquals(6.25);
  });
});
