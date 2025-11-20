/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { useTheme } from '@kux/mui';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const WIFI_COLOR_ENUM = {
  warning: 'complementary',
  danger: 'secondary',
  unavailable: 'icon',
  loading: 'primary',
};

const wifiAnimate1 = (grayColor, primaryColor) => keyframes`
  0% {
    stroke: ${grayColor};
  }
  75% {
    stroke: ${primaryColor};
  }
`;

const wifiAnimate2 = (grayColor, primaryColor) => keyframes`
  0% {
    stroke: ${grayColor};
  }
  50% {
    stroke: ${primaryColor};
  }
`;

const wifiAnimate3 = (grayColor, primaryColor) => keyframes`
  0% {
    stroke: ${grayColor};
  }
  25% {
    stroke: ${primaryColor};
  }
`;

const SvgWrapper = styled.svg`
  margin: 0 10px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-left: 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 8px;
  }

  ${(props) => {
    if (props.hasAnimate) return '';
    const status = props.networkStatus || 'unavailable';

    if (WIFI_COLOR_ENUM[status]) {
      return `
        path {
          stroke: ${props.theme.colors[WIFI_COLOR_ENUM[status]]};
        }
      `;
    }
    let cssStr = '';
    for (let i = 3; i > 3 - status; i--) {
      cssStr += `
        #wifi${i} {
          stroke: ${props.theme.colors.primary};
        }
      `;
    }
    return cssStr;
  }}

  #wifi1 {
    animation: ${(props) =>
        (props.hasAnimate
          ? wifiAnimate1(props.grayColor, props.primaryColor)
          : null)}
      1s steps(1) infinite;
  }
  #wifi2 {
    animation: ${(props) =>
        (props.hasAnimate
          ? wifiAnimate2(props.grayColor, props.primaryColor)
          : null)}
      1s steps(1) infinite;
  }
  #wifi3 {
    animation: ${(props) =>
        (props.hasAnimate
          ? wifiAnimate3(props.grayColor, props.primaryColor)
          : null)}
      1s steps(1) infinite;
  }
`;

/**
 * AnimateWifi
 */
const AnimateWifi = (props) => {
  const { ...restProps } = props;
  const { colors } = useTheme();
  const grayColor = colors.icon || '#8C8C8C';
  const primaryColor = colors.primary || '#01BC8D';
  const hasAnimate = props.networkStatus === 'loading';

  return (
    <SvgWrapper
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      grayColor={grayColor}
      primaryColor={primaryColor}
      hasAnimate={hasAnimate}
      {...restProps}
    >
      <path
        id="wifi1"
        d="M1.16138 7.82913C6.04293 2.94758 13.9575 2.94758 18.839 7.82913"
        stroke={grayColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        id="wifi2"
        d="M4.10767 10.7767C7.36204 7.52235 12.6384 7.52234 15.8928 10.7767"
        stroke={grayColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        id="wifi3"
        d="M6.75928 13.6706C8.54918 11.8806 11.4512 11.8806 13.2411 13.6706"
        stroke={grayColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.0002 16.668H10.0086"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgWrapper>
  );
};

export default memo(AnimateWifi);
