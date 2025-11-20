/**
 * Owner: gavin.liu1@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { IMAGES_MAP } from './useEagerLoadResources';
import { ReactComponent as OneWIcon } from 'src/assets/referFriend/1w.svg';
import { ReactComponent as HintIcon } from 'src/assets/referFriend/hint.svg';
import JsBridge from 'utils/jsBridge';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getHomeInfoMap, MODE, TABS, gray, getAwardsInfo } from './options';
// import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'dva';
import useReferFriends from '../hooks/useReferFriends';
import useModals from './../hooks/useModals';
import { MODAL_MAP, AWARD_ID } from '../common/map'
import { BetterSpin } from '../common/BetterSpin';
// import { Pagination } from '@kufox/mui';
// import styles from './style.less';
import { isFunction, isNil, floor, trim } from 'lodash';
import { useLocalStorageState, useSize, useInViewport } from 'ahooks';
import { useReferInfo } from './useReferInfo'
import { media } from '../common/media'
import { useLocale } from 'src/hooks/useLocale';
import { _t, _tHTML } from 'utils/lang';
import { withEffect } from '../common/withEffect';
import { referFriendExpose, referFriendTrackClick } from '../config';
import { isIOS, numberFixed } from 'helper'

// swiper
// import { Swiper, SwiperSlide } from 'swiper/react'
// import "swiper/swiper.min.css";

const {
  dotBgUrl,
  linesBgUrl,
  ruleIconUrl,
  usdtIconUrl,
  usdtCoinUrl,
  subTitleBgUrl,
  subTitleBgPrefixUrl,
  noDataIconUrl,
  flashUrl,
  awardBgCornerUrl,
  awardBgBorderUrl,
  signupHelpIconUrl,
  signupIconUrl,
  loadMoreIconUrl,
} = IMAGES_MAP;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  // ios touch transparent
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 400px;
`;

const Dot = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  object-position: bottom;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
  user-select: none;
  pointer-events: none;
`;

const Lines = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: bottom;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
  user-select: none;
  pointer-events: none;
`;

const RuleHelperIcon = styled.a`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(calc(-50% - 13px));
  width: 39px;
  height: 30px;
  background-color: #3d4b69;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  overflow: hidden;
`;

const RuleIcon = styled.img`
  max-width: 100%;
  flex-shrink: 0;
  user-select: none;
  pointer-events: none;
`;

const RuleIconBox = styled.div`
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopBox = styled.div`
  z-index: 40;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-style: italic;
  font-weight: 800;
  font-size: 32px;
  line-height: 36px;
  text-align: center;
  text-transform: uppercase;
  max-width: 277px;
  margin-bottom: 9px;
  word-wrap: break-word;

  span {
    span {
      display: inline-block;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;

      --__bg: #01BC8D 18.21%, #17D0A2 52.19%, #4EE4BF 60.57%;
      background-image: linear-gradient(92.63deg, var(--__bg));
      padding-right: 10px;
      margin-right: -10px;

      ${media.rtl} {
        padding-right: 0;
        margin-right: 0;
        padding-left: 10px;
        margin-left: -10px;
        background-image: linear-gradient(-92.63deg, var(--__bg));
      }
    }
  }
`;

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 106px;
  margin-bottom: 32px;
  position: relative;
`;

const TimerTransformer = styled.div`
  transform: matrix(1, 0, -0.14, 0.99, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 6px;
  max-width: 270px;
  --_bg: #019570 0.41%, #05ad83 31.84%, #16cfa0 90.85%;
  background-image: linear-gradient(90.73deg, var(--_bg));

  ${media.rtl} {
    background-image: linear-gradient(-90.73deg, var(--_bg));
  }

  ${(props) => {
    if (props.disabled) {
      return `
        background: #3C475B;
      `;
    }
  }}
`;

const TimerValidBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

const TimerInvalid = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: rgba(243, 243, 243, 0.6);
`;

const TimerBox = styled.div`
  position: relative;

  &::before {
    position: absolute;
    top: 0;
    left: 50%;
    width: 3.76px;
    height: 3.76px;
    background: #0ab78c;
    transform: translate(-50%, -1.6px) rotate(136deg);
    content: '';
  }
  ${(props) => {
    if (props.disabled) {
      return `
        &::before {
          background: #3C475B;
        }
      `;
    }
  }}
`;

const TimerEnd = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  /* margin-right: 3px; */

  --_bg: #18284b 0.89%, #243967 100.1%;
  background-image: linear-gradient(88.4deg, var(--_bg));
  ${media.rtl} {
    background-image: linear-gradient(-88.4deg, var(--_bg));
  }
`;

const TimerEndLeft = styled(TimerEnd)`
  margin-right: 3px;
`

const TimerEndRight = styled(TimerEnd)`
  margin-left: 3px;
`

const Timer = styled.div`
  display: inline-flex;
  align-items: center;
  // perf
  transform: translate(0, 0, 0);
`;

const TimerUnit = styled.div`
  display: inline-flex;

  & + & {
    margin-left: 2px;
  }
`;

const TimerUnitNumber = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 130%;
  color: #ffffff;
`;

const TimerUnitAlphabet = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  // scale to 10px
  transform: scale(0.833) translateY(1px);

  line-height: 130%;
  color: #ffffff;
  mix-blend-mode: normal;
  opacity: 0.6;
