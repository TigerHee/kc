/**
 * Owner: will.wang@kupotech.com
 */

import { styled } from '@kux/mui';

export const OurAdvantedgesBanner = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1200px;
  margin: 0 auto;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 0 32px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 40px 16px 0;
  }
`;

export const OurAdvantedgesBannerTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;

  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;

  margin: 0;
  margin-bottom: 16px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 36px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    margin-bottom: 8px;
  }

`;

export const OurAdvantedgesBannerParagraph = styled.p`
  color: ${(props) => props.theme.colors.text40};

  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  margin-bottom: 68px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
    margin-bottom: 20px;
  }
`;

export const OurAdvantedgesBannerCardBox = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 24px;
  list-style: none;
  margin: 0px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    display: grid;
    flex-direction: unset;
    justify-content: unset;
    grid-template-columns: repeat(2, 1fr);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
`;

export const OurAdvantedgesBannerCard = styled.li`
  display: flex;
  padding: 44px 20px 48px 20px;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;

  min-height: 369px;

  border-radius: 16px;
  color: ${(props) => props.theme.colors.cover4};
  border: 1px solid ${(props) => props.theme.colors.cover4};
  background: ${(props) => props.theme.colors.cover4};

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 44px 20px;
    min-height: 321px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 28px 20px;
    min-height: 214px;
  }
`;

export const OurAdvantedgesBannerCardTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  margin-bottom: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

export const OurAdvantedgesBannerCardImg = styled.img`
  width: 80px;
  height: 80px;
  aspect-ratio: 1/1;
  margin-bottom: 32px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
  }
`;

export const OurAdvantedgesBannerCardParagraph = styled.p`
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
