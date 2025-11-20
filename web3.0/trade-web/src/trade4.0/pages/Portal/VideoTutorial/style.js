/*
 * @owner: borden@kupotech.com
 */
import { Children } from 'react';
import Dialog from '@mui/Dialog';
import styled from '@emotion/styled';
import Accordion from '@mui/Accordion';
import { ICSupportOutlined } from '@kux/icons';

const { AccordionPanel } = Accordion;

export const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    opacity: 1;
    animation: none;
    max-height: 80vh;
  }
`;

export const StyledAccordion = styled(Accordion)`
  padding: 8px 16px;
  .KuxAccordion-iconWrapper {
    ${(props) => {
      if (Children.count(props.children) < 2) {
        return 'display: none;';
      }
    }}
  }
  .KuxAccordion-activeBg {
    display: none;
  }
  .KuxAccordion-panel {
    padding: 0;
  }
  .KuxAccordion-head {
    padding: 8px 0;
    font-size: 16px;
    font-weight: 600;
  }
  &.KuxAccordion-active {
    border-radius: 16px;
    background: ${props => props.theme.colors.cover4};
  }
`;
StyledAccordion.AccordionPanel = AccordionPanel;

export const ControlsTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const ControlsSubTitle = styled.a`
  font-size: 12px;
  font-weight: 400;
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.text40};
`;

export const StyledICSupportOutlined = styled(ICSupportOutlined)`
  margin-right: 4px;
  color: ${props => props.theme.colors.icon60};
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  overflow-y: auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

export const LeftBox = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 16px;
  height: min-content;
  background: ${props => props.theme.colors.cover4};
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex: unset;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-top: 56.25%; /* 9/16 * 100% = 56.25% */
  background: ${props => props.theme.colors.cover4};
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // 字幕样式
    &::cue {
      color: #F3F3F3;
      /* 去掉字幕底部默认的黑色背景 */
      background-color: transparent;
    }
  }
`;

export const RightBox = styled.div`
  width: 300px;
  margin-left: 32px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin-left: 0;
    margin-top: 24px;
  }
`;

export const TimeLine = styled.div`
  font-size: 12px;
  padding: 8px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: ${props => props.theme.colors.text40};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;
