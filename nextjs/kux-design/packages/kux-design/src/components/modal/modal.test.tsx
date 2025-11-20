
import { render, fireEvent } from '@testing-library/react';
import { Modal } from './index';
import { useIsMobile } from '@/hooks/useIsMobile'

jest.mock('@/components/icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

describe('Modal Component', () => {
  const onClose = jest.fn();
  const onOk = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    vi.mock('@/hooks/useIsMobile', () => ({
      useIsMobile: vi.fn()
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('正常打开', () => {
    const { getByTestId } = render(
      <Modal isOpen={true} title="Test Title" onClose={onClose} onOk={onOk} onCancel={onCancel} size={'small'}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('kux-modal-container')).toBeInTheDocument();
  });

  it('不渲染', () => {
    const { queryByTestId } = render(
      <Modal isOpen={false} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(queryByTestId('kux-modal-container')).toBeNull();
  });

  it('点击mask关闭', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        mask={true}
        maskClosable={true}
        onClose={onClose}
        onOk={onOk}
        onCancel={onCancel}
      >
        Modal Content
      </Modal>
    );
    fireEvent.click(getByTestId('kux-modal-mask'));
    expect(onClose).toHaveBeenCalled();
  });

  it('点击mask不关闭', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        mask={true}
        maskClosable={false}
        onClose={onClose}
        onOk={onOk}
        onCancel={onCancel}
      >
        Modal Content
      </Modal>
    );
    fireEvent.click(getByTestId('kux-modal-mask'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('自定义header渲染', () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    const { getByTestId } = render(
      <Modal isOpen={true} header={customHeader} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('custom-header')).toBeInTheDocument();
  });

  
  it('自定义content渲染', () => {
    const customContent = <div data-testid="custom-content">Custom Content</div>;
    const { getByTestId } = render(
      <Modal isOpen={true} content={customContent} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('custom-content')).toBeInTheDocument();
  });
  
  it('自定义footer渲染', () => {
    const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
    const { getByTestId } = render(
      <Modal isOpen={true} footer={customFooter} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('footer传null时', () => {
    const { queryByTestId } = render(
      <Modal isOpen={true} footer={null} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(queryByTestId('kux-modal-footer')).not.toBeInTheDocument();
  });

  it('footer 按钮纵向排', () => {
    const { queryByTestId } = render(
      <Modal isOpen={true} onClose={onClose} onOk={onOk} onCancel={onCancel} cancelText="取消" footerDirection="vertical">
        Modal Content
      </Modal>
    );
    expect(queryByTestId('kux-modal-footer')).toHaveClass('kux-modal-footer-vertical');
  });

  it('footer 取消按钮是text类型', () => {
    const { queryByTestId } = render(
      <Modal isOpen={true} onClose={onClose} onOk={onOk} onCancel={onCancel} cancelText="取消" cancelButtonType='text' footerDirection="vertical">
        Modal Content
      </Modal>
    );
    expect(queryByTestId('kux-modal-footer')).toHaveClass('kux-modal-footer-tiny-padding');
    expect(queryByTestId('kux-modal-cancel')).toHaveClass('kux-button-text');
  });

  it('footer 无取消按钮', () => {
    const { queryByTestId } = render(
      <Modal isOpen={true} onClose={onClose} onOk={onOk} onCancel={onCancel} cancelButtonType='text'>
        Modal Content
      </Modal>
    );
    expect(queryByTestId('kux-modal-cancel')).not.toBeInTheDocument();
  });

  it('点击右上角关闭按钮触发onClose', () => {
    const { getByTestId } = render(
      <Modal isOpen={true} showCloseX={true} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    fireEvent.click(getByTestId('kux-modal-closeX'));
    expect(onClose).toHaveBeenCalled();
  });

  it('okText和cancelText正确显示', () => {
    const okText = 'Confirm';
    const cancelText = 'Cancel';
    const { getByText } = render(
      <Modal
        isOpen={true}
        okText={okText}
        cancelText={cancelText}
        onClose={onClose}
        onOk={onOk}
        onCancel={onCancel}
      >
        Modal Content
      </Modal>
    );
    expect(getByText(okText)).toBeInTheDocument();
    expect(getByText(cancelText)).toBeInTheDocument();
  });

  it('drawer变体应用正确', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        drawTransform={true}
        drawAnchor="left"
        onClose={onClose}
        onOk={onOk}
        onCancel={onCancel}
      >
        Modal Content
      </Modal>
    );
    const modalBody = getByTestId('kux-modal-body');
    expect(modalBody).toHaveClass('kux-modal-body-drawer kux-modal-body-drawer-left');
  });

  it('移动端drawer显示draggable bar', () => {
    // @ts-expect-error ignore
    useIsMobile.mockReturnValue(true);
    // jest.spyOn(hooks, 'useIsMobile').mockReturnValue(true);
    const { getByTestId } = render(
      <Modal isOpen={true} mobileTransform={true} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('kux-modal-draggable-bar')).toBeInTheDocument();
  });

  it('headerBorder显示分隔线', () => {
    const { getByTestId } = render(
      <Modal isOpen={true} headerBorder={true} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('kux-modal-divider-h')).toBeInTheDocument();
  });
  
  it('footerBorder显示分隔线', () => {
    const { getByTestId } = render(
      <Modal isOpen={true} footerBorder={true} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    expect(getByTestId('kux-modal-divider-f')).toBeInTheDocument();
  });

  it('自定义zIndex生效', () => {
    const zIndex = 1001;
    const { getByTestId } = render(
      <Modal isOpen={true} zIndex={zIndex} onClose={onClose} onOk={onOk} onCancel={onCancel}>
        Modal Content
      </Modal>
    );
    const container = getByTestId('kux-modal-container');
    expect(container).toHaveStyle({ zIndex: zIndex.toString() });
  });
  
  test('点击右上角关闭按钮应调用 onClose', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        showCloseX={true}
        onClose={onClose}
      >
        Modal Content
      </Modal>
    );

    fireEvent.click(getByTestId('kux-modal-closeX'));
    expect(onClose).toHaveBeenCalled();
  });

  test('点击 OK 按钮应调用 onOk，并根据 closeSync 决定是否调用 onClose', () => {
    const { getByTestId, getByText } = render(
      <Modal
        isOpen={true}
        okText="OK"
        cancelText="Cancel"
        closeSync={true}
        onOk={onOk}
        onCancel={onCancel}
        onClose={onClose}
      >
        Modal Content
      </Modal>
    );

    expect(getByTestId('kux-modal-ok')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
    fireEvent.click(getByTestId('kux-modal-ok'));
  });

  test('当 closeSync 为 false 时，点击 OK 不关闭弹窗', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        okText="OK"
        cancelText="Cancel"
        closeSync={false}
        onOk={onOk}
        onCancel={onCancel}
        onClose={onClose}
      >
        Modal Content
      </Modal>
    );

    fireEvent.click(getByTestId('kux-modal-ok'));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('点击 Cancel 应调用 onCancel', () => {
    const { getByTestId, getByText } = render(
      <Modal
        isOpen={true}
        okText="OK"
        cancelText="Cancel"
        closeSync={true}
        onOk={onOk}
        onCancel={onCancel}
        onClose={onClose}
      >
        Modal Content
      </Modal>
    );

    expect(getByTestId('kux-modal-cancel')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(getByTestId('kux-modal-cancel'));
  });

  test('当 closeSync 为 false 时', () => {
    const { getByTestId } = render(
      <Modal
        isOpen={true}
        okText="OK"
        cancelText="Cancel"
        closeSync={false}
        onOk={onOk}
        onCancel={onCancel}
        onClose={onClose}
      >
        Modal Content
      </Modal>
    );

    fireEvent.click(getByTestId('kux-modal-cancel'));
    expect(onClose).not.toHaveBeenCalled();
  });
});