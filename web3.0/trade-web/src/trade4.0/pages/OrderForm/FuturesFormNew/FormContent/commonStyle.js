/**
 * Owner: garuda@kupotech.com
 */
import KuxAlert from '@mui/Alert';
import Divider from '@mui/Divider';

import { styled, withYScreen } from '../builtinCommon';

import OrderTypes from '../components/OrderTypes';

export const FormContentWrapper = withYScreen(styled.div`
  padding: 12px 0;
  .trade-form-item {
    margin-bottom: 10px;
    user-select: none;
  }
  .small-tool {
    margin-right: 4px;
  }
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    padding: 8px 0;
    .trade-form-item {
      margin-bottom: 5px;
    }
  `)}
  ${(props) =>
    props.$useCss(['sm'])(`
   padding: 4px 0;
  `)}
  .futures-header-bar {
    padding: 0 12px;
  }
  /* .KuxTabs-container {
    margin-bottom: 12px;
    
    ${(props) =>
    props.$useCss(['md', 'sm'])(`
      margin-bottom: 6px;
  `)}
  } */
  .KuxForm-form {
    padding: 0 12px;
  }
`);

export const OrderTypesWrapper = withYScreen(styled(OrderTypes)`
  margin-bottom: 8px;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin-bottom: 6px;
  `)}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
  .KuxTabs-container {
    margin: 0;
  }
`);

export const DividerWrapper = withYScreen(styled(Divider)`
  margin: 8px 0;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
  margin: 5px 0;
`)}
`);

export const Alert = styled(KuxAlert)`
  align-items: flex-start;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
  .KuxAlert-icon {
    padding: 0 6px 0 0;
  }
  .KuxAlert-title {
    font-size: 12px;
    line-height: 16px;
  }
`;
