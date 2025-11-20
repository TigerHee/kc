/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import styled from "@emotion/native";

const TitleStyle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-left: 12px;
  margin-top: 12px;
  color: ${({ theme }) => theme.color.complementary};
`;

export default ({ children, style }) => (
  <TitleStyle style={style}>{children}</TitleStyle>
);
