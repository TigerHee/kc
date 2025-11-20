/**
 * Owner: will.wang@kupotech.com
 */

import { styled } from '@kux/mui';

export const OurStoryBannerWrapperBg = styled.section`
  overflow: hidden;
  background: linear-gradient(180deg, rgba(243, 243, 243, 0.02) 0%, rgba(243, 243, 243, 0.00) 54.31%);
`

export const OurStoryBannerWrapper = styled.div`
  width: 1200px;
  margin: 88px auto 140px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 0 32px;
    margin: 88px auto 120px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 40px auto 0;
    padding: 0 16px;
  }
`;

export const OurStoryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 20px;
  }
`;

export const OurStoryContentTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 36px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const OurStoryContentParagraphBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 48px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 28px;
    gap: 8px;
  }
`;

export const OurStoryContentParagraph = styled.p`
  color: ${(props) => props.theme.colors.text60};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 18px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;

export const OurStoryBannerSubContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  flex-direction: row;

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 20px;
    justify-content: flex-start;
  } 

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`;
export const OurStoryBannerSubContentCard = styled.div`
  display: flex;
  width: 580px;
  min-height: 300px;
  padding: 40px 32px;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.cover4};
  background: ${(props) => props.theme.colors.cover4};

  background-image: url(${(props) => props.bg});
  background-size: 192px 104px;
  background-repeat: no-repeat;
  background-position: right 32px bottom 27px;
  
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    min-height: 274px;
    padding: 40px 32px;
    background-position: right 26px bottom 20px;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 20px 94px;
    min-height: 186px;
    background-size: 120px 65px;
    background-position: right 16px bottom 20px;
  }
`;

export const OurStoryBannerSubContentCardTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 12px 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;


export const OurStoryBannerSubContentCardParagraph = styled.p`
  color: ${(props) => props.theme.colors.text40};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
