/**
 * Owner: mike@kupotech.com
 */
import { styled, Spin } from '@kux/mui';
import { Container } from '../styled';

const BotItem = styled.a`
  padding: 12px 24px;
  display: block;
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
  }
`;
const Avatar = styled.img`
  width: 24px;
  height: 24px;
`;
const Name = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0 8px 0 4px;
`;
const Note = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
  color: ${(props) => props.theme.colors.text40};
  margin-top: 4px;
`;
const Scroller = styled(Container)`
  overflow-y: auto;
  background-clip: border-box !important;
  &::-webkit-scrollbar {
    background: transparent;
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${(props) => props.theme.colors.cover8};
  }
`;

const ClipScrollerBar = styled.div`
  overflow: hidden;
  border-radius: 0px 16px 16px 0px;
`;
const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const MSpin = styled(Spin)`
  width: 100%;
  height: 100%;
`;
export { BotItem, Avatar, Flex, Name, Note, Scroller, ClipScrollerBar, MSpin };