`;

const LeftSubTitleBox = styled.div`
  max-width: 200px;
  width: max-content;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const LeftSubTitleBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

const LeftSubTitleBackgroundImg = styled.img`
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;

  ${media.rtl} {
    transform: scaleX(-1);
  }
`;

const LeftSubTitleBackgroundPrefixImg = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 100%;
  user-select: none;
  pointer-events: none;

  ${media.rtl} {
    transform: scaleX(-1);
  }
`;

const LeftSubTitleText = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #e1e8f5;
  padding: 2px 20px 2px 18px;
  z-index: 50;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`;

const LeftSubTitleTextLabel = styled.div`
  z-index: 60;
  position: relative;
`;

const ContentBox = styled.div`
  padding-left: 33px;
  padding-right: 33px;
  display: flex;
  flex-direction: column;
  padding-top: 18px;
`;

const ContentTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 130%;
  color: #f3f3f3;
  padding-bottom: 2px;

  span {
    span {
      color: #01bc8d;
      padding: 0 2px;
    }
  }
`;

const ContentUSDT = styled.div`
  font-style: italic;
  font-weight: 800;
  font-size: 32px;
  line-height: 36px;
  text-transform: uppercase;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  --_bg: #01bc8d 18.21%, #17d0a2 52.19%, #4ee4bf 60.57%;
  background-image: linear-gradient(92.63deg, var(--_bg));

  ${media.rtl} {
    background-image: linear-gradient(-92.63deg, var(--_bg));
    padding-left: 10px;
    margin-left: -6px;
  }
