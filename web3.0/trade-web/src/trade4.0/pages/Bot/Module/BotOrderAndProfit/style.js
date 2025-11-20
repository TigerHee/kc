/**
 * Owner: mike@kupotech.com
 */
import { Tabs } from '@mui/Tabs';
import { styled } from '@/style/emotion';

export const TabsPro = styled(Tabs)`
  height: auto;
  padding-left: 12px;
  margin-bottom: 8px;
  .KuxTabs-scrollButton {
    height: 24px;
    padding-top: 2px;
  }
  .KuxTabs-scroller {
    .KuxTabs-Container {
      padding-top: 0;
    }
  }
  .KuxTab-TabItem {
    height: 24px;
    border: none;
    border-radius: 4px;
    background: transparent;
    padding: 0 10px;
    margin-right: 8px;
    font-size: 12px;
    margin-left: 0 !important;
    color: ${(props) => props.theme.colors.text40};
    &:hover {
      color: ${(props) => props.theme.colors.text};
    }

    &.KuxTab-selected {
      color: ${(props) => props.theme.colors.text};
      background: ${(props) => props.theme.colors.cover4};
      font-weight: 500;
    }
  }
`;

TabsPro.Tab = Tabs.Tab;

export const Wrapper = styled.div`
  padding-top: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Scroller = styled.div`
  overflow-y: auto;
  flex: 1;
`;
