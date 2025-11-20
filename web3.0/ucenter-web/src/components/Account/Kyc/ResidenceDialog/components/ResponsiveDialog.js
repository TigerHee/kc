/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ErrorOutlined, ICClosePlusOutlined } from '@kux/icons';
import { Dialog, Drawer, styled, useResponsive } from '@kux/mui';

const ExDrawer = styled(Drawer)`
  border-radius: 20px 20px 0 0;
  .KuxModalHeader-root {
    padding: 24px 16px 12px;
    border-bottom: none;
  }
  .KuxModalHeader-close {
    top: 24px;
    width: 24px;
    height: 24px;
  }
`;
const Header = styled.div`
  padding: 32px;
  display: flex;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
    padding: 24px 16px 12px;
    .error_svg__icon {
      color: ${({ theme }) => theme.colors.icon60};
      cursor: pointer;
    }
  }
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  flex: 1;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
    line-height: 130%;
  }
`;
const CloseBtn = styled.div`
  width: 34px;
  height; 34px;
  border: 2px solid ${({ theme }) => theme.colors.cover8};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const Content = styled.div`
  padding: 8px 16px 32px;
`;

export default function ResponsiveDialog({ open, title, footer, onCancel, children }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  return isH5 ? (
    <ExDrawer
      show={open}
      header={
        <Header>
          <Title>{title}</Title>
          <ErrorOutlined size={24} onClick={onCancel} />
        </Header>
      }
      back={false}
      anchor="bottom"
      onClose={oncancel}
    >
      <Content>{children}</Content>
      {footer}
    </ExDrawer>
  ) : (
    <Dialog
      open={open}
      size="large"
      header={
        <Header>
          <Title>{title}</Title>
          <CloseBtn onClick={onCancel}>
            <ICClosePlusOutlined size={12} />
          </CloseBtn>
        </Header>
      }
      footer={footer}
      onCancel={onCancel}
    >
      {children}
    </Dialog>
  );
}
