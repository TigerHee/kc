/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px;
  border-radius: 16px;
  background: ${({ bgTheme }) =>
    bgTheme === 'black' ? 'rgba(243, 243, 243, 0.02)' : 'rgba(29, 29, 29, 0.02)'};
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

export const TitleWrapper = styled.span`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  img {
    width: ${({ bgTheme }) => (bgTheme ? '32px' : '20px')};
    height: ${({ bgTheme }) => (bgTheme ? '32px' : '20px')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

export const Title = styled.h3`
  color: ${({ bgTheme }) => (bgTheme === 'black' ? '#F3F3F3' : '#1d1d1d')};
  font-size: 24px;
  font-weight: 500;
  line-height: 130%;
  flex: 1;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 24px 0px;
  background: ${({ bgTheme }) =>
    bgTheme === 'black' ? 'rgba(243, 243, 243, 0.04)' : 'rgba(29, 29, 29, 0.04)'};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 0px;
  }
`;

export const Description = styled.div`
  color: ${({ bgTheme }) =>
    bgTheme === 'black' ? 'rgba(243, 243, 243, 0.40)' : 'rgba(29, 29, 29, 0.4)'};
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  p {
    margin: 0px;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    color: ${({ bgTheme }) =>
      bgTheme === 'black' ? 'rgba(243, 243, 243, 0.60)' : 'rgba(29, 29, 29, 0.6)'};
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
  }
`;

export const AnimationContent = styled.div`
  min-height: 0px;
  height: ${(props) => (props.open ? props.contentHeight : 0)}px;
  overflow: hidden;
  transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;
