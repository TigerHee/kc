/**
 * Owner: saiya.lee@kupotech.com
 */
import { styled, MDialog } from "@kux/mui";


export const TooltipContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 16px;
  color: ${(props) => props.theme.colors.text};

  ol {
    list-style-type: decimal;
    padding-left: 16px;
  }
  li + li {
    margin-top: 8px;
  }
`;

export const MTooltipDialog = styled(MDialog)`
  .KuxDrawer-content {
    display: flex;
    flex-direction: column;
  }
`;

export const LabelText = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;

export const OperatorActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  button.btn-receive {
    background-color: ${(props) => props.theme.currentTheme === 'dark' ? '#fff' : props.theme.colors.primary};
    color:  ${(props) => props.theme.currentTheme === 'dark' ? '#1d1d1d' : '#fff'};
  };

  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 16px;
    flex-direction: row;
    button {
      width: 162px;
      max-width: 162px;
    }
  }

`;
