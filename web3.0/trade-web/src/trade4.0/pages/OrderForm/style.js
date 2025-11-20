/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-15 11:51:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-05 14:31:32
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/style.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { withYScreen } from '@/pages/OrderForm/config';

export const Wrapper = styled(FlexColumm)`
  ${fx.flex(1)}
  overflow-y: auto;
`;
export const WithPadding = styled.div`
  padding: 0 12px;
`;
export const OrderTypeTabBox = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  .KuxTabs-scrollButton {
    padding-top: 8px;
  }
  ${(props) =>
   props.isFloat &&
    `
    .KuxTabs-scrollButton {
      background: ${props.theme.colors.layer};
      padding-top: 10px;
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
    }
     `}
  `}
  ${(props) => {
    if (!props.isMd) {
      return `
        width: 100%;
        justify-content: space-between;
      `;
    }
  }}
`;
export const TabBar = styled(WithPadding)`
  display: block;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
`;

export const OrderTabBar = styled(TabBar)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
`;

export const Content = withYScreen(styled(WithPadding)`
  padding-top: 8px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    padding-top: 4px;
  `)}
`);

export const Container = styled.div`
  display: flex;
`;

export const FormContainer = styled.div`
  flex: 1;
  &:not(:first-of-type) {
    margin-left: 24px;
  }
`;
export const PwdGuide = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

export const AuctionTradeDescWrapper = styled.div`
  padding: 16px 12px 0;
  .KuxAlert-root {
    font-weight: 400;
  }
`;
