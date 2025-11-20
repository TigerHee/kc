/*
 * Owner: jesse.shao@kupotech.com
 */
import { generateClassName } from 'utils/materialTools';

describe('generateClassName', () => {
  const mockStyleSheet = {
    options: {
      classNamePrefix: 'test-prefix',
    },
  };

  test('should generate class name with prefix and rule key', () => {
    const rule = { key: 'test-rule' };
    const expectedClassName = 'test-prefix-test-rule-1';

    expect(generateClassName(rule, mockStyleSheet)).toEqual(expectedClassName);
  });

  test('should generate class name with Mui prefix and rule key if prefix starts with Mui', () => {
    const rule = { key: 'test-rule' };
    const mockStyleSheetWithMuiPrefix = {
      options: {
        classNamePrefix: 'Mui-test-prefix',
      },
    };
    const expectedClassName = 'Mui-test-prefix-test-rule';

    expect(generateClassName(rule, mockStyleSheetWithMuiPrefix)).toEqual(expectedClassName);
  });

  test('should generate class name with only rule key if styleSheet and prefix are not provided', () => {
    const rule = { key: 'test-rule' };
    const expectedClassName = 'test-rule-3';

    expect(generateClassName(rule)).toEqual(expectedClassName);
  });
});
