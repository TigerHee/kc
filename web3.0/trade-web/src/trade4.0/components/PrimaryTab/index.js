/**
 * Owner: Ray.Lee@kupotech.com
 */
import React from 'react';
import { Tabs } from '@mui/Tabs';
import styled from '@emotion/styled';
import { getColors } from 'src/helper';

/**
 * PrimaryTab
 * 主题色背景的 tab
 */
const PrimaryTab = styled(Tabs)`
  box-sizing: content-box;
  .KuxTabs-scroller {
    height: auto;
  }
  .KuxTabs-scrollButton {
    display: flex;
    height: 40px;
    padding: 0;
    align-items: center;
  }
  .KuxTab-TabItem {
    padding: 4px 10px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    border: 1px solid transparent;
    background-color: transparent;
    border-radius: 80px;
    &:active {
      border: 1px solid transparent;
    }
  }
  .KuxTab-selected {
    color: ${getColors('primary')};
    background-color: ${getColors('primary8')};
    border: 1px solid ${getColors('primary12')};
  }
`;

export default PrimaryTab;
