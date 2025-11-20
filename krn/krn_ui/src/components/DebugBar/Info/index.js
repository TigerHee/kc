/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import {
  Dimensions,
  PixelRatio,
  Platform,
  Pressable,
  Text,
} from "react-native";
import { getAppInfo, openNative } from "@krn/bridge";

const ContentView = styled.View`
  flex: 1;
`;

const DescScrollView = styled.ScrollView`
  background: #efefef;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 20px;
`;

const DescItem = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;
const Title = styled.Text`
  color: #444;
  margin-right: 10px;
  width: 140px;
  text-align: right;
`;
const Value = styled.Text`
  color: #000;
`;

const Info = ({ setVisible }) => {
  const [appInfo, setAppInfo] = useState({});
  const [remoteUrl, setRemoteUrl] = useState("");
  const [remoteInfo, setRemoteInfo] = useState({});

  useEffect(() => {
    (async function () {
      const info = await getAppInfo();
      setAppInfo(info);
      if (!!process.env._BUILD_BIZ_) {
        try {
          let nginxQuery = "";
          // 测试环境添加nginx_env的query来指定ng
          if (info.webApiHost.includes("nginx-web-")) {
            nginxQuery = `&nginx_env=${info.webApiHost.replace(
              /^nginx-web-(\d+).*$/,
              "$1"
            )}`;
          }
          const url = `https://assets.staticimg.com/react-native-bundle/${
            process.env._BUILD_BIZ_
          }/${process.env._BUILD_ENTRY_}/${
            Platform.OS
          }/source.json?_t=${Date.now()}${nginxQuery}`;
          const remoteInfo = await fetch(url).then((res) => res.json());
          setRemoteUrl(url);
          setRemoteInfo(remoteInfo);
        } catch (e) {
          console.log("remoteInfo获取失败", e);
        }
      }
    })();
  }, []);

  return (
    <ContentView>
      <DescScrollView>
        <DescItem>
          <Title>biz</Title>
          <Value>{process.env._BUILD_BIZ_ || "--"}</Value>
        </DescItem>
        <DescItem>
          <Title>entry</Title>
          <Value>{process.env._BUILD_ENTRY_ || "--"}</Value>
        </DescItem>
        <DescItem>
          <Title>localBuildTime</Title>
          <Value>
            {process.env._BUILD_TIME_
              ? new Date(+process.env._BUILD_TIME_).toISOString()
              : "--"}
          </Value>
        </DescItem>
        <DescItem>
          <Title>remoteBuildTime</Title>
          <Value>
            {remoteInfo.timestamp
              ? new Date(+remoteInfo.timestamp).toISOString()
              : "--"}
          </Value>
          {process.env._BUILD_TIME_ &&
          remoteInfo.timestamp &&
          +process.env._BUILD_TIME_ !== +remoteInfo.timestamp ? (
            <Pressable
              onPress={() => {
                setVisible(false);
                setTimeout(
                  () =>
                    openNative(
                      `/krn/debugRouter?forceUrl=${remoteUrl}&biz=${process.env._BUILD_BIZ_}&entry=${process.env._BUILD_ENTRY_}`
                    ),
                  800
                );
              }}
            >
              <Text style={{ color: "#008aed", marginLeft: 10, fontSize: 12 }}>
                更新
              </Text>
            </Pressable>
          ) : null}
        </DescItem>
        <DescItem>
          <Title>localBuildVersion</Title>
          <Value>{process.env._BUILD_VERSION_ || "--"}</Value>
        </DescItem>
        <DescItem>
          <Title>remoteBuildVersion</Title>
          <Value>{remoteInfo.version || "--"}</Value>
        </DescItem>
        <DescItem>
          <Title>openAssetsCDN</Title>
          <Value>{process.env._ASSETS_CDN_ === "1" ? "true" : "false"}</Value>
        </DescItem>
        {Object.keys(appInfo)
          .sort()
          .map((key) => (
            <DescItem key={key}>
              <Title>{key}</Title>
              <Value>{appInfo[key].toString()}</Value>
            </DescItem>
          ))}
        <DescItem>
          <Title>OSVersion</Title>
          <Value>{Platform.OS + " " + Platform.Version}</Value>
        </DescItem>
        <DescItem>
          <Title>pixelRatio</Title>
          <Value>{PixelRatio.get()}</Value>
        </DescItem>
        <DescItem>
          <Title>fontScale</Title>
          <Value>{PixelRatio.getFontScale()}</Value>
        </DescItem>
        <DescItem>
          <Title>windowWidth</Title>
          <Value>{Dimensions.get("window").width}</Value>
        </DescItem>
        <DescItem>
          <Title>windowHeight</Title>
          <Value>{Dimensions.get("window").height}</Value>
        </DescItem>
      </DescScrollView>
    </ContentView>
  );
};

export default Info;
