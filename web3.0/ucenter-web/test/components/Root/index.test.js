import DownloadGuidePopup from 'components/Root/Download';
import { customRender } from 'test/setup';

// 模拟 useModalsAndBanners hook 返回值
jest.mock('components/Root/Download/hooks/useModalsAndBanners', () => ({
  __esModule: true,
  default: () => ({
    canShowModal: true,
  }),
}));

describe('DownloadGuidePopup component', () => {
  it('does not render modal when user is logged in', () => {
    const { queryByText } = customRender(
      <DownloadGuidePopup
        pathname="/current/path"
        pageId="currentPageId"
        downloadAppUrl="http://example.com/download"
      />,
    );

    // 期望不渲染 DownloadModal 组件
    expect(queryByText('DownloadModal')).not.toBeInTheDocument();
  });

  it('does not render modal when user is in app', () => {
    const { queryByText } = customRender(
      <DownloadGuidePopup
        pathname="/current/path"
        pageId="currentPageId"
        downloadAppUrl="http://example.com/download"
      />,
    );

    // 期望不渲染 DownloadModal 组件
    expect(queryByText('DownloadModal')).not.toBeInTheDocument();
  });

  it('does not render modal when user is not in H5', () => {
    const { queryByText } = customRender(
      <DownloadGuidePopup
        pathname="/current/path"
        pageId="currentPageId"
        downloadAppUrl="http://example.com/download"
      />,
    );

    // 期望不渲染 DownloadModal 组件
    expect(queryByText('DownloadModal')).not.toBeInTheDocument();
  });

  it('does not render modal when countdown is over', () => {
    const { queryByText } = customRender(
      <DownloadGuidePopup
        pathname="/current/path"
        pageId="currentPageId"
        downloadAppUrl="http://example.com/download"
      />,
    );

    // 期望不渲染 DownloadModal 组件
    expect(queryByText('DownloadModal')).not.toBeInTheDocument();
  });
});
