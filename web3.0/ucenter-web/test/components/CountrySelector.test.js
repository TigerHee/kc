import CountrySelector from 'src/components/CountrySelector';
import { customRender } from 'test/setup';
import { _t } from 'tools/i18n';

// Mock i18n
jest.mock('tools/i18n', () => ({
  _t: jest.fn((key) => {
    const translations = {
      'country.code': '国家代码',
      'sms.help': '短信帮助',
      'uCQNHSVrZKcrqS71dULWqJ': '不支持',
    };
    return translations[key] || key;
  }),
}));

const countryList = [
  {
    code: 'CA',
    en: 'Canada',
    cn: '加拿大',
    mobileCode: '1',
    ico: 'https://assets.staticimg.com/ucenter/flag/canada.svg',
    dismiss: true,
    dismissLogin: true,
    weight: 10,
  },
  {
    code: 'US',
    en: 'United States',
    cn: '美国',
    mobileCode: '1',
    ico: 'https://assets.staticimg.com/ucenter/flag/united-states.svg',
    dismiss: false,
    dismissLogin: true,
    weight: 10,
  },
  {
    code: 'IN',
    en: 'India',
    cn: '印度',
    mobileCode: '91',
    ico: 'https://assets.staticimg.com/ucenter/flag/india.svg',
    dismiss: false,
    dismissLogin: false,
    weight: 10,
  },
  {
    code: 'ID',
    en: 'Indonesia',
    cn: '印尼',
    mobileCode: '62',
    ico: 'https://assets.staticimg.com/ucenter/flag/indonesia.svg',
    dismiss: false,
    dismissLogin: false,
    weight: 10,
  },
];

describe('CountrySelector', () => {
  // 测试基本渲染
  test('renders with empty country list', () => {
    const { container } = customRender(<CountrySelector />, {
      homepage: {
        countryList: [],
      },
    });
    
    expect(container.querySelector('[data-inspector="country-selector"]')).toBeInTheDocument();
    expect(_t).toHaveBeenCalledWith('country.code');
  });

  test('renders with country list', () => {
    const { container } = customRender(<CountrySelector />, {
      homepage: {
        countryList,
      },
    });

    const selector = container.querySelector('[data-inspector="country-selector"]');
    expect(selector).toBeInTheDocument();
  });
});
