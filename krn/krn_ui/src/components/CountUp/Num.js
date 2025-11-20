/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from "react";
import styled from "@emotion/native";
import RollInView from "./RollInView";

const TextWrap = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.color.complementary};
`;

export default ({ num, textStyle, duration, height, value }) => {
  const [tmpNum, setTmpNum] = useState([-1, -1]);

  useEffect(() => {
    setTmpNum((oldTmpNum) => {
      return [oldTmpNum[1], num];
    });
  }, [num, value]);

  return (
    <>
      {tmpNum[1] === tmpNum[0] || tmpNum[0] === -1 ? (
        <TextWrap style={{ ...textStyle, height }}>
          {tmpNum[1] < 0 ? "" : tmpNum[1]}
        </TextWrap>
      ) : (
        <RollInView
          value={value}
          num={num}
          height={height}
          duration={duration}
          isRollUp={tmpNum[1] > tmpNum[0] ? true : false}
        >
          {tmpNum.map((item, index) => {
            return (
              <TextWrap key={index} style={{ ...textStyle, height }}>
                {item < 0 ? "" : item}
              </TextWrap>
            );
          })}
        </RollInView>
      )}
    </>
  );
};
