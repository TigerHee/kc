/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import ExampleHeader from "../../compoents/Header";
import styled from "@emotion/native";
import ParamList from "../../compoents/ParamList";
import API from "components/Swipeable/API";
import { ScrollView } from "react-native";
import DemoList from "../../compoents/DemoList";

import Basic from "../../demos/Swipeable/Basic";
import BasicDoc from "../../demos/Swipeable/Basic.doc";

import ActionRelease from "../../demos/Swipeable/ActionRelease";
import ActionReleaseDoc from "../../demos/Swipeable/ActionRelease.doc";

import OtherFunc from "../../demos/Swipeable/OtherFunc";
import OtherFuncDoc from "../../demos/Swipeable/OtherFunc.doc";

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Swipeable" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: "按钮",
              Component: Basic,
              sourceCode: BasicDoc,
            },
            {
              title: "滑动释放",
              Component: ActionRelease,
              sourceCode: ActionReleaseDoc,
            },
            {
              title: "其他方法",
              Component: OtherFunc,
              sourceCode: OtherFuncDoc,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
