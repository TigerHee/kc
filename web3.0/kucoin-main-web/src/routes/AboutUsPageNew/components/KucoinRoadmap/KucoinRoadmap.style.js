/**
 * Owner: will.wang@kupotech.com
 */

import { Accordion, styled } from '@kux/mui';

export const RoadmapWrapper = styled.section`
  width: 1200px;
  margin: 160px auto 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: auto;
    padding: 0 32px;
    margin: 120px auto 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 40px auto;
    padding: 0 16px;
  }
`;

export const RoadmapWrapperTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 32px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

export const RoadmapAccordion = styled(Accordion.AccordionPanel)`
  & .KuxAccordion-head:not(.KuxAccordion-active) {
    border-bottom: 1px solid ${props => props.theme.colors.cover12};
  }

  & .KuxAccordion-head.KuxAccordion-active {
    border-bottom: none;
    padding-bottom: 28px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      padding-bottom: 16px;
    }
  }

  & .KuxAccordion-panel.KuxAccordion-active {
    border-bottom: 1px solid ${props => props.theme.colors.cover12};
    padding: 0 0 28px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0 0 8px;
    }
  }

  & .KuxAccordion-panel {
    p {
      margin: 0;
      margin-bottom: 12px;
    }
  }

  & .KuxAccordion-head {
    padding: 40px 0;

    h3 {
      margin: 0;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 44px;
      line-height: 1.3;
    }

    span > svg {
      width: 40px;
      height: 40px;
    }
  }

  & .KuxAccordion-head.KuxAccordion-active {
    h3 {
      color: ${(props) => props.theme.colors.text};
    }
  }

  & .KuxAccordion-activeBg {
    width: 100% !important;
    background-color: transparent !important;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    & .KuxAccordion-head {
      padding: 20px 0;
      
      h3 {
        font-size: 18px;
        font-weight: 400;
      }

      span > svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

export const RoadmapAccordionContentItem = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 16px;
  
  b {
    font-weight: 500 !important;
  }

  p {
    margin-bottom: 16px;
    &::before {
      content: "·";
      display: inline-block;
      width: 10px;
      font-weight: 900;
    }

    &:empty {
      display: none;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
    margin-bottom: 8px;
  }
`;
