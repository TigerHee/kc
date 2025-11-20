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
  margin-top: ${(props) => (props.inDrawer ? '0' : props.miniMode ? '14px' : '20px')};
  overflow: hidden;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.inDrawer ? '12px 0 8px' : '24px 12px')};
  position: relative;
  width: ${(props) => (props.inDrawer ? '100%' : '432px')};
  height: ${(props) => (props.inDrawer ? '100%' : '560px')};
  background: ${(props) => props.theme.colors.layer};
  border-radius: 20px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  padding: ${(props) => (props.inDrawer ? '0px' : '0 12px')};
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    opacity: 0.4;
  }
`;

const GetMore = styled.div`
  display: inline-block;
  padding: ${(props) => (props.inDrawer ? '8px 0px 0px' : '8px 12px 0px')};
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  margin: ${(props) => (props.inDrawer ? '12px 0' : '12px')};
  font-weight: 400;
  height: 1px;
  background: ${(props) => props.theme.colors.cover4};
  flex-shrink: 0;
`;

const BlankWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.inDrawer ? '100%' : '432px')};
  height: ${(props) => (props.inDrawer ? '100%' : '560px')};
  background: ${(props) => props.theme.colors.layer};
  box-shadow: ${(props) =>
    props.inDrawer ? 'unset' : '0px 0px 1px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.05);'};
  border-radius: 20px;
`;

export { Container, BoxWrapper, Title, Wrapper, GetMore, Divider, BlankWrapper };
