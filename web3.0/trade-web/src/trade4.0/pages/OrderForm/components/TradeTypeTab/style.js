/**
 * Owner: borden@kupotech.com
 */
import { styled } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { Tabs } from '@mui/Tabs';

export const TabsWrapper = styled(FlexColumm)`
  .KuxTab-TabItem {
    -webkit-text-stroke: unset;
  }

  ${(props) =>
    props.isFloat &&
    `
    .KuxTabs-scrollButton {
      background: ${props.theme.colors.layer};
    }
    ${
      props.theme.currentTheme === 'dark' &&
      `
        .KuxTabs-rightScrollButtonBg {
          background: none;
        }
        .KuxTabs-leftScrollButtonBg {
          background: none;
        }
    `
    }
    .markets {
      background-color: ${props.theme.colors.layer};
      border-radius: 4px;
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 8px 0px 24px rgba(0, 0, 0, 0.16);
      .symbol-pair {
        font-size: 14px;
      }
    }
    .KuxSpin-container {
      &::after {
         background: ${props.theme.colors.layer};
        }
    }
  `}
`;

// 合约融合 验收复写 Tabs 样式
export const MuiTabs = styled(Tabs)`
  height: 39px;
  .KuxTabs-scroller {
    display: flex;
    align-items: center;
  }
  .KuxTabs-Container {
    &[role='tablist'] {
      padding-top: unset;
    }
  }
`;
