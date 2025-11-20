/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { ICArrowRightOutlined, ICCloseFilled, ICTriangleTopOutlined } from '@kux/icons';
import { Popover } from '@kux/mui';

export const PopoverStyled = styled(Popover)`
  .KuxPopover-root {
    position: relative;
    top: -4px;
    width: 587px;
    max-width: 100vw;
    margin-top: -4px;
    background-color: ${({ theme }) => theme.colors.layer};

    .KuxPopover-content {
      padding: 0;
    }
  }
`;

export const SelectBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 0 16px;
  border: 1px solid
    ${({ active, error, theme }) =>
    error ? theme.colors.secondary : active ? theme.colors.primary : theme.colors.cover12};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    .triangle {
      opacity: 0.6;
    }
  }

  [dir='rtl'] & {
    direction: ltr;
  }
`;

export const TagBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  height: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  gap: 5px;
  padding: 9px 0;
  max-width: calc(100% - 16px);

  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;

export const Tag = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 36px;
  max-width: 100%;
  padding: 0 8px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 8px;
  cursor: auto;
`;

export const TagText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
`;

export const TagClose = styled(ICCloseFilled)`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-left: 8px;
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.colors.icon40};

  &:hover {
    color: ${({ theme }) => theme.colors.icon60};
  }
`;

export const Placeholder = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  color: ${({ theme, hasError }) => (hasError ? theme.colors.secondary : theme.colors.text40)};
  font-weight: 400;
  font-size: 16px;
  transition: all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  transform-origin: left top;
  transform: translate(0, 15px);
  padding: 0 16px;
  ${({ top, theme, active, hasError }) => {
    return top
      ? `
  transform-origin: left top;
  padding: 0 2px;
  white-space: nowrap;
  font-size: 16px;
  line-height: 24px;
  transform: translate(14px, -9px) scale(0.75);
  color: ${hasError ? theme.colors.secondary : active ? theme.colors.primary : theme.colors.text};
  pointer-events: none;
  background-color: ${theme.colors.layer};`
      : '';
  }};
`;

export const TriangleBox = styled.div`
  width: 16px;
  height: 16px;
`;

export const Triangle = styled(ICTriangleTopOutlined)`
  display: block;
  width: 16px;
  height: 16px;
  transition: transform 300ms;
  transform: ${({ active }) => (active ? 'rotate(0deg)' : 'rotate(-180deg)')};
  user-select: none;
  color: ${({ theme }) => theme.colors.text};
`;

export const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

export const Column = styled.div`
  flex-shrink: 0;
  width: 33.33%;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 16px 0;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  white-space: nowrap;
  cursor: pointer;
  background: ${({ active, theme }) => (active ? theme.colors.cover4 : 'transparent')};
  font-weight: ${({ active }) => (active ? '500' : '400')};
`;

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 12px);
  gap: 8px;
`;
export const ItemArrow = styled(ICArrowRightOutlined)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;

  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;
export const ItemCheckIcon = styled.div`
  width: 20px;
  height: 20px;
  user-select: none;
`;

export const ItemText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  width: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

export const WarnTips = styled.span`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.complementary};
`;
