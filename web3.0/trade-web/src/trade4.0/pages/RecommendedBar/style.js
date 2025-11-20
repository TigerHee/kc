/* eslint-disable max-len */
/**
 * Owner: Ray.Lee@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Divider from '@mui/Divider';
import Select from '@mui/Select';
import SeoLink from '@/components/SeoLink';
import dropStyle from '@/components/DropdownSelect/style';
import DropdownSelect from '@/components/DropdownSelect';

export const scrollAnimate = (isRTL) => keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(${isRTL ? '50%' : '-50%'}, 0, 0);
  }

`;

export const Wrapper = styled.div`
  height: 32px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.overlay};

  display: flex;
  padding: 0 12px;
`;

export const ScrollWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const ScrollContent = styled.div`
  position: relative;
  display: inline-flex;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  height: 100%;
  animation: ${(props) =>
      (props.hasAnimation ? scrollAnimate(props.isRTL) : null)}
    linear infinite both;
  animation-duration: ${(props) => `${props.duration}s`};
  animation-delay: 2s;

  &:hover {
    animation-play-state: paused;
  }
`;

export const ScorllItem = styled.div`
  height: 100%;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;

  &:last-of-type {
    div {
      &:last-of-type {
        .divider {
          display: none;
        }
      }
    }
  }
`;

export const ItemWrapper = styled(SeoLink)`
  height: 100%;
  display: inline-flex;
  align-items: center;

  font-weight: 400;
  font-size: 12px;
  line-height: 130%;

  span {
    white-space: nowrap;
  }

  &:hover {
    opacity: 0.8;
  }

  .percent {
    margin: 0 8px;
  }
`;

export const ItemCurrency = styled.span`
  color: ${(props) => props.theme.colors.text60};
`;

export const ItemPercent = styled.span`
  margin: 0 8px;
`;

export const ItemPrice = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

export const DividerWrapper = styled(Divider)`
  /* margin: 0 12px; */
`;

export const SelectWrapper = styled(Select)`
  width: auto;
  /* padding: 0 8px; */
  margin: 4px 12px 4px 0;
  background-color: ${(props) => props.theme.colors.cover8};
  border-radius: 4px;

  > div {
    padding: 0 8px;
  }

  div {
    height: 100%;
  }

  .KuxSelect-dropdownIcon {
    display: flex;
    align-items: center;
    svg {
      width: 12px;
      height: 12px;
      fill: ${(props) => props.theme.colors.icon};
    }
  }
`;

export const SelectItem = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  svg {
    width: 16px;
    height: 16px;
  }

  span {
    margin-left: 6px;
  }
`;

export const SelectItemText = styled.span`
  line-height: 1;
`;

export const PopularIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.128 6.46214C11.2193 6.23471 11.5276 6.15675 11.6747 6.3527C12.3418 7.24104 12.7992 8.35431 12.7992 9.5C12.7137 12.0758 10.596 14 7.99922 14C5.34812 14 3.19922 12.0011 3.19922 9.35C3.19922 7.832 3.89942 6.4796 4.99922 5.6C6.00762 4.84453 6.68461 3.67887 6.78599 2.34864C6.79994 2.16559 6.9631 2.0241 7.14192 2.06564C9.13486 2.52853 10.6197 4.31542 10.6197 6.449C10.6197 6.8759 10.5087 7.2989 10.3992 7.7C10.68 7.32786 10.9478 6.91124 11.128 6.46214Z"
      fill="url(#paint0_linear_1317_75077)"
    />
    <path
      d="M9.47728 10.25C9.47728 10.6016 8.73882 11.3047 8.00036 11.3047C7.2619 11.3047 6.52344 10.6016 6.52344 10.25"
      stroke="#FFE5D0"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1317_75077"
        x1="7.99922"
        y1="2"
        x2="7.99922"
        y2="14"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFA858" />
        <stop offset="1" stopColor="#F44D4D" />
      </linearGradient>
    </defs>
  </svg>
);

export const FavoritesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.77379 2.5012C8.45573 1.83103 7.54066 1.83347 7.22587 2.50532L5.85777 5.42522L2.74013 5.89754C2.03272 6.00472 1.74951 6.91318 2.26063 7.43565L4.52084 9.74603L3.98383 12.9389C3.85927 13.6795 4.60493 14.2451 5.23958 13.8914L7.99942 12.3535L10.7599 13.8919C11.3941 14.2453 12.1394 13.6809 12.0159 12.9407L11.4831 9.74635L13.74 7.435C14.2501 6.91255 13.9672 6.0053 13.2606 5.8976L10.1615 5.42524L8.77379 2.5012Z"
      fill="#F8B200"
    />
  </svg>
);

export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    align-items: center;
    height: 100%;
    padding: 0 2px 0 0;
  `,
  Icon: styled(dropStyle.Icon)`
    svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
  `,
};

export const DropdownSelectWrapper = styled(DropdownSelect)`
  font-size: 12px;
  margin-right: 12px;

  .KuxDropDown-trigger {
    padding: 4px 0;

    > div {
      background-color: ${(props) => props.theme.colors.cover8};
      &:first-of-type {
        border-radius: 4px 0 0 4px;
        padding-left: 8px;
      }

      &:last-of-type {
        border-radius: 0 4px 4px 0;
        padding-right: 8px;
      }
    }
  }

  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;
