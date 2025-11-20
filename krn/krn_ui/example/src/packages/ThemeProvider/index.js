/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import ExampleHeader from "../../compoents/Header";
import styled from "@emotion/native";
import ParamList from "../../compoents/ParamList";
import API from "components/ThemeProvider/API";
import { ScrollView } from "react-native";
import { useTheme } from "@krn/ui";
import ColorList from "../../demos/ThemeProvider/ColorList";
import DemoList from "../../compoents/DemoList";

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  const theme = useTheme();
  const isLight = theme.type === "light";
  return (
    <Wrapper>
      <ExampleHeader title="ThemeProvider" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          title="主题配色（V2）"
          list={[
            {
              title: `${isLight ? "白天" : "黑夜"}配色`,
              Component: ColorList,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