`;

const PlusSignup = styled.div`
  margin-bottom: 23px;
  margin-top: 8px;
  padding: 2px 6.5px 2px 32px;
  background: linear-gradient(90.64deg, #39455E 0.36%, #282E38 87.56%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  position: relative;
  width: max-content;
  cursor: pointer;
  font-size: 12px;

  ${props => {
    if (props.isRussian) {
      return `
        padding-right: 3px;
      `
    }
  }}
`

const PlusSignupHelper = styled.img`
  max-width: 100%;
  user-select: none;
  pointer-events: none;
  flex-shrink: 0;
  margin-left: 3px;
  transform: scale(1.1) translateY(-1px);
`

const PlusSignupIcon = styled.img`
  max-width: 100%;
  user-select: none;
  pointer-events: none;
  position: absolute;
  left: 4px;
  top: 50%;

  ${props => {
    if (props.isRussian) {
      return `transform: translateY(calc(-50% + 1px));`
    } else {
      return `transform: translateY(calc(-50% - 2px));`
    }
  }}
`

const PlusSignupText = styled.div`
  font-weight: 700;
  // 10px
  font-size: 12px;
  transform: scale(0.833);
  transform-origin: center center;
  line-height: 130%;
  color: #F3F3F3;
  overflow: hidden;

  ${props => {
    if (props.isPL) {
      return `max-width: 260px;`
    }
    if (props.isES) {
      return `max-width: 245px;`
    }

    if (props.isRussian) {
      return `max-width: 245px;`
    } else {
      return `max-width: 325px;`
    }
  }}

  ${props => {
    if (props.size?.width) {
      const width = props.size.width
      const height = props.size.height
      const needEatWidth = (width * (1 - 0.833)) / 2;
      const needEatHeight = (height * (1 - 0.833)) / 2;
      return `
        margin: -${floor(needEatHeight, 4)}px -${floor(needEatWidth, 4)}px;
      `
    }
  }}
`

const ContentProgressBox = styled.div`
  height: ${23 + 2 + 11 + 4 + 16}px;
  width: 100%;
  padding-top: ${23 + 2}px;
  padding-bottom: ${4 + 16}px;
`;

const ContentProgressCore = styled.div`
  background: #252c39;
  border-radius: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 3px;
`;

const ContentProgressFirstLine = styled.div`
  background: #3c475b;
  border-radius: 10px;
  width: 30%;
`;

const ContentProgressFirstLineRaw = styled.div`
  background: ${(props) => props.color};
  border-radius: 10px;
  width: ${(props) => props.count}%;
  height: 5px;
  transition: width 0.5s ease-in-out;
`;

const ContentProgressIconBase = styled.div`
  margin-left: 3px;
  margin-right: 3px;
  width: 7px;
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
`;

const ContentProgressFirstIcon = styled(ContentProgressIconBase)``;

const ContentProgressSecondLine = styled.div`
  background: #3c475b;
  border-radius: 10px;
  width: 100%;
`;

const ContentProgressSecondLineRaw = styled.div`
  background: ${(props) => props.color};
  border-radius: 10px;
  width: ${(props) => props.count}%;
  height: 5px;
  transition: width 0.5s ease-in-out;
`;

const ContentProgressSecondIcon = styled(ContentProgressIconBase)``;

const ContentProgressFirstIconAbsolute = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ContentProgressFirstIconTop = styled.div`
  position: absolute;
  left: 0;
  top: -7.5px;
  transform: translate(-50%, -100%);
  display: flex;
  flex-wrap: nowrap;
  font-style: italic;
  font-weight: 800;
  line-height: 130%;
  color: ${(props) => props.color};
  align-items: flex-end;
`;

const ContentProgressFirstIconTopNumber = styled.div`
  font-size: 18px;
`;

const ContentProgressFirstIconTopUnit = styled.div`
  font-size: 12px;
  padding-left: 2px;
  transform: translateY(2px);
`;

const ContentProgressFirstIconBottom = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.color};
  position: absolute;
  left: 0;
  bottom: -9.5px;
  transform: translate(-50%, 100%);
  overflow: hidden;
  max-width: 155px;
  width: max-content;
  text-align: center;
`;

const ContentProgressSecondIconAbsolute = styled.div`
  position: absolute;
  left: calc(50% + 10px);
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ContentProgressSecondIconTop = styled.div`
  position: absolute;
  left: 0;
  top: -7.5px;
  transform: translate(-100%, -100%);
  display: flex;
  flex-wrap: nowrap;
  font-style: italic;
  font-weight: 800;
  line-height: 130%;
  color: ${(props) => props.color};
  align-items: flex-end;
  cursor: pointer;

  svg {
    flex-shrink: 0;

    path {
      fill: ${(props) => props.color};
    }
  }
`;

const ContentProgressSecondIconTopNumber = styled.div`
  font-size: 18px;
`;

const ContentProgressSecondIconTopUnit = styled.div`
  font-size: 12px;
  padding-left: 2px;
  transform: translateY(2px);
`;

const ContentProgressSecondIconBottom = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.color};
  position: absolute;
  left: 0;
  bottom: -9.5px;
  transform: translate(-100%, 100%);
  overflow: hidden;
  max-width: 155px;
  width: max-content;
  text-align: right;
`;

const UsdtBox = styled.div`
  width: 100%;
  // 预留 50px coin height
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  margin-top: 20px;
`;

const UsdtIcon = styled.img`
  max-width: 100%;
  width: 100%;
  flex-shrink: 0;
  user-select: none;
  pointer-events: none;
`;

const UsdtCoinBox = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  margin-top: 20px;
  transition: all 0.3s ease;

  ${(props) => {
    if (!props.disabled) {
      return `
        animation: floating 1.2s ease-in-out infinite alternate;
      `;
    }
  }}

  @keyframes floating {
    from {
      transform: translate(-50%, 0);
    }
    to {
      transform: translate(-50%, -13px);
    }
  }
`;

const UsdtCoinBackground = styled.div`
  background: #b0f5dc;
  filter: blur(20px);
  position: absolute;
  /* magic offset: 图是长方形的，不是正方形的 */
  left: 3px;
  top: 4px;
  transform: scale(0.93);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  z-index: -1;

  ${(props) => {
    if (!props.disabled) {
      return `
        animation: floating-bg 1.2s ease-in-out infinite alternate;
      `;
    }
  }}

  @keyframes floating-bg {
    from {
      transform: scale(0.93);
    }
    to {
      transform: scale(1);
    }
  }
`;

const UsdtCoin = styled.img`
  flex-shrink: 0;
  user-select: none;
  pointer-events: none;
  width: 97px;
  height: 106px;

  // >= 500px , <= 768px, auto expand
  @media screen and (min-width: 500px) and (max-width: 768px) {
    width: 20vw;
    height: auto;
  }
`;

const ButtonLine = styled.div`
  padding: 0 16px;
  margin-top: -26px;
  overflow: hidden;
`;

const ButtonFlashBox = styled.div`
  position: absolute;
  overflow: hidden;
  border-radius: 24px;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`

const ButtonBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  padding-top: 13.5px;
  padding-bottom: 13.5px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  user-select: none;
  width: 100%;
  background: #01bc8d;
  border-radius: 24px;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  color: #fff;
  height: 48px;

  ${props => {
    if (props.isRussian) {
      return `
      padding-top: 0;
      padding-bottom: 0;
      `
    }
  }}

  ${(props) => {
    if (props.disabled) {
      return `
      background: #3C475B;
      color: rgba(225, 232, 245, 0.4);
      cursor: not-allowed;
      user-select: none;
      pointer-events: none;
      `;
    }
  }}

  &:active {
    transform: scale(0.99);
    filter: brightness(1.1);
  }

  &:hover {
    filter: brightness(1.1);
  }
`;

const ButtonText = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 130%;
  z-index: 60;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 15px;

  ${props => {
    if (props.isRussian) {
      return `
        line-height: 100%;
      `
    }
  }}
`;

const ButtonFlash = styled.img`
  width: 125px;
  height: 100%;
  user-select: none;
  pointer-events: none;
  transition: all 0.2s ease;
  animation: flash 2.5s linear infinite;
  overflow: hidden;
  border-radius: 24px;
  position: absolute;

  @keyframes flash {
    0% {
      left: -100%;
      opacity: 0;
    }
    50% {
      left: 0;
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0.2;
    }
  }
`;

const TableBox = styled.div`
  background: linear-gradient(180deg, #232b3c -15.33%, #11151f 32.59%);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  min-height: 371px;
  width: 100%;
  padding-top: 22px;
  display: flex;
  flex-direction: column;
`;

const TableLeftTitleLine = styled.div`
  padding-bottom: 21px;
  width: 100%;
`;

const TableTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 16px 11.5px 16px;
  cursor: default;

  // hide scroll bar
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TableDivider = styled.div`
  padding-top: 0.5px;
  width: 100%;
  background: rgba(188, 200, 224, 0.12);
`;

const TableTab = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 130%;
  color: rgba(243, 243, 243, 0.4);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
  text-align: center;
  word-break: break-all;

  ${(props) => {
    if (props.active) {
      return `color: #F3F3F3;`;
    }
  }}

  ${(props) => {
    if (props.hasNew) {
      return `
        &::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #F65454;
          position: absolute;
          top: 0;
          right: -1px;
          transform: translate(100%, 0);
        }
      `;
    }
  }}
