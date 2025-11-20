import { styled } from '@kux/mui';
import NoSSGModal from '../../components/NoSSGModal';

export const Wrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-clip: padding-box !important;
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 32px 32px;
  border: none;
  margin-left: 12px;
  cursor: pointer;
  font-family: inherit;
  svg {
    color: ${(props) => props.theme.colors.text};
  }
  span {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 14px;
  }
  &:hover {
    svg,
    span {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  ${(props) =>
    props.inTrade && {
      width: '32px',
      height: '32px',
      'span': {
        fontSize: '11.2px',
      },
    }}
`;

export const TabsWrapper = styled.div`
  .KuxTabs-indicator {
    display: none;
  }
`;

export const DialogWrapper = styled(NoSSGModal)`
  .KuxModalHeader-root {
    .KuxModalHeader-close {
      top: 24px !important;
    }
  }
  .KuxDialog-content {
    padding: 0;
    border-radius: 0 0 20px 20px;
  }
`;

export const OverlayWrapper = styled.div`
  min-width: 340px;
  height: 530px;
  display: flex;
  background: ${(props) => props.theme.colors.layer};
  flex-direction: column;
  & .title {
    color: ${(props) => props.theme.colors.text60};
    padding: 8px 48px;
    font-size: 12px;
    line-height: 20px;
  }
  & .group {
    height: 480px;
    flex-flow: wrap;
    display: flex;
    overflow: auto;
    list-style: none;
    align-content: flex-start;
    padding-left: 20px;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: ${(props) => props.theme.colors.text20};
    }
    & button {
      font-family: inherit;
    }
    & .menuItem {
      padding: 10px 8px;
      color: ${(props) => props.theme.colors.text};
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
      width: 192px;
      height: 48px;
      margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      border: none;
      text-align: left;
      background: transparent;
      & span {
        position: relative;
      }
      &:hover {
        background: ${(props) => props.theme.colors.cover2};
      }
      & .iconCurrency {
        margin-right: 8px;
        margin-left: 4px;
      }
    }
    & .activeItem {
      color: ${(props) => props.theme.colors.primary};
      span {
        display: flex;
        svg {
          margin-left: 16px;
        }
      }
      & img {
        position: absolute;
        top: 50%;
        right: -18px;
        transform: translate3d(0, -50%, 0);
      }
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  overflow: auto;
`;

export const OverlayTitle = styled.h4`
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin: 0px 32px 12px 32px;
`;

export const InDrawer = styled.div`
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  padding-bottom: 100px;
  .title {
    color: ${(props) => props.theme.colors.text};
    margin: 16px 12px 24px;
    padding-left: 20px;
    font-size: 24px;
    font-weight: 700;
    line-height: 130%;
  }
  .group {
    padding: 0 20px;
    list-style: none;
    & button {
      font-family: inherit;
    }
    .menuItem {
      padding: 13.5px 12px;
      margin-bottom: 12px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      font-weight: 500;
      font-size: 16px;
      color: ${(props) => props.theme.colors.text};
      border-radius: 8px;
      border: none;
      background: transparent;
      &.activeItem {
        flex-direction: row-reverse;
        color: ${(props) => props.theme.colors.primary};
        & span {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
      &:hover {
        background: ${(props) => props.theme.colors.cover2};
      }
    }
  }
`;

export const TabsSpan = styled.h3`
  margin: 0px;
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
`;
