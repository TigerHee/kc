/*
 * @owner: borden@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import { isChrome } from 'src/utils/judgeChrome';
import TimeCountDown from '../../components/TimeCountDown';

export const Container = styled.section`
  border-radius: 12px;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 16px;
  border-radius: 20px;
  border: 0.5px solid ${(props) => props.theme.colors.cover8};
  background-color: ${(props) => props.theme.colors.overlay};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    border: 0.5px solid ${(props) => props.theme.colors.cover4};
    border-radius: 12px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04);
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 32px;
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Title = styled.h2`
  width: 100%;
  margin-bottom: 0;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  /* line-height: 130%; */
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-weight: 700;
    font-size: 28px;
  }
`;

export const Balance = styled.div`
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 16px;
  margin-top: 2px;
  color: ${(props) => props.theme.colors.text40};
  .highlight {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 8px;
    font-size: 16px;
    .highlight {
      font-weight: 600;
    }
  }
`;

export const TaskList = styled.div`
  min-height: 80px;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: flex;
  }
`;

export const TaskItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    align-items: stretch;
    margin-top: 24px;
    padding: 24px;
    border-radius: 16px;
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    flex: 1;
    &:not(:first-of-type) {
      margin-left: 24px;
    }
  }
`;

export const KycItem = styled(TaskItem)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: column;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  &:not(:first-of-type) {
    margin-top: 20px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 10px;
    }
  }
`;

export const TaskInfos = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskInfo = styled.div`
  &:not(:first-of-type) {
    margin-left: 19px;
  }
`;

export const Data = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 500;
    font-size: 12px;
  }
  color: ${(props) => props.theme.colors.text};
  .grey {
    color: ${(props) => props.theme.colors.text40};
  }
`;

export const Desc = styled.div`
  font-size: 13px;
  line-height: 130%;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 4px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
    transform: scale(0.83);
    transform-origin: 0 100%;
  }
`;

export const TimeBox = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 2px 4px;
  margin-left: 16px;
  border-radius: 4px;
  margin-top: 1.25px;
  background: linear-gradient(90deg, rgba(211, 244, 117, 0.1) 0%, rgba(211, 244, 117, 0.4) 100%);
`;

export const TimeLabel = styled.div`
  font-size: 14px;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: ${isChrome ? '12px' : '10px'};
    zoom: ${isChrome ? 0.83 : 'unset'};
  }
`;

export const Time = styled.div`
  padding: 2px 1px;
  background-color: #d3f475;
  font-size: 13px;
  font-weight: 600;
  line-height: 130%;
  &:first-of-type {
    margin-left: 5px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const TaskTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  & > span > span {
    margin: 0 4px;
    color: ${(props) => props.theme.colors.primary};
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-weight: 600;
    font-size: 20px;
  }
`;

export const TaskOpration = styled.div`
  width: 100%;
  text-align: right;
  margin-top: 10px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 20px;
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-top: unset;
  }
`;

export const Invite = styled.div`
  padding: 20px 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  border: 0.5px solid #d3f475;
  border-top: none;
  background: rgba(211, 244, 117, 0.24);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-top: -12px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: -16px;
    padding: 32px 16px 16px;
    font-size: 20px;
  }
`;

export const InviteTitle = styled.span`
  transform: translateY(-1px);
  .highlight {
    margin: 0 4px;
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const StyledButton = styled(Button)`
  position: relative;
  ${(props) =>
    props.disabled
      ? `
    color: ${props.theme.colors.text40};
    background-color: rgba(29, 29, 29, 0.04);
  `
      : ''}
`;

export const StyledTimeCountDown = styled(TimeCountDown)`
  .tag-item {
    font-size: ${({ isH5 }) => (isH5 ? '' : '13px')};
  }
`;