`;

const TableTabActiveMark = styled.div`
  width: 24px;
  height: 4px;
  background: #01bc8d;
  border-radius: 2px;
  position: absolute;
  bottom: -7.5px;
  left: 50%;
  transform: translate(-50%, 100%);
`;

const NoDataLine = styled.div`
  width: 100%;
  padding: 52px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoDataBox = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoDataImg = styled.img`
  max-width: 100%;
  width: 100%;
  height: 88px;
  flex-shrink: 0;
  user-select: none;
  pointer-events: none;
`;

const NoDataText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: rgba(243, 243, 243, 0.4);
  margin-top: 14px;
  text-align: center;
`;

const TableContent = styled.div`
  width: 100%;
`;

const Hint = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  margin-top: 12px;
  margin-bottom: 26px;
  cursor: pointer;
  color: rgba(243, 243, 243, 0.4);
  width: 100%;
  padding: 0 50px;

  svg {
    flex-shrink: 0;
  }
`;

const HintText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
`;

const OneWIconWithStyle = styled(OneWIcon)`
  margin-left: 5.5px;
  margin-bottom: 3px;
`;

const TableHelpBox = styled.div`
  padding: 24px 0 24px 16px;
  display: flex;
  flex-direction: column;
`;

const TableHelpHeader = styled.div`
  display: grid;
  // 2 cols 1 row
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 15px;
  padding-right: 16px;
`;

const TableHelpHeaderBase = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: rgba(243, 243, 243, 0.6);
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TableHelpHeaderAccount = styled(TableHelpHeaderBase)``;

const TableHelpHeaderAmount = styled(TableHelpHeaderBase)`
  text-align: right;
`;

const TableHelpList = styled.div`
  margin-top: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: ${132 + 2 * 18}px;
  margin-right: 4px;
  overscroll-behavior: contain;

  // scroll
  &::-webkit-scrollbar {
    width: 4px;
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    color: transparent;
    background: transparent;
    border-radius: 2px;

    ${props => {
      if (props.isIOS) {
        return `
          -webkit-box-shadow: inset 0 0 6px transparent;
        `
      }
    }}
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;

    ${props => {
      if (props.isIOS) {
        return `-webkit-box-shadow: inset 0 0 0 6px rgba(243, 243, 243, 0.12);`
      } else {
        return `background: rgba(243, 243, 243, 0.12);`
      }
    }}
  }
`;

const TableHelpLine = styled(TableHelpHeader)`
  padding-right: 12px;

  & + & {
    margin-top: 12px;
  }
`;

const TableHelpLineAccount = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: #f3f3f3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TableHelpLineAmount = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 130%;
  text-align: right;
  color: #01bc8d;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TableHelpLineAmountNumber = styled.div`
  display: inline-flex;

  ${media.rtl} {
    flex-direction: row-reverse;
  }
`

const TableAwardBox = styled.div`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
`;

const TableAwardTip = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: rgba(243, 243, 243, 0.6);
  opacity: 0.6;
  padding-bottom: 16px;
`;

const TableAwardList = styled.div`
  // grid 3 cols
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const TableAwardItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 12px 0;
  overflow: hidden;
`;

const TableAwardNewBadge = styled.div`
  position: absolute;
  right: 7px;
  top: 7px;
  padding: 0 8px;
  background: #f65454;
  border: 2px solid #ffffff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  // 16px to 8px
  transform: scale(0.5);
  transform-origin: right top;
`;

const TableAwardBackground = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  pointer-events: none;
`;

const TableAwardBackgroundCorner = styled(TableAwardBackground)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 96%;
`

const TableAwardIcon = styled.div`
  display: flex
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;
  padding-bottom: 8px;

  img {
    flex-shrink: 0;
    max-width: 100%;
    width: 50px;
    aspect-ratio: 1 / 1;
  }
`;

const TableAwardAmount = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: #01bc8d;
  padding-bottom: 2px;
  word-break: break-all;
  padding: 0 15px;
`;

const TableAwardDesc = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: rgba(243, 243, 243, 0.4);
  // 12px to 11px
  transform: scale(0.91667);
  transform-origin: center top;
  // max 2 cols
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  padding: 0 5px;
`;

const SwiperSingle = styled.div`
  width: 100%;
`

const LoadMoreIcon = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9px 0;

  > img {
    user-select: none;
    pointer-events: none;
    max-width: 100%;
    transform: translateX(-4px);
  }
