/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';
import { Tabs } from '@mui/Tabs';
import { withYScreen } from '@/pages/OrderForm/config';

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;

export const Container = withYScreen(styled.div`
  display: grid;
  margin-bottom: 12px;
  ${props => props.$useCss(['md', 'sm'])(`
    margin-bottom: 4px;
  `)}
`);

export const LeftBox = styled(FlexBox)`
  flex: 1;
  /* flex-wrap: wrap; */
  overflow: hidden;
  justify-content: space-between;
`;

export const TabsPro = styled(Tabs)`
  &.KuxTabs-container {
    height: 24px;
  }

  .KuxTabs-scrollButton {
    height: 24px;
    padding-top: 2px;
  }

  .KuxTab-TabItem {
    height: 24px;
    border: none;
    border-radius: 4px;
    background: transparent;
    padding: 0 8px;

    + .KuxTab-TabItem {
      margin-left: 0;
    }
    color: ${props => props.theme.colors.text40};

    &:hover {
      color: ${props => props.theme.colors.text};
    }

    &.KuxTab-selected {
      color: ${props => props.theme.colors.text};
      background: ${props => props.theme.colors.cover8};
    }
  }
`;
