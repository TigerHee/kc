/**
 * Owner: will.wang@kupotech.com
 */
const { styled } = require('@kux/mui');

export const HeaderContainer = styled.div`
  width: 100%;
  height: 560px;
  background: linear-gradient(180deg, rgba(1, 188, 141, 0.04) 0%, rgba(1, 188, 141, 0) 100%);

  ${(props) => props.theme.breakpoints.down('lg')} {
    height: 480px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: unset;
  }
`;

export const HeaderContent = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  flex-direction: row;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 0 32px;
    gap: 0;
    justify-content: center;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 0 16px;
    gap: 20px;
    flex-direction: column;
    align-items: center;
  }
`;

export const HeaderTitleBox = styled.div`
  width: 600px;
  margin-top: 100px;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    margin-top: 88px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin-top: 32px;
  }
`;

export const HeaderMainTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 54px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;

  .web3, .tech {
    color: ${(props) => props.theme.colors.primary};
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 40px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    text-align: center;
    font-size: 26px;
  }

  
`;

export const HeaderHighlightText = styled.span`
  
`;

export const HeaderParagraph = styled.p`
  margin: 24px 0 0;
  
  color: ${(props) => props.theme.colors.text60};
  font-size: 20px;
  font-weight: 400;
  line-height: 150%;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 20px 0 0;
    font-size: 18px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    text-align: center;
    margin: 8px 0 0;
  }
`;

export const HeaderLogoBox = styled.div`
  width: 520px;
  height: 520px;
  margin-top: 40px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 350px;
    height: 350px;
    margin-top: 53px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 240px;
    height: 240px;
    margin-top: 0;
  }
`;
