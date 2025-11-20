/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from "react";
import registerAPI from "utils/registerAPI";
import API from "./API";
import styled from "@emotion/native";
import { useCallback } from "react";
import lightDeleteIcon from "assets/light/delete.png";
import darkDeleteIcon from "assets/dark/delete.png";
import useUIContext from "hooks/useUIContext";
import useTheme from "hooks/useTheme";

const Wrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  background: transparent;
`;

const ExtendTouchableHighlight = styled.TouchableHighlight`
  flex: 1;
  height: ${({ itemHeight }) => itemHeight + "px"};
  border-radius: 5px;
  margin-bottom: ${({ index, gap }) => (index > 8 ? 0 : gap + "px")};
`;

const Btn = styled.View`
  flex: 1;
  height: ${({ itemHeight }) => itemHeight + "px"};
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color.complementary};
`;

const Key = styled.Text`
  font-weight: 500;
  font-size: ${({ numberFontSize }) => numberFontSize + "px"};
  color: ${({ theme }) => theme.color.complementary};
`;

const Dot = styled.View`
  width: 3px;
  height: 3px;
  background: ${({ theme }) => theme.color.complementary};
`;

const ArrowDelete = styled.Image`
  width: 32px;
  height: 32px;
`;

const GapWrapper = styled.View`
  display: flex;
  flex-direction: row;
  width: 33.33%;
`;

const Gap = styled.View`
  width: ${({ gap }) => gap + "px"};
`;

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "dot", 0, "delete"];
const NumberPad = ({
  style,
  dot,
  onChange,
  numberFontSize,
  itemHeight,
  dotStyle,
  deleteImage,
  touchHighlightColor,
  throttleDuration,
  gutter,
}) => {
  const [lastClickTime, setLastClickTime] = React.useState(0);
  const { currentTheme } = useUIContext();
  const theme = useTheme();

  const { rowGutter, columnGutter } = useMemo(() => {
    if (typeof gutter === "number") {
      return { rowGutter: gutter, columnGutter: gutter };
    }
    if (Array.isArray(gutter)) {
      return { rowGutter: gutter[0], columnGutter: gutter[1] || gutter[0] };
    }
    return { rowGutter: 0, columnGutter: 0 };
  }, [gutter]);

  const handleKey = useCallback(
    (key, idx) => {
      if (typeof key === "number") {
        return (
          <Key key={idx} numberFontSize={numberFontSize}>
            {key}
          </Key>
        );
      } else if (typeof key === "string") {
        if (key === "dot") {
          return dot ? <Dot key={idx} style={dotStyle} /> : null;
        } else if (key === "delete") {
          return deleteImage ? (
            deleteImage
          ) : (
            <ArrowDelete
              source={
                currentTheme === "light" ? lightDeleteIcon : darkDeleteIcon
              }
              key={idx}
            />
          );
        }
      }
    },
    [currentTheme, numberFontSize, dot, dotStyle, deleteImage]
  );

  const handleChange = (value) => {
    if (typeof onChange === "function") {
      onChange(value);
      if (throttleDuration > 0) {
        setLastClickTime(Date.now());
        setTimeout(() => setLastClickTime(0), throttleDuration);
      }
    }
  };

  const BtnRender = (item, idx) => {
    return (
      <ExtendTouchableHighlight
        disabled={
          (item === "dot" && !dot) ||
          (throttleDuration && Date.now() - lastClickTime < throttleDuration)
        }
        underlayColor={
          touchHighlightColor ? touchHighlightColor : theme.color.complementary4
        }
        onPress={() => handleChange(item)}
        key={idx}
        itemHeight={itemHeight}
        index={idx}
        gap={columnGutter}
      >
        <Btn index={idx} itemHeight={itemHeight}>
          {handleKey(item, idx)}
        </Btn>
      </ExtendTouchableHighlight>
    );
  };

  return (
    <Wrapper style={style}>
      {keys.map((item, idx) => (
        <GapWrapper key={idx}>
          {idx % 3 === 0 ? (
            <>
              {BtnRender(item, idx)}
              <Gap gap={(rowGutter * 2) / 3} />
            </>
          ) : (idx + 1) % 3 === 0 ? (
            <>
              <Gap gap={(rowGutter * 2) / 3} />
              {BtnRender(item, idx)}
            </>
          ) : (
            <>
              <Gap gap={rowGutter / 3} />
              {BtnRender(item, idx)}
              <Gap gap={rowGutter / 3} />
            </>
          )}
        </GapWrapper>
      ))}
    </Wrapper>
  );
};

registerAPI(NumberPad, API);
export default NumberPad;
