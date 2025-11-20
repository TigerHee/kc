/**
 * Owner: will.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const PortfolioSectionContainer = styled.div`
  width: 100%;
`;

export const PortfolioContent = styled.div`
  width: 1200px;
  margin: 0 auto 120px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 0 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 0 16px;
    margin: 0 auto 40px;
  }
`;

export const Portfoliotitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const PortfolioParagraph = styled.p`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 16px auto 64px;
  width: 800px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin: 16px auto 56px;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
    margin: 8px auto 24px;
  }
`;

export const PortfolioListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }
`;
