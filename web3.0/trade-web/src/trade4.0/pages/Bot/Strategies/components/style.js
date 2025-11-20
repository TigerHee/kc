/**
 * Owner: mike@kupotech.com
 */
import { styled } from '@/style/emotion';
import Spin from '@mui/Spin';
import Dialog from '@mui/Dialog';

export const SpinWrapper = styled(Spin)`
  height: 100%;
  .KuxSpin-container {
    height: 100%;
    display: flex;
    flex-flow: column;
    padding: 0 32px;
  }
`;

export const TabsWrapper = styled.div`
  padding: 0 12px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
`;

export const ButtonWrapper = styled.div`
  margin-left: -32px;
  margin-right: -32px;
  padding: 20px 32px;
  text-align: right;
  border-top: 1px solid;
  border-top-color: ${(props) => props.theme.colors.divider4};
`;

export const Flex1 = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  > div {
    height: 100%;
  }
`;
