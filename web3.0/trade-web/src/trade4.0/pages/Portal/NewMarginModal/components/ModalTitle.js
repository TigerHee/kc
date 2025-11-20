/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import styled from '@emotion/styled';
import { Tabs } from '@mui/Tabs';
import { MODAL_TYPE } from '../config';

const { Tab } = Tabs;

/** 样式开始 */
const StyledTabs = styled(Tabs)`
  height: 100%;
  [role='tablist'] {
    padding-top: 26px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding-top: 18px;
    }
  }
  [role='tab'] {
    font-weight: 700;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-weight: 600;
      font-size: 18px;
    }
  }
`;
/** 样式结束 */

// 弹窗标题
const ModalTitle = (props) => {
  return (
    <StyledTabs variant="line" {...props}>
      {map(MODAL_TYPE, ({ value, label }, index) => {
        return <Tab key={value} label={label()} value={index} />;
      })}
    </StyledTabs>
  );
};

export default ModalTitle;
