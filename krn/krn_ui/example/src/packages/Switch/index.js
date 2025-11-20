/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import ExampleHeader from "../../compoents/Header";
import styled from "@emotion/native";
import ParamList from "../../compoents/ParamList";
import API from "components/Switch/API";
import { ScrollView } from "react-native";
import DemoList from "../../compoents/DemoList";

import Basic from "../../demos/Switch/Basic";
import BasicDoc from "../../demos/Switch/Basic.doc";

import Small from "../../demos/Switch/Small";
import SmallDoc from "../../demos/Switch/Small.doc";

import Disabled from "../../demos/Switch/Disabled";
import DisabledDoc from "../../demos/Switch/Disabled.doc";

import Custom from "../../demos/Switch/Custom";
import CustomDoc from "../../demos/Switch/Custom.doc";

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Switch" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: "基础用法",
              Component: Basic,
              sourceCode: BasicDoc,
            },
            {
              title: "不同尺寸",
              Component: Small,
              sourceCode: SmallDoc,
            },
            {
              title: "不可用",
              Component: Disabled,
              sourceCode: DisabledDoc,
            },
            {
              title: "自定义背景样式",
              Component: Custom,
              sourceCode: CustomDoc,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
