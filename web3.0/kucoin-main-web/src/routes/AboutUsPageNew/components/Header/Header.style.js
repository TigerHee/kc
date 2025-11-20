/**
 * Owner: will.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const HeaderContainer = styled.div`
  display: flex;
  padding: 130px 0 120px 0;
  flex-direction: column;
  align-items: center;
  width: 1200px;
  margin: 0 auto;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 110px 32px 81px;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: auto;
    padding: 40px 16px 44px;
  }
`;

export const MainTitle = styled.h1`
  width: auto;
  text-align: center;
  font-size: 46px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 24px;

  background: ${props => props.isDark ?
  `
    linear-gradient(
      90deg,
      #7A7A7A 0%,
      #f3f3f3 49%,
      #7A7A7A 100%
    )
  ` :
  `unset`};

  color: ${props => props.theme.colors.text};
  background-clip: ${props => props.isDark ? 'text' : 'unset'};
  -webkit-background-clip: ${props => props.isDark ? 'text' : 'unset'};
  -webkit-text-fill-color: ${props => props.isDark ? 'transparent' : 'unset'};

  .hl-text {
    // 解决某些语种文字（泰文）描边问题
    padding: 10px 0;

    background: ${props => props.isDark ? 'linear-gradient(to right, #0d7a5a, #03b47f)' : 'unset'};
    color: ${props => props.isDark ? 'transparent' : props.theme.colors.primary};

    background-clip: ${props => props.isDark ? 'text' : 'unset'};
    -webkit-background-clip: ${props => props.isDark ? 'text' : 'unset'};
    -webkit-text-fill-color: ${props => props.isDark ? 'transparent' : 'unset'};

  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 40px;
    width: 704px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 26px;
    width: auto;
    margin-bottom: 8px;
  }
`;

export const Desc = styled.p`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.7;
  margin: 0;

  width: 800px;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 704px;
    font-size: 18px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
    width: auto;
  }
`;

export const DigitalContentList = styled.div`
  width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;

  margin: 110px auto 0;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    margin: 80px auto 0;
    gap: 10px;
    justify-content: center;
    
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: auto;
    margin: 44px auto 48px;
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px 0;
    justify-content: unset;
    margin: 48px auto 0;
    align-items: start;
  }
`;

export const DigitalContentItem = styled.dl`
  display: flex;
  width: 220px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0px;
  

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    min-width: 140px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: ${props => props.smWidth || 160}px;
    gap: 4px;
    justify-content: flex-start;
  }
`;

export const DigitalContentItemDigit = styled.dt`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.5;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }

`;
export const DigitalContentItemDesc = styled.dd`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const DigitalDivider = styled.span`
  width: 1px;
  height: 64px;
  background-color: ${(props) => props.theme.colors.cover8};
  flex: 0 0 1px;
`;
