/**
 * Owner: roger@kupotech.com
 */
import { styled } from '@kux/mui';

const Container = styled.div`
  width: ${(props) => (props.inDrawer ? '100%' : '432px')};
  height: ${(props) => (props.inDrawer ? '100%' : '560px')};
  border-radius: 20px;
  box-shadow: ${(props) =>
    props.inDrawer ? 'unset' : '0px 0px 1px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.05);'};
  background: ${(props) => props.theme.colors.layer};
  overflow: hidden;
  margin-top: ${(props) =>
    props.inDrawer ? '0px' : props.inTrade ? '6px' : props.miniMode ? '14px' : '16px'};
  ${(props) => props.theme.breakpoints.down('xl')} {
    margin-top: ${(props) =>
      props.inDrawer ? '0px' : props.inTrade ? '6px' : props.miniMode ? '14px' : '12px'};
  }
`;
const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.inDrawer ? '4px 0 12px' : '12px 24px 24px')};
  position: relative;
  width: ${(props) => (props.inDrawer ? '100%' : '432px')};
  height: ${(props) => (props.inDrawer ? '100%' : '560px')};
  background: ${(props) => props.theme.colors.layer};
  overflow: auto;
  border-radius: 20px;
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
const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-weight: ${(props) => (props.inDrawer ? 500 : 400)};
  font-size: ${(props) => (props.inDrawer ? '12px' : '14px')};
  line-height: 130%;
  color: ${(props) => props.theme.colors.text30};
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  svg {
    opacity: 0.4;
  }
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row wrap;
`;

const H5Content = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: block;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${(props) => props.theme.colors.cover8};
  }
`;

const HistoryItem = styled.a`
  height: ${(props) => (props.inDrawer ? '30px' : '34px')};
  padding: ${(props) => (props.inDrawer ? '0px' : '0 12px')};
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
  text-decoration: none;
  direction: ltr;
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
  }
  &:last-of-type {
    margin-right: 0;
  }
`;
const SymbolItem = styled.a`
  width: 120px;
  height: 82px;
  padding: 12px 9px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text60};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-bottom: 10px;
  text-decoration: none;
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
  }
`;

const H5SymbolItem = styled.a`
  width: 158px;
  height: 62px;
  padding: 12px;
  display: inline-block;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text60};
  margin-left: 8px;
  margin-bottom: 10px;
  text-decoration: none;
  &:first-of-type {
    margin-left: 0;
  }
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
  }
`;

export {
  Container,
  BoxWrapper,
  Title,
  Wrapper,
  Content,
  HistoryItem,
  SymbolItem,
  H5Content,
  H5SymbolItem,
};
