/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICSuccessFilled, ICSuccessUnselectOutlined, ICArrowUpOutlined } from '@kux/icons';

export const Content = styled.div`
  .PageTitle {
    margin-bottom: 4px;
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 24px;
    color: var(--color-text40);
  }
  .label {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text40);
    &.mt {
      margin-top: 28px;
    }
  }
`;
export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  min-height: 72px;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid var(--color-cover12);
  .leftBox {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    margin-right: 8px;
    /* border-radius: 8px; */
  }
  .itemTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    color: var(--color-text);
  }
  .itemDesc {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    margin-top: 3px;
    color: var(--color-text60);
  }

  &.isSmStyle {
    padding: 16px;
    .logo {
      width: 40px;
      height: 40px;
    }
    .itemTitle {
      font-size: 14px;
    }
  }
`;
export const SelectIcon = styled(ICSuccessFilled)`
  font-size: 20px;
  flex-shrink: 0;
  color: var(--color-primary);
`;
export const UnSelectIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 20px;
  flex-shrink: 0;
  color: var(--color-icon40);
`;
export const ArrowIcon = styled(ICArrowUpOutlined)`
  font-size: 16px;
  color: var(--color-icon40);
  transform: ${({ isShowMoreList }) => (isShowMoreList ? 'scaleY(1)' : 'scaleY(-1)')};
`;
