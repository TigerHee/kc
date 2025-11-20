/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, useState } from "react";
import styled from "@emotion/native";
import { Button, Clipboard } from "react-native";
import { showToast } from "@krn/bridge";
import { clearStorageRequest, getStorageRequest } from "./utils";
import { MAX_NETWORK_COUNT } from "../config";

const ContentView = styled.View`
  flex: 1;
`;

const ContentScrollView = styled.ScrollView`
  background: #efefef;
  border-radius: 4px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #efefef;
`;

const Tips = styled.Text`
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 10px 0;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;

const Item = styled.View``;

const Title = styled.Pressable`
  padding: 10px;
  background: ${({ even }) => (even ? "#fff" : "#efefef")};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const UrlInfo = styled.Text`
  font-size: 12px;
  color: ${({ error }) => (error ? "#f00" : "#000")};
  height: 100%;
  flex: 1;
`;

const Triangle = styled.View`
  margin-left: 10px;
  border-color: ${({ active }) =>
    active
      ? "transparent transparent #555 transparent"
      : "#555 transparent transparent transparent"};
  border-width: 6px;
  top: ${({ active }) => (active ? "-2px" : "5px")};
`;

const Response = styled.Text`
  font-size: 12px;
  padding: 0 10px 10px;
  background: ${({ even }) => (even ? "#fff" : "#efefef")};
  color: #000;
`;

const Network = ({ setHeart }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const networkList = getStorageRequest();

  const activeResponseInfo = useMemo(() => {
    if (activeIndex < 0) return "";
    const item = networkList[activeIndex] || {};
    return [
      "Request Headers:",
      `Query: ${item.query ?? "--"}`,
      `Param: ${item.param ?? "--"}`,
      "",
      "Response Headers:",
      `Status Code: ${item.status}`,
      `Date: ${new Date(item.date || 0).toISOString()}`,
      `Body: ${item.body ?? "--"}`,
    ].join("\n");
  }, [activeIndex, networkList]);

  return (
    <ContentView>
      <ContentScrollView>
        {networkList.map((item, index) => (
          <Item key={item.id}>
            <Title
              even={index % 2}
              onPress={() =>
                setActiveIndex((prev) => (prev === index ? -1 : index))
              }
            >
              <UrlInfo
                numberOfLines={2}
                ellipsizeMode="middle"
                error={+item.status !== 200}
              >
                {item.method} {item.url}
              </UrlInfo>
              <Triangle active={activeIndex === index} />
            </Title>
            {activeIndex === index ? (
              <Response even={index % 2}>{activeResponseInfo}</Response>
            ) : null}
          </Item>
        ))}
        <Tips>仅展示最近{MAX_NETWORK_COUNT}条请求</Tips>
      </ContentScrollView>
      <ButtonGroup>
        <Button
          onPress={() => {
            if (activeIndex < 0) {
              showToast("复制前先展开一个请求");
              return;
            }
            Clipboard.setString(activeResponseInfo);
            showToast("已复制当前展开的请求数据");
          }}
          title="Copy Active"
        />
        <Button
          onPress={() => {
            clearStorageRequest();
            setHeart((i) => !i);
          }}
          title="Clear Network"
        />
      </ButtonGroup>
    </ContentView>
  );
};

export default Network;
