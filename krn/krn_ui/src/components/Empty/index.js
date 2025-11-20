/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import useUIContext from 'hooks/useUIContext';
import registerAPI from 'utils/registerAPI';
import API from './API';
import empty_light_icon from 'assets/light/Empty/empty.png';
import empty_dark_icon from 'assets/dark/Empty/empty.png';
import systemBusy_light_icon from 'assets/light/Empty/systemBusy.png';
import systemBusy_dark_icon from 'assets/dark/Empty/systemBusy.png';
import suspension_light_icon from 'assets/light/Empty/suspension.png';
import suspension_dark_icon from 'assets/dark/Empty/suspension.png';
import network_light_icon from 'assets/light/Empty/network.png';
import network_dark_icon from 'assets/dark/Empty/network.png';
import loading_light_icon from 'assets/light/Empty/loading.png';
import loading_dark_icon from 'assets/dark/Empty/loading.png';
import warning_light_icon from 'assets/light/Empty/warning.png';
import warning_dark_icon from 'assets/dark/Empty/warning.png';
import success_light_icon from 'assets/light/Empty/success.png';
import success_dark_icon from 'assets/dark/Empty/success.png';
import error_light_icon from 'assets/light/Empty/error.png';
import error_dark_icon from 'assets/dark/Empty/error.png';

const imgConfig = {
  empty_light_icon,
  empty_dark_icon,
  systemBusy_light_icon,
  systemBusy_dark_icon,
  suspension_light_icon,
  suspension_dark_icon,
  network_light_icon,
  network_dark_icon,
  loading_light_icon,
  loading_dark_icon,
  warning_light_icon,
  warning_dark_icon,
  success_light_icon,
  success_dark_icon,
  error_light_icon,
  error_dark_icon,
};

const squareImgType = ['suspension', 'loading', 'warning', 'success', 'error'];

const EmptyBox = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const EmptyImg = styled.Image`
  width: 136px;
  height: ${({ imgType }) => (squareImgType.includes(imgType) ? '136px' : '112px')};
`;
const EmptyText = styled.Text`
  font-size: 13px;
  line-height: 16px;
  margin-top: 8px;
  color: ${({ theme }) => theme.colorV2.text40};
`;

const Empty = ({ text, image, style, textStyle, styles, imgType, autoRotateDisable = true }) => {
  const { currentTheme } = useUIContext();

  return (
    <EmptyBox style={[style, styles.emptyBox]}>
      {image ? (
        image
      ) : (
        <EmptyImg
          imgType={imgType}
          style={styles.emptyImg}
          source={imgConfig[`${imgType}_${currentTheme}_icon`]}
          autoRotateDisable={autoRotateDisable}
        />
      )}
      <EmptyText style={[textStyle, styles.emptyText]}>{text}</EmptyText>
    </EmptyBox>
  );
};

registerAPI(Empty, API);

export default Empty;