`

const SWIPER_INDEX = {
  [TABS.help]: 0,
  [TABS.award]: 1,
}

export const Home = ({ sharePost }) => {
  const { clearModal, showModal } = useModals();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);
  const { handleLogin, firstTradeCompleted } = useReferFriends();

  // signup element ref
  const signupRef = useRef(null);
  const signupElementSize = useSize(signupRef);

  // swiper
  const swiperInstance = useRef(null);

  const { isRTL, isRussian, isES, isPL } = useLocale();
  const isMultiLine = isES || isPL;

  const {
    referInfo,
    minute, hour, second,
    isExpired, mode,
    totalLabel, remainLabel,
    getSecondProgressWidth,
    needShowSignupTips
  } = useReferInfo();
  const ruleLink = referInfo?.supportRule || '/';

  const [activeTab, setActiveTab] = useState(TABS.help);
  const isHelpTab = activeTab === TABS.help;
  const isAwardTab = activeTab === TABS.award;

  const homeInfo = useMemo(() => {
    const map = getHomeInfoMap();
    const defaultInfo = map[MODE.notLogin];
    const info = map?.[mode] || defaultInfo;

    // expired handle
    if (isExpired) {
      // set all color gray
      info.first.color = gray;
      info.first.top.color = gray;
      info.first.bottom.color = gray;
      info.second.color = gray;
      info.second.top.color = gray;
      info.second.bottom.color = gray;
    }

    return info;
  }, [mode, isExpired]);

  const changeTab = (newTab) => {
    setActiveTab(newTab);
    // swiper change
    const idx = SWIPER_INDEX[newTab];
    swiperInstance.current?.slideTo(idx);
  };

  const onShare = () => {
    sharePost?.()
  }

  const onHint = () => {
    showModal(MODAL_MAP.SECRET_POWER_DOUBLED);
  };

  const onGetOneWUsdt = () => {
    showModal(MODAL_MAP.USDT_10000_TIP);
  };

  const activeTabMark = useMemo(() => {
    return (
      <div>
        <TableTabActiveMark />
      </div>
    )
  }, [])

  const buttonLabel = useMemo(() => {
    return isLogin
      ? withEffect(
          _t('8fnPS6rdpzktvZPhVYfudN'),
          () => referFriendExpose(['referralButton', '1'])
        )
      : withEffect(
          _t('xjfQh7YtZkqCagN5cFXVoa'),
          () => referFriendExpose(['SignOrLogin', '1'])
        )
  }, [isLogin])
  const onBtnClick = () => {
    if (isExpired) {
      return;
    }
    if (isLogin) {
      referFriendTrackClick(['referralButton', '1'])
      // open share modal
      if (firstTradeCompleted) {
        onShare()
      } else {
        showModal(MODAL_MAP.TRADE_TIP)
      }
    } else {
      referFriendTrackClick(['SignOrLogin', '1'])
      // goto login
      handleLogin();
    }
  };

  const onOpenSignupModal = () => {
    showModal(MODAL_MAP.SIGNATURE_SPOTLIGH);
  }

  // award table data
  // 全量一次性获取，不再刷新
  const awardRecords = useSelector((state) => state.referFriend.awardRecords) || {};
  const [awardOpenedStatus, setAwardOpenedStatus] = useLocalStorageState(
    'kc-land-refer-friend-award-record-opened-status_v2',
    { defaultValue: {} },
  );
  const onAwardItemClick = (award) => {
    const id = getAwardLocalStorageId(award);
    setAwardOpenedStatus((pre) => {
      if (pre[id]) {
        return pre;
      }
      return {
        ...pre,
        [id]: true,
      };
    });
    const modalId = award?.info?.modal;
    if (modalId) {
      showModal(modalId);
    }
  };
  const getAwardItemInfo = useCallback((item) => {
    const list = getAwardsInfo();
    const target = list.find((i) => {
      const isIdMatch = i.id === item?.awardId;
      return isIdMatch;
    });
    return target;
  }, []);
  const awardDataWithInfo = useMemo(() => {
    const data = awardRecords?.items || [];
    return data
      .map((i) => {
        const localStorageId = getAwardLocalStorageId(i);
        const isNew = !awardOpenedStatus?.[localStorageId];
        return {
          ...i,
          info: getAwardItemInfo(i),
          isNew,
        };
      })
      .filter((i) => {
        return !isNil(i.info);
      });
  }, [awardRecords, awardOpenedStatus]);
  // const hasNewAward = useMemo(() => {
  //   return awardDataWithInfo.some((i) => i.isNew);
  // }, [awardDataWithInfo]);
  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'referFriend/getAwardRecords',
        payload: {
          page: 1,
          pageSize: 500,
        },
      });
    }
  }, [isLogin]);

  // coundown
  // FIXME: 不同国家的语序不同，但节点太复杂，而且要动态变化，没法内嵌，只能识别位置
  const isCountdownLeft = useMemo(() => {
    const key = '{countdown}'
    const label = _t('ezzmEnoD3rbbksvthiSc1s', { countdown: key })
    const trimedLabel = trim(label)
    const isStart = trimedLabel.startsWith(key)
    return isStart
  }, [])

  return (
    // <AnimatePresence exitBeforeEnter>
      <Wrapper>
        <Background>
          <Lines src={linesBgUrl} alt="lines-background" />
          <Dot src={dotBgUrl} alt="dot-background" />
        </Background>
        <TopBox>
          <TitleBox>
            {/* rule icon */}
            <RuleHelperIcon href={ruleLink} target="_blank" onClick={(e) => {
              if (JsBridge.isApp()) {
                e.preventDefault();
                e.stopPropagation();

                JsBridge.open({
                  type: 'event',
                  params: {
                    name: 'updateHeader',
                    visible: true,
                  },
                });

                window.originOpen(ruleLink, 'noopener noreferrer');
              }
            }}>
              <RuleIconBox>
                <RuleIcon src={ruleIconUrl} alt="rule url" />
              </RuleIconBox>
            </RuleHelperIcon>
            <Title>
              {_tHTML('29HVhebCB83fBhCSbqMVQx', {
                num: `10,000`
              })}
            </Title>
            {/* timer */}
            <TimerBox disabled={isExpired}>
              <TimerTransformer disabled={isExpired}>
                {isExpired ? (
                  <TimerInvalid>{_t('dDXtJiDSkRJEMc9opBCJc3')}</TimerInvalid>
                ) : (
                  <TimerValidBox>
                    {!isCountdownLeft && (
                      <TimerEndLeft>{_t('ezzmEnoD3rbbksvthiSc1s', { countdown: '' })}</TimerEndLeft>
                    )}
                    <Timer>
                      {/* h */}
                      <TimerUnit>
                        <TimerUnitNumber>{hour}</TimerUnitNumber>
                        <TimerUnitAlphabet>{`H`}</TimerUnitAlphabet>
                      </TimerUnit>
                      {/* m */}
                      <TimerUnit>
                        <TimerUnitNumber>{minute}</TimerUnitNumber>
                        <TimerUnitAlphabet>{`M`}</TimerUnitAlphabet>
                      </TimerUnit>
                      {/* s */}
                      <TimerUnit>
                        <TimerUnitNumber>{second}</TimerUnitNumber>
                        <TimerUnitAlphabet>{`S`}</TimerUnitAlphabet>
                      </TimerUnit>
                    </Timer>
                    {isCountdownLeft && (
                      <TimerEndRight>{_t('ezzmEnoD3rbbksvthiSc1s', { countdown: '' })}</TimerEndRight>
                    )}
                  </TimerValidBox>
                )}
              </TimerTransformer>
            </TimerBox>
          </TitleBox>
          <SubTitle title={_t('aBC1YJQoAthtvGDRqmhDht')} />
          {/* content */}
          <ContentBox>
            <ContentTitle>
              {isFunction(homeInfo.title) ? homeInfo.title(totalLabel) : homeInfo.title}
            </ContentTitle>
            <ContentUSDT>
              <span>{`${remainLabel} USDT`}</span>
            </ContentUSDT>
            {/* 加签卷 */}
            {needShowSignupTips ? (
              <PlusSignup isRussian={isRussian} onClick={onOpenSignupModal}>
                <PlusSignupIcon isRussian={isRussian} src={signupIconUrl} alt="coupon" />
                <PlusSignupText isES={isES} isPL={isPL} isRussian={isRussian} ref={signupRef} size={signupElementSize}>
                  {_t('8K1WS4fseAsNd9tgnqUiSm')}
                  <PlusSignupHelper src={signupHelpIconUrl} alt='help' />
                </PlusSignupText>
              </PlusSignup>
            ) : (
              <div style={{ paddingTop: 24 }} />
            )}
            {/* progress */}
            <ContentProgressBox>
              <ContentProgressCore>
                <ContentProgressFirstLine>
                  <ContentProgressFirstLineRaw
                    color={homeInfo.first.color}
                    count={homeInfo.first.count}
                  />
                </ContentProgressFirstLine>
                <ContentProgressFirstIcon>
                  <ContentProgressFirstIconAbsolute>
                    {/* 50 usdt */}
                    <ContentProgressFirstIconTop color={homeInfo.first.top.color}>
                      <ContentProgressFirstIconTopNumber>{`50`}</ContentProgressFirstIconTopNumber>
                      <ContentProgressFirstIconTopUnit>{`USDT`}</ContentProgressFirstIconTopUnit>
                    </ContentProgressFirstIconTop>
                    <ContentProgressFirstIconBottom color={homeInfo.first.bottom.color}>
                      {homeInfo.first.bottom.text}
                    </ContentProgressFirstIconBottom>
                  </ContentProgressFirstIconAbsolute>
                  {homeInfo.first.icon(isExpired ? gray : undefined)}
                </ContentProgressFirstIcon>
                <ContentProgressSecondLine>
                  <ContentProgressSecondLineRaw
                    color={homeInfo.second.color}
                    count={
                      getSecondProgressWidth(homeInfo.second.count)
                    }
                  />
                </ContentProgressSecondLine>
                <ContentProgressSecondIcon>
                  <ContentProgressSecondIconAbsolute>
                    {/* 10000 usdt */}
                    <ContentProgressSecondIconTop
                      onClick={onGetOneWUsdt}
                      color={homeInfo.second.top.color}
                    >
                      <ContentProgressSecondIconTopNumber>{`10,000`}</ContentProgressSecondIconTopNumber>
                      <ContentProgressSecondIconTopUnit>{`USDT`}</ContentProgressSecondIconTopUnit>
                      <OneWIconWithStyle />
                    </ContentProgressSecondIconTop>
                    <ContentProgressSecondIconBottom color={homeInfo.second.bottom.color}>
                      {homeInfo.second.bottom.text}
                    </ContentProgressSecondIconBottom>
                  </ContentProgressSecondIconAbsolute>
                  {homeInfo.second.icon(isExpired ? gray : undefined)}
                </ContentProgressSecondIcon>
              </ContentProgressCore>
            </ContentProgressBox>
          </ContentBox>
          {/* usdt icon */}
          <UsdtBox>
            <UsdtIcon src={usdtIconUrl} alt="usdt" />
            <UsdtCoinBox disabled={isExpired}>
              <UsdtCoinBackground disabled={isExpired} />
              <UsdtCoin src={usdtCoinUrl} alt="coin" />
            </UsdtCoinBox>
          </UsdtBox>
          {/* button */}
          <ButtonLine>
            <ButtonBox isRussian={isRussian} onClick={onBtnClick} disabled={isExpired}>
              {!isExpired && (
                <ButtonFlashBox>
                  <ButtonFlash src={flashUrl} alt='flash' />
                </ButtonFlashBox>
              )}
              <ButtonText isRussian={isRussian}>{buttonLabel}</ButtonText>
            </ButtonBox>
          </ButtonLine>
          {/* 秘诀 */}
          {isLogin ? (
            <Hint onClick={onHint}>
              <HintText>
                {_t('2JTSDRiZsvv1VhaEZCZV1z')}
                <HintIcon style={{ marginLeft: 4, transform: 'translateY(3px)' }} />
              </HintText>
            </Hint>
          ) : (
            <div style={{ paddingTop: 24 }} />
          )}
          {/* table */}
          <TableBox>
            <TableLeftTitleLine>
              <SubTitle title={_t('ghyECAFnp1pPkjgrA2Fg2h')} />
            </TableLeftTitleLine>
            <TableTabs>
              <TableTab
                active={isHelpTab}
                onClick={() => {
                  changeTab(TABS.help);
                }}
              >
                {_t('jcW5Jnc5jN3ukseVtH4dma')}
                {isHelpTab && activeTabMark}
              </TableTab>
              <TableTab
                style={{
                  marginLeft: isRTL ? 0 : 24,
                  marginRight: isRTL ? 24 : 0,
                }}
                active={isAwardTab}
                onClick={() => {
                  changeTab(TABS.award);
                }}
                // hasNew={hasNewAward}
              >
                {_t('5Zjs9TxSFZdNhgeR4z5mcD')}
                {isAwardTab && activeTabMark}
              </TableTab>
            </TableTabs>
            <TableDivider />
            <TableContent>
              {isHelpTab && <TableHelpRecord />}
              {isAwardTab && (
                <TableAwardRecord
                  awardRecords={awardRecords}
                  awardDataWithInfo={awardDataWithInfo}
                  onItemClick={onAwardItemClick}
                />
              )}
              {/* <Swiper
                // 防止在 pc 端轻易就被划走
                edgeSwipeThreshold={80}
                threshold={5}
                onSlideChange={(swiper) => {
                  const list = Object.entries(SWIPER_INDEX);
                  list.some(([tab, index]) => {
                    if (index === swiper.activeIndex) {
                      setActiveTab(tab);
                      return true;
                    }
                  })
                }}
                onSwiper={(ins) => {
                  swiperInstance.current = ins;
                }}
              >
                <SwiperSlide>
                  <SwiperSingle>
                    <TableHelpRecord />
                  </SwiperSingle>
                </SwiperSlide>
                <SwiperSlide>
                  <SwiperSingle>
                    <TableAwardRecord
                      awardRecords={awardRecords}
                      awardDataWithInfo={awardDataWithInfo}
                      onItemClick={onAwardItemClick}
                    />
                  </SwiperSingle>
                </SwiperSlide>
              </Swiper> */}
            </TableContent>
          </TableBox>
        </TopBox>
      </Wrapper>
    // </AnimatePresence>
  );
};

function SubTitle({ title }) {
  return (
    <LeftSubTitleBox>
      <LeftSubTitleText>
        <LeftSubTitleBackground>
          <LeftSubTitleBackgroundImg src={subTitleBgUrl} alt="background" />
          <LeftSubTitleBackgroundPrefixImg src={subTitleBgPrefixUrl} alt="background-prefix" />
        </LeftSubTitleBackground>
        <LeftSubTitleTextLabel>{title}</LeftSubTitleTextLabel>
      </LeftSubTitleText>
    </LeftSubTitleBox>
  );
}

function NoData() {
  return (
    <NoDataLine>
      <NoDataBox>
        <NoDataImg src={noDataIconUrl} alt="empty" />
        <NoDataText>{_t('nftInfo.tabs.nodata')}</NoDataText>
      </NoDataBox>
    </NoDataLine>
  );
}

function TableHelpRecord() {
  const { isLogin } = useSelector((state) => state.user);
  const loading = useSelector((state) => state.loading);
  const assistList = useSelector((state) => state.referFriend.assistList) || [];
  const notHasMoreAssistList = useSelector((state) => state.referFriend.notHasMoreAssistList);
  const dispatch = useDispatch();

  // const data = assistRecords?.items || [];
  // const total = assistRecords?.totalNum || 0;
  const isEmpty = assistList?.length === 0;
  const isLoading = loading.effects['referFriend/getAssistRecords'];
  // const onlyHasOnePage = total <= pageSize;

  const lastRef = useRef(null);
  const [isInViewport] = useInViewport(lastRef)

  // auto load more
  const pageRef = useRef(1);
  const pageSizeRef = useRef(20);
  const loadData = (loadMore = false) => {
    const page = pageRef.current;
    const pageSize = pageSizeRef.current;
    dispatch({
      type: 'referFriend/getAssistRecords',
      payload: {
        page,
        pageSize,
        loadMore
      },
    });
  }

  // load more data
  useEffect(() => {
    if (!notHasMoreAssistList && isInViewport) {
      pageRef.current += 1;
      loadData(true);
    }
  }, [isInViewport, notHasMoreAssistList])

  // first load data
  useEffect(() => {
    if (isLogin) {
      loadData();
    }
  }, [isLogin]);

  if (isEmpty) {
    return (
      <BetterSpin spinning={!isLogin ? false : isLoading}>
        <NoData />
      </BetterSpin>
    );
  }

  return (
    <BetterSpin spinning={false}>
      <TableHelpBox>
        <TableHelpHeader>
          <TableHelpHeaderAccount>{_t('exoWh3T3bHMpRx1qMktXem')}</TableHelpHeaderAccount>
          <TableHelpHeaderAmount>{_t('9aUcEVo2KcuzjQehULYPMa')}</TableHelpHeaderAmount>
        </TableHelpHeader>
        <TableHelpList isIOS={isIOS()}>
          {(assistList || []).map((i, idx) => {
            return (
              <TableHelpLine
                key={i.supportUid}
              >
                <TableHelpLineAccount>{i.supportUser}</TableHelpLineAccount>
                <TableHelpLineAmount>
                  {Number(i.supportAmount) === 0
                    ? '0'
                    : (
                      <TableHelpLineAmountNumber>
                        <span>+</span>
                        <span>{`${numberFixed(i.supportAmount, 4)}`}</span>
                      </TableHelpLineAmountNumber>
                    )
                  }
                  {` `}
                  <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{`USDT`}</span>
                </TableHelpLineAmount>
              </TableHelpLine>
            );
          })}
          {(!notHasMoreAssistList && !isLoading) && (
            <LoadMoreIcon ref={(elm) => {
              lastRef.current = elm;
            }}>
              <img src={loadMoreIconUrl} alt='load-more' />
            </LoadMoreIcon>
          )}
          {isLoading && (
            <BetterSpin spinning size={15}>
              <div style={{ padding: '20px 0' }} />
            </BetterSpin>
          )}
        </TableHelpList>

        {/* pagination */}
        {/* {!onlyHasOnePage && (
          <div className={styles.pagination}>
            <Pagination
              disabled={isLoading}
              total={total}
              current={page}
              pageSize={pageSize}
              siblingCount={0}
              onChange={(nvPage) => {
                setPage(nvPage);
              }}
            />
          </div>
        )} */}
      </TableHelpBox>
    </BetterSpin>
  );
}

function getAwardLocalStorageId(award) {
  return `${award.awardId}-${award.obtainTime}`;
}

function TableAwardRecord({ awardRecords, awardDataWithInfo, onItemClick }) {
  const loading = useSelector((state) => state.loading);
  const total = awardRecords?.totalNum || 0;
  const isEmpty = total === 0;
  const isLoading = loading.effects['referFriend/getAwardRecords'];
  const { isLogin } = useSelector((state) => state.user);

  if (isEmpty) {
    return (
      <BetterSpin spinning={!isLogin ? false : isLoading}>
        <NoData />
      </BetterSpin>
    );
  }

  return (
    <BetterSpin spinning={isLoading}>
      <TableAwardBox>
        <TableAwardTip>{_t('3Eb331ic9iLDRKm1Ui2Z4h')}</TableAwardTip>
        <TableAwardList>
          {awardDataWithInfo.map((i, index) => {
            const info = i.info;
            const key = `${i.awardId}-${i.obtainTime}-${index}`
            // 特殊情况
            const isVip = i.awardId === AWARD_ID.VIPLv1Trial
            // const isNew = i.isNew;
            return (
              <TableAwardItem
                key={key}
                onClick={() => {
                  onItemClick?.(i);
                }}
              >
                <TableAwardBackgroundCorner src={awardBgCornerUrl} alt="border-corner" />
                <TableAwardBackground src={awardBgBorderUrl} alt="border" />
                {/* {isNew && <TableAwardNewBadge>{_t('tKCb586nyESWz76PgGHSWA')}</TableAwardNewBadge>} */}
                <TableAwardIcon>
                  <img src={info.url} alt={info.label} />
                </TableAwardIcon>
                <TableAwardAmount>
                  {isVip ? (
                    _t('cUgi8BAuGTNefbq4Tz3duv')
                  ) : (
                    <span>
                      {Number(i.valueOfUsdt) === 0 ? '0' : i.valueOfUsdt} <span>USDT</span>
                    </span>
                  )}
                </TableAwardAmount>
                <TableAwardDesc>{info.label}</TableAwardDesc>
              </TableAwardItem>
            );
          })}
        </TableAwardList>
      </TableAwardBox>
    </BetterSpin>
  );
}
