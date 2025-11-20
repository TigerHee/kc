/**
 * Owner: garuda@kupotech.com
 */
import { ICQuestionOutlined } from '@kux/icons';
import Dialog from '@mui/Dialog';
import Tooltip from '@mui/Tooltip';

import { styled } from '../../builtinCommon';
// import ScrollWrapper from '@/components/ScrollWrapper';

export const IconWrapper = styled(ICQuestionOutlined)`
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 12px;
  color: ${({ theme }) => {
    return theme.colors.icon60;
  }};
  flex: 0 0 auto;

  &:hover {
    color: ${({ theme }) => {
      return theme.colors.icon;
    }};
  }
`;

export const TooltipTextWrapper = styled.span`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => {
      return theme.colors.textPrimary;
    }};
  }
`;

export const ModalWrapper = styled(Dialog)`
  width: 100%;

  .KuxModalHeader-root {
    height: 90px !important;
  }

  .KuxDialog-body {
    height: 640px;
    max-height: 90%;
  }

  .KuxDialog-content {
    flex: 1;
    padding: 0;
    overflow: hidden;
  }

  .KuxModalFooter-root {
    padding: 20px 32px;
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }

  &.KuxMDrawer-root {
    height: 80% !important;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxDrawer-content {
      display: flex;
      flex-direction: column;
    }
    .KuxModalHeader-root {
      height: 56px !important;
    }
    .KuxMDialog-content {
      flex: 1;
      padding: 0;
      overflow: hidden;
    }

    .KuxModalFooter-root {
      padding: 24px 16px 16px;
      border-top: none;
    }
  }
`;

export const Content = styled.div`
  padding: 24px 32px 32px;
  height: calc(100% - 48px);
  overflow-y: auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
    // height: 100%;
  }
`;

export const TabsBar = styled.div`
  width: 100%;
  height: 48px;

  .KuxTabs-container {
    padding: 0 32px;
  }

  .KuxTabs-scrollButtonRight {
    right: 16px;
  }

  .KuxTabs-scrollButtonLeft {
    left: 16px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxTabs-container {
      padding: 0 12px;
    }

    .KuxTabs-scrollButtonRight {
      right: 8px;
    }

    .KuxTabs-scrollButtonLeft {
      left: 8px;
    }
  }

  ${(props) =>
    props.theme.currentTheme === 'dark' &&
    `
      .KuxTabs-rightScrollButtonBg {
    background: none;
      }
      .KuxTabs-leftScrollButtonBg {
    background: none;
      }
     `}
`;

export const DescText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => {
    return theme.colors.text60;
  }};
`;
export const LinkText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  text-decoration-line: underline;
  margin-top: 16px;
  color: ${({ theme }) => {
    return theme.colors.textPrimary;
  }};
`;

export const QuestionTooltipWrapper = styled(Tooltip)`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  flex: 0 0 auto;
`;

export const TooltipText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
`;
