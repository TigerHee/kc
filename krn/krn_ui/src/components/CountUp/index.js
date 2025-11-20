/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from "react";
import styled from "@emotion/native";
import registerAPI from "utils/registerAPI";
import API from "./API";
import Num from "./Num";

const Line = styled.View`
  height: 24px;
  display: flex;
  overflow: hidden;
  flex-direction: row;
`;

const TextWrap = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.color.complementary};
`;

const CountUp = ({ value, textStyle, duration, style, ...restProps }) => {
  const height = style?.[0]?.height || 24;
  const datas = useMemo(() => {
    return `${value}`.split("");
  }, [value]);

  return (
    <Line style={style} {...restProps}>
      {value && typeof value === "number" ? (
        datas.map((item, index) => {
          return (
            <Num
              value={value}
              key={index}
              num={item}
              height={height}
              textStyle={textStyle}
              duration={duration}
            />
          );
        })
      ) : (
        <TextWrap style={{ ...textStyle, height }}>{value}</TextWrap>
      )}
    </Line>
  );
};

registerAPI(CountUp, API);

export default CountUp;
