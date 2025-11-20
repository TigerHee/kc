/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from "react";
import styled from "@emotion/native";
import { useTheme } from "@krn/ui";

const Container = styled.View``;

const RowWrapper = styled.View`
  flex: 1;
`;
const CellWrapper = styled.View`
  margin-bottom: 20px;
`;

const Cell = styled.View`
  flex: 1;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 2px;
`;

const ColorText = styled.Text`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${(props) => props.theme.colorV2.text};
`;

export default () => {
  const theme = useTheme();
  const colorsKeys = Object.keys(theme.colorV2);
  const colorsKeyList = useMemo(() => {
    const result = {};
    colorsKeys.forEach((key) => {
      const prefix = key.replace(/\d+/g, "");
      if (!result[prefix]) result[prefix] = [];
      result[prefix].push(key);
    });
    return result;
  }, [colorsKeys]);

  return (
    <Container>
      {Object.keys(colorsKeyList).map((title) => {
        return (
          <RowWrapper key={title}>
            {colorsKeyList[title].map((colorsKey) => {
              return (
                <CellWrapper key={colorsKey}>
                  <ColorText>
                    {colorsKey}（{theme.colorV2[colorsKey]}）
                  </ColorText>
                  <Cell
                    key={colorsKey}
                    style={{
                      backgroundColor: theme.colorV2[colorsKey],
                    }}
                  />
                </CellWrapper>
              );
            })}
          </RowWrapper>
        );
      })}
    </Container>
  );
};
