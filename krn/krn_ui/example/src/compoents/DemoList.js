/**
 * Owner: willen@kupotech.com
 */
import Title from "./Title";
import React from "react";
import styled from "@emotion/native";
import { Pressable, Clipboard } from "react-native";
import { Card } from "@krn/ui";
import SyntaxHighlighter from "./RNSyntaxHighligher";
import { showToast } from "@krn/bridge";

const DemoWrapper = styled.View``;

const ExtendCard = styled(Card)``;

const ShowCodeBox = styled.View`
  margin-left: 5px;
`;

const ShowCode = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.color.primary};
`;

const DemoItemWrapper = styled.View`
  padding: 20px;
`;
const TitleBox = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  margin: 0 0 10px;
  flex-shrink: 0;
`;
const CardTitle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.color.complementary};
  font-weight: bold;
  flex: 1;
`;
const CardDesc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.color.complementary38};
  margin: 0 0 10px;
`;

const SourceCodeBox = styled.View`
  margin: 10px -20px -20px;
`;

const DemoList = ({ list, title = "代码演示" }) => {
  const [showCodeMap, setShowCodeMap] = React.useState({});
  return (
    <DemoWrapper>
      <Title>{title}</Title>
      {list.map((item, index) => {
        const { title, Component, desc, sourceCode = "" } = item;
        return (
          <DemoItemWrapper key={title}>
            <TitleBox>
              <CardTitle>{title}</CardTitle>
              <Pressable
                onPress={() => {
                  Clipboard.setString(sourceCode);
                  showToast("复制成功");
                }}
              >
                <ShowCode>复制源码</ShowCode>
              </Pressable>
              {sourceCode ? (
                <ShowCodeBox>
                  <Pressable
                    onPressOut={() => {
                      setShowCodeMap((i) => ({ ...i, [index]: !i[index] }));
                    }}
                  >
                    <ShowCode>查看源码</ShowCode>
                  </Pressable>
                </ShowCodeBox>
              ) : null}
            </TitleBox>
            {!!desc && <CardDesc>{desc}</CardDesc>}
            <ExtendCard>
              <Component />
              {showCodeMap[index] ? (
                <SourceCodeBox>
                  <SyntaxHighlighter language="javascript">
                    {sourceCode}
                  </SyntaxHighlighter>
                </SourceCodeBox>
              ) : null}
            </ExtendCard>
          </DemoItemWrapper>
        );
      })}
    </DemoWrapper>
  );
};

export default DemoList;
