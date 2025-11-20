/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import styled from "@emotion/native";
import API from "./API";
import registerAPI from "utils/registerAPI";
import { Slider as MSlider } from "@miblanchard/react-native-slider";
import useTheme from "hooks/useTheme";

const Wrapper = styled.View``;

const Slider = ({
  thumbTintColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <MSlider
        {...props}
        thumbTintColor={thumbTintColor || theme.color.primary}
        minimumTrackTintColor={minimumTrackTintColor || theme.color.primary}
        maximumTrackTintColor={
          maximumTrackTintColor || theme.color.complementary8
        }
      />
    </Wrapper>
  );
};

registerAPI(Slider, API);
export default Slider;
