// AppleDisclaim.test.js
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import isIOS from 'utils/isIOS';
import { customRender } from '../setup';

jest.mock('utils/isIOS', () => jest.fn()); // Mock isIOS 工具函数
jest.mock('src/tools/i18n', () => ({
  _t: (key) => key,
}));

describe('AppleDisclaim', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if not iOS', () => {
    isIOS.mockReturnValue(false);

    const { container } = customRender(<AppleDisclaim />);
    expect(container.firstChild).toBeNull(); // 如果不是 iOS，组件应返回 null
  });

  it('should render correctly when is iOS', () => {
    isIOS.mockReturnValue(true);
    const { container } = customRender(<AppleDisclaim />);
    // 检查文本是否正确渲染
    expect(screen.getByText('8fe6fe99cef24000a0dd')).toBeInTheDocument();
  });
});
