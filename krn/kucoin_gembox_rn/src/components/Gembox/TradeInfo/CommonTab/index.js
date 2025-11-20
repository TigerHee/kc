/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';

const TabView = styled.View`
  width: 100%;
  flex: 1;
`;
const TabBtnViewWrapper = styled.View`
  width: 100%;
  min-height: 56px;
  flex-direction: row;
  align-items: center;
`;

const TabBtnView = styled.View`
  width: 50%;
  height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Tab = props => {
  const {tabLeft, tabRight, content} = props;
  return (
    <TabView>
      <TabBtnViewWrapper>
        <TabBtnView>{tabLeft}</TabBtnView>
        <TabBtnView>{tabRight}</TabBtnView>
      </TabBtnViewWrapper>
      {content}
    </TabView>
  );
};
export default Tab;
