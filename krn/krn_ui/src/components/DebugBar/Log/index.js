/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from "react";
import styled from "@emotion/native";
import { Button, Clipboard } from "react-native";
import { showToast } from "@krn/bridge";
import { MAX_LOG_COUNT } from "../config";

const ContentView = styled.View`
  flex: 1;
`;

const DescScrollView = styled.ScrollView`
  background: #efefef;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  flex: 1;
  padding: 10px;
  color: #333;
  font-size: 12px;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;

const Tips = styled.Text`
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 10px 0;
`;

const getInfoPrefix = () => {
  return `[${new Date(Date.now() + 8 * 60 * 60 * 1000)
    .toISOString()
    .replace(/^.*T/g, "")
    .replace(/\..*$/g, "")}] `;
};

let logArray = [`${getInfoPrefix()}加载成功`];

const Log = ({ setHeart }) => {
  useEffect(() => {
    console.log = function () {
      logArray.unshift(getInfoPrefix() + Array.from(arguments).join("  "));
      // 只保留最后50条日志
      logArray.length = Math.min(logArray.length, MAX_LOG_COUNT);
      console.info.apply({}, arguments);
    };
  }, []);

  return (
    <ContentView>
      <DescScrollView>
        <Description style={{ fontSize: 12, marginBottom: 0 }}>
          {logArray.join("\n\n")}
        </Description>
        <Tips>仅展示最近{MAX_LOG_COUNT}条日志</Tips>
      </DescScrollView>
      <ButtonGroup>
        <Button
          onPress={() => {
            Clipboard.setString(logArray.join("\n"));
            showToast("复制成功");
          }}
          title="Copy Logs"
        />
        <Button
          onPress={() => {
            logArray = [];
            setHeart((i) => !i);
          }}
          title="Clear Logs"
        />
      </ButtonGroup>
    </ContentView>
  );
};

export default Log;
