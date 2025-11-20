/**
 * owner: larvide.peng@kupotech.com
 */
import { Dialog, Divider, Empty, Spin, styled } from '@kux/mui';
import rectangle from 'static/slothub/rectangle.svg';
import { ItemType } from '../constants';

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 20px 32px;
  border-top: 0.5px solid ${(props) => props.theme.colors.cover8};
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.08) inset;
  ${(props) => props.theme.breakpoints.down('sm')} {
    border: none;
    box-shadow: none;
    .KuxButton-root {
      width: 100%;
    }
  }
  .cancel {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    cursor: pointer;
  }
`;
export const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  background-color: rgba(211, 244, 117, 0.4);
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  &::before {
    position: absolute;
    top: 40%;
    left: -3px;
    display: block;
    width: 6px;
    height: 14px;
    background: url(${rectangle}) no-repeat;
    transform: translateY(-50%);
    content: '';
    [dir='rtl'] & {
      top: 50%;
      transform: rotate(-180deg) translateY(50%);
    }
  }
  .text {
    padding-left: 4px;
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 10px;
    }
  }
`;
export const HistoryRecordItemWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 20px 32px 20px 0px;
  justify-content: space-between;
  align-items: center;
  &:nth-last-of-type(2) {
    &::after {
      display: none;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 12px 16px 12px 0px;
  }
  &::after {
    position: absolute;
    bottom: 0;
    display: block;
    width: calc(100% - 30px);
    height: 1px;
    background: ${(props) => props.theme.colors.cover8};
    content: '';
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: calc(100% - 14px);
    }
  }
`;
export const HistoryRecordExpiredItemWrapper = styled(HistoryRecordItemWrapper)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 16px 0px;
  }
`;
export const HistoryRecordItemDesc = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 13px;
  font-style: normal;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;
export const HistoryRecordItemTime = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-weight: 400;
  font-size: 13px;
  font-style: normal;
  line-height: 130%;
  margin-top: 12px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 14px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;
export const HistoryRecordExpiredItemTime = styled(HistoryRecordItemTime)`
  margin-top: 0px;
`;
export const HistoryRecordItemValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  font-style: normal;
  line-height: 130%;
  margin-left: 12px;
  overflow-x: initial !important;
  color: ${(props) => {
    if (props.type === ItemType.income || props.type === ItemType.inviteRecord) {
      return props.theme.colors.primary;
    } else {
      return props.theme.colors.text;
    }
  }};
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 18px;
  }
`;
export const FlexBox = styled.div`
  display: flex;
  align-items: center;
  .avatar {
    width: 46px;
  }
`;
export const HistoryRecordItemContent = styled.div`
  margin-left: 12px;
`;
export const HistoryRecordListWrapper = styled.div`
  height: 500px;
  max-height: calc(100vh - 64px);
  overflow-y: scroll;
  margin: 12px -32px 0 0;

  /* 在iOS设备上使用流畅的滚动 */
  -webkit-overflow-scrolling: touch;
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 425px;
    margin-right: -16px;
  }
  padding-right: 2px;
  * {
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      margin-right: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colors.cover8};
      border-radius: 2px;
    }
  }
`;
export const SpinStyled = styled(Spin)`
  display: block;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 216px auto 256px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 189px auto 208px;
  }
`;
export const ExpiredDescDialog = styled(Dialog)`
  .KuxDialog-body {
    ${(props) => props.theme.breakpoints.down('sm')} {
      max-width: 319px;
      margin: 0 auto;
    }
  }
  .KuxDialog-content {
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 32px 24px 24px;
    }
  }
  .KuxModalFooter-root {
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0px 32px 24px;
    }
  }
`;
export const HistoryRecordListFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    overflow: visible;
  }
  padding: 0px 32px 0px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-right: 16px;
  }
`;
export const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  margin: 133px 0px 133px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 120px;
    margin: 116px 0 0;
  }
`;
export const StyledEmpty = styled(Empty)`
  display: block;
  .KuxEmpty-img {
    height: 136px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 18px;
  }
`;
// 高度填充，避免切换Tab时高度抖动
export const EmptyFill = styled.div`
  height: 40px;
  width: 100%;
`;
export const DividerWrapper = styled(Divider)`
  width: 50% !important;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 0 0 24px 0;
  }
`;
