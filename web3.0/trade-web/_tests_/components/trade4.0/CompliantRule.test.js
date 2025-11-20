import React from 'react';

import CompliantRule from '@/components/CompliantRule';
import { useDisplayRule, useCompliantShow } from '@/components/CompliantRule/hook';

import { customRender, screen, cleanup } from '_tests_/test-setup';

const FUTURES_PNL_TAX = 'test';

jest.mock('@/components/CompliantRule/hook', () => ({
  useDisplayRule: jest.fn(),
  useCompliantShow: jest.fn(),
}));

const renderComponent = (props, store) => {
  return customRender(
    <CompliantRule {...props}>
      <div>{'test-render'}</div>
    </CompliantRule>,
    store,
  );
};

describe('CompliantRule', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    window.resetMock();
    cleanup();
  });
  it.each([
    {
      desc: 'CompliantRule normal',
      mock: {
        displayRule: true,
      },
      props: {
        ruleId: FUTURES_PNL_TAX,
      },
    },
    {
      desc: 'CompliantRule noSSG normal',
      mock: {
        displayRule: true,
      },
      props: {
        ruleId: FUTURES_PNL_TAX,
        noSSG: true,
      },
    },
    {
      desc: 'CompliantRule noSSG isSSGDisplay false',
      mock: {
        displayRule: false,
      },
      props: {
        ruleId: FUTURES_PNL_TAX,
        noSSG: true,
      },
      check: false,
    },
    {
      desc: 'CompliantRule fallback',
      mock: {
        displayRule: true,
        ua: 'SSG_ENV',
      },
      props: {
        ruleId: FUTURES_PNL_TAX,
        fallback: 'fallback',
      },
      expectShow: 'fallback',
    },
  ])(
    'test components -> $desc',
    ({ props, mock: { displayRule, ua = '' }, expectShow = 'test-render', check = true }) => {
      useDisplayRule.mockReturnValue(displayRule);
      window.setMock('navigator');
      window.navigator.userAgent = ua;
      renderComponent(props);
      if (check) {
        expect(screen.getByText(expectShow)).toBeInTheDocument();
      }
    },
  );
});

describe('CompliantRule Test In CompliantBoxInner', () => {
  it('CompliantBoxInner must return null', () => {
    useDisplayRule.mockReturnValue(true);
    useCompliantShow.mockReturnValue(false);

    renderComponent({ spm: 'test' });
    expect(screen.queryByText('test-render')).not.toBeInTheDocument();
  });

  it('CompliantBoxInner must return children', () => {
    useDisplayRule.mockReturnValue(true);
    useCompliantShow.mockReturnValue(true);

    renderComponent({ spm: 'test' });

    expect(screen.getByText('test-render')).toBeInTheDocument();
  });
});
