/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import { Modal } from "react-native";
import Tabs from "./Tabs";
import Log from "./Log";
import Network from "./Network";
import Info from "./Info";
import Operate from "./Operate";

const CloseIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHdSURBVHgB7ZhBTsJAFIbflBpqgsnIxhpddOlCCEuXHsEbACezN5EbiNG4pe7QmNgFiV1oax+KIYWWeTNvwma+Dem0M/M+2jI/A+BwOBwOh2N/tCgXSxnJQJ5fBZ0uZIv3FBhZjZ0t3hJKP4908eHRvSfEnScOZjLsD4EJedYflmN/4Njd095MyoFU7assIMPL6/Ij+u8oiphDYll8XsRrTREEXwPV/up3IPCnG50NJbYU/4efgCLK70CWzrN25+RFCLhZb8fjdidMssXrAxCoKz4vvsfp/HECipBe4vIFm3JINBf/HAMBkgBiKsFZPEIWQHQluItHtAQQqoSN4hFtAURVwlbxy7mAARn2Rp6A22p7XogRfkW2ikdYBJA6iW1wFY8YPULr1D1OVTiLR9gEkF0S3MUjpDCnREsU9Sf9hnOa0wEj9dnmF93Y0QSbwK7iV3BLsDxCTb/zeQHjjUmZojhifAd2LVJcAbAOIwHVFdamhLYANR7YktAS0M02NiTIAqbBjFuCtq3ClCo5JZTDnAwvItxOqbabxIPaFPvZOk7TqdK+E2Ed8KONiQyzTfnnPd62TljbVimDTLI65ApmVQmcI50/TcAWuMFF2TlTH3cQ2Rrb4XA4HA6HLX4A/SKOVQ09TX4AAAAASUVORK5CYII=";

const ModalContainer = styled.View`
  background: rgba(0, 0, 0, 0.7);
  flex: 1;
  justify-content: flex-end;
`;
const ModalView = styled.View`
  background: #fff;
  height: 90%;
  border-radius: 8px;
  padding: 0 16px;
`;

const Header = styled.View`
  height: 44px;
  flex-direction: row;
  align-items: center;
`;

const IconView = styled.Pressable`
  width: 24px;
  height: 24px;
`;
const CloseIcon = styled.Image`
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  color: #000;
`;

const Content = styled.View`
  margin-bottom: 10px;
  flex: 1;
  display: ${({ active }) => (active ? "flex" : "none")};
`;

const Tips = styled.Text`
  color: #f00;
  margin-bottom: 20px;
  text-align: center;
`;

const DebugModal = ({ visible, setVisible, setEnableBar }) => {
  const [activeTab, setActiveTab] = useState("Log");
  const [heart, setHeart] = useState(false);

  useEffect(() => {
    let t;
    if (visible) {
      t = setInterval(() => setHeart((i) => !i), 2000);
    }
    return () => {
      t && clearInterval(t);
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <ModalContainer>
        <ModalView>
          <Header>
            <IconView onPress={() => setVisible(false)}>
              <CloseIcon source={{ uri: CloseIconBase64 }} />
            </IconView>
            <Title>KRN调试</Title>
            <IconView />
          </Header>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Content active={activeTab === "Log"}>
            <Log setHeart={setHeart} />
          </Content>
          <Content active={activeTab === "Network"}>
            <Network setHeart={setHeart} />
          </Content>
          <Content active={activeTab === "Info"}>
            <Info setVisible={setVisible} />
          </Content>
          <Content active={activeTab === "Operate"}>
            <Operate setEnableBar={setEnableBar} setVisible={setVisible} />
          </Content>
          <Tips>此工具仅在测试包中显示，线上包会自动移除</Tips>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DebugModal;
