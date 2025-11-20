/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 60px auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    max-width: 100%;
    margin: 60px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: auto;
    max-width: 100%;
    margin: 0px 0px 32px 0px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${(props) => (props.login ? '60px' : '117px')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: ${(props) => (props.login ? '40px' : '117px')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${(props) => (props.login ? '24px' : '108px')};
  }
`;

export const Aside = styled.aside`
  width: 320px;
  .seo_landing_aside {
    position: sticky;
    top: 140px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 200px;
  }
`;

export const Content = styled.div`
  width: calc(100% - 440px);
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100% - 240px);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
