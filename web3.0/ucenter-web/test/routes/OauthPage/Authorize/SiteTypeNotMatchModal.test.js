import React from 'react';
import { customRender } from 'test/setup';
import { fireEvent, screen } from '@testing-library/react';
import { SiteTypeNotMatchModal } from 'src/routes/OauthPage/Authorize/SiteTypeNotMatchModal';
import { getSiteName } from 'src/constants';
import useThemeImg from 'hooks/useThemeImg';

// Mock getSiteName
jest.mock('src/constants', () => ({
  getSiteName: jest.fn((type) => `${type}_NAME`),
}));

// Mock useThemeImg
jest.mock('hooks/useThemeImg', () => ({
  __esModule: true,
  default: () => ({
    getThemeImg: jest.fn(({ light }) => light),
  }),
}));

// Mock i18n
jest.mock('tools/i18n', () => ({
  _t: (key, params) => {
    if (key === '1be12adbc9274000a288') {
      return `Site Type: ${params.userSiteType}`;
    }
    return key;
  },
}));

describe('SiteTypeNotMatchModal Component', () => {
  const defaultProps = {
    visible: true,
    userSiteType: 'TEST_SITE',
    onOK: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染模态框', () => {
    customRender(<SiteTypeNotMatchModal {...defaultProps} />, {});

    // 验证警告标题
    expect(screen.getByText('0dba44df83df4000a372')).toBeInTheDocument();

    // 验证提示内容
    expect(screen.getByText('Site Type: TEST_SITE_NAME')).toBeInTheDocument();

    // 验证按钮
    expect(screen.getByText('i.know')).toBeInTheDocument();

    // 验证图片
    const img = screen.getByAltText('passkey add tip');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('dialog-warn-info.svg');
  });

  it('应该在点击确认按钮时调用 onOK', () => {
    customRender(<SiteTypeNotMatchModal {...defaultProps} />, {});

    // 点击确认按钮
    fireEvent.click(screen.getByText('i.know'));

    // 验证回调
    expect(defaultProps.onOK).toHaveBeenCalled();
  });

  it('应该在 visible 为 false 时不显示模态框', () => {
    customRender(<SiteTypeNotMatchModal {...defaultProps} visible={false} />, {});

    // 验证模态框不在文档中
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('应该正确处理不同的站点类型', () => {
    // 设置不同的站点类型
    const siteTypes = ['MAIN', 'FUTURES', 'MARGIN'];

    siteTypes.forEach(siteType => {
      getSiteName.mockReturnValueOnce(`${siteType}_NAME`);

      customRender(
        <SiteTypeNotMatchModal
          {...defaultProps}
          userSiteType={siteType}
        />,
        {}
      );

      // 验证每个站点类型的显示
      expect(screen.getByText(`Site Type: ${siteType}_NAME`)).toBeInTheDocument();
    });

    // 验证 getSiteName 被调用的次数
    expect(getSiteName).toHaveBeenCalledTimes(siteTypes.length);
  });

  it('应该正确处理多次点击确认按钮', () => {
    customRender(<SiteTypeNotMatchModal {...defaultProps} />, {});

    const button = screen.getByText('i.know');

    // 连续点击按钮
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // 验证回调被调用正确的次数
    expect(defaultProps.onOK).toHaveBeenCalledTimes(3);
  });
});
