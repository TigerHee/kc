/**
 * Owner: willen@kupotech.com
 */
import React, { useState } from "react";
import styled from "@emotion/native";
import DebugModal from "./DebugModal";

const Wrapper = styled.View`
  position: absolute;
  bottom: 14px;
  right: -25px;
`;

const Inner = styled.Pressable`
  transform: ${({ theme }) =>
    theme.isRTL ? "rotate(45deg)" : "rotate(-45deg)"};
  background: #21c397;
  width: 100px;
  justify-content: center;
  align-items: center;
`;

const InnerText = styled.Text`
  font-size: 10px;
`;

const DebugBar = ({ enableBar, setEnableBar }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  return enableBar ? (
    <Wrapper>
      <Inner onPress={() => setVisibleModal(true)}>
        <InnerText>DEBUG</InnerText>
      </Inner>
      <DebugModal
        setEnableBar={setEnableBar}
        visible={visibleModal}
        setVisible={setVisibleModal}
      />
    </Wrapper>
  ) : null;
};

export default DebugBar;
