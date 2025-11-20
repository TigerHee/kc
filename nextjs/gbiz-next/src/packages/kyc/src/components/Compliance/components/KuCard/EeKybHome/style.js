/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import {
  ICSuccessFilled,
  RightOutlined,
  ICEdit2Outlined,
  ICTradeAddOutlined,
  ICDeleteOutlined,
} from '@kux/icons';

export const Container = styled.div`
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    margin-bottom: 8px;
    color: var(--color-text);
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 16px;
    color: var(--color-text40);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .item {
    border-radius: 8px;
    border: 1px solid var(--color-divider8);
  }
  .itemContent {
    padding: 20px 16px;
    cursor: pointer;
    min-height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .itemLeft {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .itemTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    color: var(--color-text);
  }
  .uboInfo {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 16px 16px;
    align-items: flex-start;
  }
  .uboItem {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    min-height: 44px;
    padding: 8px 16px;
    background-color: var(--color-cover2);
  }
  .uboItemLeft {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text);
  }
  .uboItemRight {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .uboDesc {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text40);
  }
  &.isSmStyle {
    .desc {
      margin-bottom: 32px;
    }
  }
`;
export const CheckIcon = styled(ICSuccessFilled)`
  font-size: 24px;
  color: var(--color-icon60);
  &.isComplete {
    color: var(--color-primary);
  }
`;
export const RightArrowIcon = styled(RightOutlined)`
  flex-shrink: 0;
  font-size: 20px;
  color: var(--color-icon60);
`;
export const EditIcon = styled(ICEdit2Outlined)`
  flex-shrink: 0;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-icon60);
`;
export const AddIcon = styled(ICTradeAddOutlined)`
  flex-shrink: 0;
  font-size: 16px;
  margin-right: 4px;
  color: var(--color-text);
`;
export const DeleteIcon = styled(ICDeleteOutlined)`
  flex-shrink: 0;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-icon60);
`;
