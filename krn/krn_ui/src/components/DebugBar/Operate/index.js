/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import { AsyncStorage, Button, DevSettings } from "react-native";
import {
  exitRN,
  getAppInfo,
  openNative,
  showToast,
  commonBridge,
} from "@krn/bridge";

const ContentView = styled.View`
  flex: 1;
  padding: 20px;
  background: #efefef;
  border-radius: 4px;
`;

const OperateScrollView = styled.ScrollView`
  margin-bottom: 10px;
`;

const ButtonBox = styled.View`
  margin-bottom: 10px;
`;

const ExtendTextInput = styled.TextInput`
  border-radius: 4px;
  padding-left: 10px;
  color: #000;
  background: #fff;
  height: 40px;
  flex: 1;
`;

const TitleView = styled.View`
  margin: 20px 0 10px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 400;
`;

const Operate = ({ setEnableBar, setVisible }) => {
  const [nativeRoute, setNativeRoute] = useState("");
  const [xVersion, setXVersion] = useState("");
  useEffect(() => {
    (async function () {
      const info = await getAppInfo();
      const appXVersion = info?.xversion;
      const localXVersion = await AsyncStorage.getItem("DEBUG_X_VERSION");
      setXVersion(localXVersion || appXVersion);
    })();
  }, []);
  return (
    <ContentView>
      <OperateScrollView>
        <ButtonBox>
          <Button
            onPress={() =>
              __DEV__ ? DevSettings.reload() : commonBridge.reload()
            }
            title="刷新页面"
          />
        </ButtonBox>
        <ButtonBox>
          <Button onPress={() => setEnableBar(false)} title="隐藏DebugBar" />
        </ButtonBox>
        <ButtonBox>
          <Button
            onPress={() => {
              setVisible(false);
              setTimeout(() => openNative("/settings"), 800);
            }}
            title="App->设置"
          />
        </ButtonBox>
        <ButtonBox>
          <Button onPress={() => AsyncStorage.clear()} title="清空Storage" />
        </ButtonBox>
        <ButtonBox>
          <Button
            onPress={() => {
              setVisible(false);
              setTimeout(exitRN, 800);
            }}
            title="退出RN"
          />
        </ButtonBox>
        <TitleView>
          <Title>设置XVersion</Title>
        </TitleView>
        <ExtendTextInput
          value={xVersion}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          placeholderTextColor="#ccc"
          onChange={(e) => setXVersion(e.nativeEvent.text)}
          placeholder="输入x-version"
        />
        <Button
          title="保存"
          onPress={async () => {
            await AsyncStorage.setItem("DEBUG_X_VERSION", xVersion);
            showToast("设置成功，请重启RN页面");
          }}
        />
        <TitleView>
          <Title>原生路由跳转</Title>
        </TitleView>
        <ExtendTextInput
          value={nativeRoute}
          onChange={(e) => setNativeRoute(e.nativeEvent.text)}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          placeholderTextColor="#ccc"
          placeholder="输入原生路由"
        />
        <Button
          title="跳转"
          onPress={async () => {
            setVisible(false);
            setTimeout(() => {
              nativeRoute && openNative(nativeRoute.trim());
            }, 800);
          }}
        />
      </OperateScrollView>
    </ContentView>
  );
};

export default Operate;
