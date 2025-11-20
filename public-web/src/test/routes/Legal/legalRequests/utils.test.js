/*
 * Owner: harry.lai@kupotech.com
 */
import {
  banRemarkList,
  fileParamsHandle,
  FileRules,
  LegalConf,
  LegalOtherTypeKey,
  legalTypes,
  requestsTypes,
  RequiredRules,
  userCommitmentList,
  valIsEmpty,
  yesOrNoRadio,
} from 'src/routes/Legal/legalRequests/utils';
import { _t, _t as _tOrigin, _tHTML, _tHTML as _tHTMLOrigin } from 'tools/i18n';
// import { IS_TEST_ENV, _DEV_ } from '../../../../utils/env';

jest.mock('tools/i18n', () => ({
  _t: jest.fn(),
  _tHTML: jest.fn(),
}));

jest.mock('../../../../utils/env', () => ({
  IS_TEST_ENV: true,
  _DEV_: true,
}));

describe('Utils functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('_t should handle i18n translation correctly', () => {
    _tOrigin.mockReturnValue('translated text');
    const result = _t('key', 'default text', { var: 'value' });
    expect(result).toBe('translated text');
    expect(_tOrigin).toHaveBeenCalledWith('key', 'default text', { var: 'value' });
  });

  test('_tHTML should handle i18n HTML translation correctly', () => {
    _tHTMLOrigin.mockReturnValue('translated HTML text');
    const result = _tHTML('key', 'default HTML text', { var: 'value' });
    expect(result).toBe('translated HTML text');
    expect(_tHTMLOrigin).toHaveBeenCalledWith('key', 'default HTML text', { var: 'value' });
  });

  test('LegalConf should have correct configuration', () => {
    expect(LegalConf.LeftPadding).toBe('240px');
  });

  test('LegalOtherTypeKey to be 其他/Others', () => {
    expect(LegalOtherTypeKey).toBe('其他/Others');
  });

  test('yesOrNoRadio should have correct options', () => {
    expect(yesOrNoRadio).toEqual([
      { label: undefined, value: 1 },
      { label: undefined, value: 0 },
    ]);
  });

  test('legalTypes should have correct options', () => {
    expect(legalTypes).toEqual([
      {
        label: undefined,
        value: '刑事-洗钱/Criminal-Money Laundering',
      },
      {
        label: undefined,
        value: '刑事-国家安全和恐怖主义相关/Criminal-National Security and Terrorism',
      },
      {
        label: undefined,
        value: '刑事-毒品相关/Criminal-Drug-related',
      },
      {
        label: undefined,
        value: '刑事-腐败类/Criminal-Corruption',
      },
      {
        label: undefined,
        value: '刑事-欺诈/经济诈骗/Criminal-Fraud/Economic Dishonesty',
      },
      {
        label: undefined,
        value: '刑事-加密货币盗窃类/Criminal-Cryptocurrency Theft',
      },
      {
        label: undefined,
        value: '刑事-开设赌场/赌博/Criminal-Operating Casinos/Gambling',
      },
      {
        label: undefined,
        value: '刑事-黑客攻击/计算机入侵/Criminal-Hacking/Computer Intrusion',
      },
      {
        label: undefined,
        value: '刑事-勒索软件/钓鱼软件/Criminal-Ransomware/Phishing Software',
      },
      {
        label: undefined,
        value: '刑事-偷盗、贩卖个人信息/Criminal-Theft and Sale of Personal Information',
      },
      {
        label: undefined,
        value: '刑事-贩卖妇女儿童/Criminal-Trafficking in Women and Children',
      },
      {
        label: undefined,
        value: '刑事-非法集资/Criminal-Illegal Fundraising',
      },
      {
        label: undefined,
        value: '民事-商业纠纷/Civil-Commercial Dispute',
      },
      {
        label: undefined,
        value: '民事-破产类/Civil-Bankruptcy',
      },
      {
        label: undefined,
        value: '行政相关/Administrative-related',
      },
      {
        label: undefined,
        value: LegalOtherTypeKey,
      },
    ]);
  });

  test('banRemarkList should have correct options', () => {
    expect(banRemarkList).toEqual(['其他', '其他原因', 'other', 'others']);
  });

  test('requestsTypes should have correct options', () => {
    expect(requestsTypes).toEqual([
      { label: undefined, value: 'announce' },
      { label: undefined, value: 'transfer' },
    ]);
  });

  test('userCommitmentList should have correct options', () => {
    expect(userCommitmentList).toEqual([
      {
        label: undefined,
        value: true,
      },
    ]);
  });

  test('RequiredRules should have correct validation rules', () => {
    expect(RequiredRules).toEqual([
      { required: true, message: undefined },
      {
        validator: expect.any(Function),
        message: undefined,
      },
    ]);
  });

  test('FileRules should have correct validation rules', () => {
    expect(FileRules).toEqual([
      {
        validator: expect.any(Function),
      },
    ]);
  });

  test('fileParamsHandle should handle file params correctly', () => {
    const values = {
      files: [{ response: { fileId: 'file1' } }, { response: { fileId: 'file2' } }],
    };
    const result = fileParamsHandle(values, 'files');
    expect(result).toEqual({
      files: ['file1', 'file2'],
    });
  });

  test('valIsEmpty should return true for empty values', () => {
    expect(valIsEmpty(null)).toBe(true);
    expect(valIsEmpty(undefined)).toBe(true);
    expect(valIsEmpty('')).toBe(true);
    expect(valIsEmpty(' ')).toBe(true);
  });

  test('valIsEmpty should return false for non-empty values', () => {
    expect(valIsEmpty('value')).toBe(false);
    expect(valIsEmpty(0)).toBe(false);
    expect(valIsEmpty(false)).toBe(false);
  });
});
