/*
 * owner: Borden@kupotech.com
 */
import styled from '@emotion/styled';
import TooltipOver from '@/components/TooltipOver';
import dropStyle from '@/components/DropdownSelect/style';
import DropdownSelect from '@/components/DropdownSelect';

const CenterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const GroupHeader = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text60};
`;
export const GroupBody = styled.div`
  width: 412px;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
`;
export const GroupItem = styled.div`
  width: 128px;
  cursor: pointer;
  text-align: center;
  position: relative;
  color: ${(props) => props.theme.colors[props.active ? 'text' : 'text40']};
  &:not(:nth-of-type(3n + 1)) {
    margin-left: 14px;
  }
  &:not(:nth-last-of-type(-n + 3)) {
    margin-bottom: 10px;
  }
  ${(props) => {
    if (props.active) {
      return `
        .layoutSetting_itemPicture {
          border-color: ${props.theme.colors.primary};
        }
      `;
    }
  }}
  &:hover {
    color: ${(props) => props.theme.colors.text};
    .layoutSetting_actions {
      visibility: visible;
    }
    .layoutSetting_itemPicture {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }
`;
export const Actions = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  display: flex;
  visibility: hidden;
  cursor: default;
`;
export const ActionBox = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${(props) => props.theme.colors.cover8};
  color: ${(props) => props.theme.colors.text40};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
  &:not(:last-of-type) {
    margin-right: 8px;
  }
`;
export const ItemPicture = styled(CenterBox)`
  width: 100%;
  height: 80px;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: ${(props) => props.theme.colors.cover8};
`;
export const ItemTitle = styled(TooltipOver)`
  font-weight: 500;
  font-size: 12px;
  margin-top: 10px;
`;
export const ModuleList = styled.div`
  margin: 20px 0px;
`;
export const Module = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:last-of-type) {
    margin-bottom: 28px;
  }
`;
export const ModuleName = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const RecommendedWrapper = styled.div`
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${(props) => props.theme.colors.cover4};
`;

export const RecommendedText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    align-items: center;
    height: 100%;
    padding: 0 2px 0 0;
  `,
  Icon: styled(dropStyle.Icon)`
    svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
  `,
};

export const DropdownSelectWrapper = styled(DropdownSelect)`
  font-size: 12px;
  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;
