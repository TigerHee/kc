/*
 * @Owner: terry@kupotech.com
 */
import moment from 'moment';
import { _t } from 'src/utils/lang';
import CopyRight from 'src/components/common/CopyRight.js';

jest.mock('moment');
jest.mock('src/utils/lang');

describe('getTranslation', () => {
  beforeEach(() => {
    // Mock implementation of moment().year()
    moment.mockImplementation(() => ({
      year: jest.fn(() => 2023),
    }));

    // Mock implementation of _t
    _t.mockImplementation((key, { endYear }) => `Translated: ${key} with endYear ${endYear}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct translation', () => {
    const result = CopyRight();
    expect(result).toBe('Translated: legao.copy.right with endYear 2023');
    expect(moment).toHaveBeenCalled();
    expect(_t).toHaveBeenCalledWith('legao.copy.right', { endYear: 2023 });
  });
});