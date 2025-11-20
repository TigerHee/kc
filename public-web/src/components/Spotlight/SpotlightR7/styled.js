import { styled, Steps } from '@kux/mui';
import sanjiao from 'static/spotlight7/cardInnerRightTop.svg';
import LeftSide from 'static/spotlight7/left_side.svg';
import RightSide from 'static/spotlight7/right_side.svg';
import LeftTriangle from 'static/spotlight7/left_triangle.svg';
import RightTriangle from 'static/spotlight7/right_triangle.svg';
import { Link } from 'components/Router';

const TabBg = [
  {left: LeftSide, right: RightTriangle, widthL: 14, widthR: 58},
  {left: LeftTriangle, right: RightTriangle, widthL: 58, widthR: 58},
  {left: LeftTriangle, right: RightSide, widthL: 58, widthR: 14},
];

export const Wrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 2;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  color: #25d17f;
  border: none;
  margin-bottom: -1px;

  .middleContent {
    position: absolute;
    top: 0;
    left: 25px;
    width: calc(100% - 50px);
    height: 100%;
    background: ${(props) => props.theme.colors.overlay};
    /* background: #171717; */

    border-bottom: 1px solid;
    border-top: ${(props) => props.sm? 'none' : '1px solid'};

    &:before {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${(props) => props.theme.colors.cover2};
      content: '';
    }
  }

  .leftContent {
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: calc(100% - 25px);
    background: ${(props) => props.theme.colors.overlay};
    /* background: #171717; */
    border-left: 1px solid;
    border-top: ${(props) => props.sm? 'none' : '1px solid'};
    &:before {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${(props) => props.theme.colors.cover2};
      content: '';
    }
  }

  .rightContent {
    position: absolute;
    top: ${(props) => props.sm? '0':'25px'};
    right: 0;
    width: 25px;
    height: ${(props) => props.sm? '100%':'calc(100% - 25px)'};
    background-color: ${(props) => props.theme.colors.overlay};
    /* background: #171717; */

    border-right: 1px solid;
    border-bottom: 1px solid;
    &:before {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${(props) => props.theme.colors.cover2};
      content: '';
    }
  }

  .innerLeftIcon {
    position: absolute;
    top: calc(50% - 42px);
    left: 4px;
    z-index: 1;
    width: 9px;
    height: 84px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      left: 0px;
    }

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .innerRightIcon {
    position: absolute;
    right: 4px;
    bottom: 40px;
    z-index: 1;
    width: 9px;
    height: 84px;
    transform: rotate(180deg);
    ${(props) => props.theme.breakpoints.down('sm')} {
      right: 0px;
      bottom: 80px;

    }
    [dir='rtl'] & {
      transform: rotate(180deg) rotateY(180deg);
    }
  }

  .leftBorderIcon {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 25px;
    height: 25px;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  .rightBorderIcon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 25px;
    height: 25px;
    transform: rotate(180deg);

    [dir='rtl'] & {
      transform: rotate(180deg) rotateY(180deg);
    }
  }
  .innerTopIcon {
    position: absolute;
    top: 1px;
    right: 110px;
    z-index: 1;
    width: 61px;
    height: 6px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      top: 1px;
      left: 25px;

    }
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  .innerRightSmIcon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 25px;
    height: 25px;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  .innerRightTopIcon {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    width: 10px;
    height: 10px;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  .innerBottomIcon {
    position: absolute;
    bottom: 12px;
    left: 48px;
    z-index: 1;
    width: 38px;
    height: 5px;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

export const TabWrapper = styled.div`
  display: flex;
  height: 73px;
`;

export const TabItem = styled.div`
  width: calc(100% / 3);
  border-bottom: ${(props) => `${props.active?'none' : '1px solid #25D17F'}`};
  .item-bg {
    margin: auto;
    height: 100%;
    width: 100%;
  }
  text-align: center;
  &.active {
    display: flex;
    .item-bg {
      border-bottom: none;
      border-top: 1px solid#25D17F;
      width: ${(props) => `calc(100% - ${TabBg[props.value]?.widthL + TabBg[props.value]?.widthR}px)`};
      background: #171717;
    }
    &::before {
      position: relative;
      left: 0;
      display: block;
      width: ${(props) => `${TabBg[props.value]?.widthL}px`};
      height: 100%;
      background: ${(props) => `url(${TabBg[props.value]?.left}) no-repeat`};
      background-size: contain;
      content: '';
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
    &::after {
      position: relative;
      right: 0;
      display: block;
      width: ${(props) => `${TabBg[props.value]?.widthR}px`};
      height: 100%;
      background: ${(props) => `url(${TabBg[props.value]?.right}) no-repeat`};
      background-size: contain;
      content: '';
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  .status {
    padding-top: 14px;
    color: ${(props) => `${props.active?'#00C288': props.theme.colors.text60}`};
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
  .date {
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
  }
`;

export const H5TabWrapper = styled.div`
  position: relative;
  border-right: none;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.text40};

  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;

  .h5TabLeftBottom {
    position: absolute;
    left: 4px;
    bottom: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .h5TabRightBottom {
    position: absolute;
    right: 0;
    bottom: -16px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .h5TabInnerRight {
    position: absolute;
    right: 4px;
    top: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .h5TabRightTop {
    position: absolute;
    right: 0;
    top: 0;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .leftContent {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 100%;
    border: 1px solid rgba(243, 243, 243, 0.12);
    border-right: none;
    background: rgba(243, 243, 243, 0.02);

  }

  .rightContent {
    background: rgba(243, 243, 243, 0.02);
    position: absolute;
    top: 13px;
    right: 0;
    width: 16px;
    height: calc(100% - 14px);
    border-right: 1px solid rgba(243, 243, 243, 0.12);
  }

  .middleContent{
    position: absolute;
    top: 0;
    left: 16px;
    width: calc(100% - 32px);
    height: 100%;
    background: rgba(243, 243, 243, 0.02);
    border-bottom: 1px solid rgba(243, 243, 243, 0.12);
    border-top: 1px solid rgba(243, 243, 243, 0.12);
    z-index: -1;
  }

  .content {
    padding: 16px;
  }
  .activeWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /* .success {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  } */
  .currentPeriod {
    border-radius: 100px;
    background: rgba(140, 140, 140, 0.40);
    box-shadow: 0px 1.918px 10.069px 0px rgba(0, 0, 0, 0.10);
    box-shadow: 0px 1.918px 10.069px 0px rgba(0, 0, 0, 0.10);
    display: flex;
    width: 20px;
    height: 20px;
    padding: 0px 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12.5px;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    margin-right: 8px;
    &.active {
      background: #00C288;
    }
  }
  /* .line {
    &::before {
      content: '';
      position: relative;
      top: 20px;
      border: 1px dashed rgba(243, 243, 243, 0.16);
      height: 30px;
      display: block;
      margin-bottom: -16px;
    }
  } */
  .status {
    color: #00C288;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    margin-bottom: 4px;
  }
  .date {
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
  }
  .h5TabArrowDown {
    cursor: pointer;
    padding: 10px 0;
  }
`;

export const ArrowCollapseBtn = styled.div`
    padding: 10px 0;
    position: absolute;
    right: 0px;
    cursor: pointer;
    top: 0px;
`;

export const H5Step = styled(Steps)`
  .anchor-step .KuxStep-stepContent{
    margin-bottom: 16px;
  }

  .KuxStep-stepContent{
    margin-bottom: 10px;
  }

  .step-3 .KuxStep-stepContent{
    margin-bottom: 0;
  }

  .KuxStep-tail {
    left: 10px;
    top: 20px;
    height: calc(100% - 20px);
  }

  .KuxStep-tail::after {
    background: none;
    border-right: 1px dashed rgba(243, 243, 243, 0.16);
  }

  .KuxStep-icon {
    width: 20px;
    height: 20px;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    border-radius: 100px;
    background: rgba(140, 140, 140, 0.40);
    box-shadow: 0px 1.918px 10.069px 0px rgba(0, 0, 0, 0.10);
    border: none;
  }

  .KuxStep-title {
    color: ${(props) => props.theme.colors.text60};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%; 
  }

  .KuxStep-content {
    color: ${(props) => props.theme.colors.text40};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
  }

  /* 进行中 */
  .KuxStep-processStep{
    .KuxStep-icon {
      border-radius: 100px;
      background: #00C288;
      box-shadow: 0px 1.918px 10.069px 0px rgba(0, 0, 0, 0.10);
    }

    .KuxStep-title {
      color: #00C288;
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
    }

    .KuxStep-content {
      color: ${(props) => props.theme.colors.text};
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
    }
  }

  .KuxStep-finishStep .KuxStep-icon {
    color: #181818;
  }
`;
export const ModalWrapper = styled.div`
  .label {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  .value {
    padding-left: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  .unit {
    margin-left: 4px;
    color: ${(props) => props.theme.colors.text40};
  }
  .tips-wrapper {
    margin-top: 16px;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(243, 243, 243, 0.04);
    color: rgba(243, 243, 243, 0.60);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    img {
      margin-right: 6px;
    }
  }

`;
export const FooterWrapper = styled.div`
    padding: 16px 32px 32px 32px;
    .KuxButton-root {
      width: calc(50% - 6px);
    }
    .submit-btn {
      background: #F3F3F3;
      margin-left: 12px;
    }
`;
export const CountdownWrapper = styled.div`
  color: ${(props) => props.theme.colors.textEmphasis};
  font-weight: 400;
  font-size: 12px;
  font-size: 11px;
  font-style: normal;
  line-height: 130%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .timeCounter {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    .item {
      display: inline-block;
      min-width: 15px;
      height: 15px;
      padding: 0 2px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      text-align: center;
      background: #1d1d1d;
      border-radius: 2px;
    }

    .split {
      display: inline-block;
      height: 15px;
      margin: 0 2px;
      color: ${(props) => props.theme.colors.icon};
      line-height: 15px;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 3;
  padding: 40px 48px 32px 48px;
  gap: 48px;
  display: flex;
  align-items: center;
  flex-direction: row;

  > div {
    width: 50%;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 32px;
    > div {
      width: 100%;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 20px;
    padding: 25px 15px 20px 15px;
  }
`;

export const LeftWrapper = styled.div`
  border: 1px solid rgba(37, 209, 127, 0.16);
  height: 100%;
  &::before {
    position: relative;
    left: calc(100% - 10px);
    top: 4px;
    display: block;
    width: 6px;
    height: 6px;
    background: url(${sanjiao}) no-repeat;
    background-size: contain;
    content: '';
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  &::after {
    position: relative;
    bottom: 4px;
    left: 4px;
    display: block;
    width: 6px;
    height: 6px;
    background: url(${sanjiao}) no-repeat;
    background-size: contain;
    transform: rotate(180deg);
    content: '';
    [dir='rtl'] & {
      transform: rotateX(180deg);
    }
  }
  .icon-wrapper {
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }
  label {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    line-height: 130%;
    font-size: 16px;

    ${(props) => props.theme.breakpoints.down('lg')} {
      font-size: 14px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 13px;
    }
  }
  .value {
    color: ${(props) => props.theme.colors.text};
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;

    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 16px;
      font-weight: 600;
    }
  }
  .pre-value {
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    white-space: nowrap;
  }
  .text40 {
    color: ${(props) => props.theme.colors.text40};
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    white-space: nowrap;
  }
  .line {
    background: ${(props) => props.theme.colors.divider8};
    height: 1px;
    margin: 32px 0;

    ${(props) => props.theme.breakpoints.down('lg')} {
      margin: 16px 0;
    }
  }
  .textWarpper {
    display: flex;
    align-items: center;
    .leftIcon {
      width: 9px;
      height: 56px;

      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }

    .rightIcon {
      width: 9px;
      height: 56px;
      transform: rotate(180deg);

      [dir='rtl'] & {
        transform: rotate(180deg) rotateY(180deg);
      }
    }

    .textMiddle {
      position: relative;
      z-index: 1;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 56px;
      padding: 0 8px;
      background-color: ${(props) => props.theme.colors.cover2};
      border-top: 1px solid rgba(37, 209, 127, 0.16);
      border-bottom: 1px solid rgba(37, 209, 127, 0.16);

      .mark {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: 8px;
        color: ${(props) => props.theme.colors.textEmphasis};
        font-weight: 500;
        font-size: 16px;
        font-style: normal;
        line-height: 130%;
        .markLogo {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        > span {
          position: relative;
          z-index: 1;
        }
      }

      .dateWrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        color: ${(props) => props.theme.colors.text60};
        font-weight: 500;
        font-size: 18px;
        font-style: normal;
        line-height: 130%;
        .label {
        }
        .value {
          color: ${(props) => props.theme.colors.text};
        }
      }
    }
  }
  .infoWarpper {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    padding: 40px 32px;
    border: 1px solid rgba(37, 209, 127, 0.16);
    border-top: none;

    svg {
      width: 40px;
      height: 40px;
      margin-bottom: 12px;
    }

    .left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .label {
      /* margin-bottom: 6px; */
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 24px;
      font-style: normal;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.down('lg')} {
      gap: 10px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      flex-direction: column;
      padding: 20px 16px;
      .left {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .right {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .label {
        width: 50%;
        margin-right: 6px;
        margin-bottom: 0px;
      }

      .value {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
  .tips {
    color: #fff;
  }
`;

export const LeftContent = styled.div`
  padding: 34px 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: ${(props) => props.showLine? '24px 16px 40px 16px' : '24px 16px'};
  }
`;
export const LabelWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  label {
    width: 50%;
    ${(props) => props.theme.breakpoints.up('sm')} {
      &:last-of-type {
        text-align: right;
      }
    }
  }
  div {
    width: 50%;
    text-align: right;
  }
`;
export const PreValueWrapper = styled.div`
  display: flex;
  width: auto;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  word-break: break-all;
  label {
    width: 50%;
  }
`;
export const ValueWrapper = styled.div`
 align-items: center;
  display: flex;
  gap: 8px;
  div {
    width: 50%;
    &:last-of-type {
      text-align: right;
    }
  }
  label {
    width: 50%;
    text-align: left;
  }
`;
export const RightWrapper = styled.div`
  .history-wrapper {
    color: ${(props) => props.theme.colors.text};
    cursor: pointer;
    text-align: center;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    display: flex;
    align-items: center;
    img {
      margin-right: 4px;
    }
  }
  .formTitle {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 24px;
    font-style: normal;
    line-height: 130%;
  }
  .flex label {
    color: ${(props) => props.theme.colors.text40};
  }

  label {
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
  .value {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    word-wrap: break-word;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .formTitle {
      /* margin-bottom: 16px; */
      font-weight: 500;
      font-size: 18px;
    }
  }
`;
export const HistoryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 20px;
    
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 16px;

  }
`;

export const PlaceholderText = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

export const FormWrapper = styled.div`
  margin-top: 20px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 16px;
  }

  .KuxForm-itemHelp {
    display: none;
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
    }
  }

  .KuxDivider-horizontal {
    margin: 24px 0;
  }
`;

export const AssetsWrapper = styled.div`
  margin-top: 16px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 12px;
  }
`;

export const OperatorWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  > button {
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
`;

export const ButtonWrapper = styled.div`
  margin-top: ${(props) => props.showCountDown? '48px': '20px'};

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: ${(props) => props.showCountDown? '40px': '16px'};
  }

  .KuxButton-root {
    background: ${(props) => props.theme.colors.cover};
    display: flex;
    flex-wrap: wrap;
    &:hover {
      background: ${(props) => props.theme.colors.cover};
    }
  }
  position: relative;
  z-index: 1;
  .tips {
    color: ${(props) => props.theme.colors.complementary};
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 4px;
  }
  .timeCount {
    position: absolute;
    top: -24px;
    left: 0;
    height: 48px;
    padding: 4px 8px;
    background: #d3f475;
    border-radius: 12px 12px 0px 0px;
  }

  button {
    position: relative;
    z-index: 2;
    &.KuxButton-disabled {
      opacity: 0.4;
      background: ${(props) => props.theme.colors.cover};
    }
  }
`;

export const LinkButton = styled(Link)`
  font-weight: 700;
  height: 48px;
  font-size: 16px;
  padding: 0 32px;
  color: #1d1d1d !important;
  background: ${(props) => props.theme.colors.cover};
  opacity: ${(props) => props.disabled? 0.4 : 1};
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 24px;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100%;
  pointer-events: auto;
  position: relative;
  z-index: 2;
  text-align: center;
`;


export const BottomAnchorWrapper = styled.div`
  padding-bottom: 48px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 72px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 30px;
  }
`;

export const AnchorListWrapper = styled.div`
  position: relative;
  border-top: 1px solid rgba(37, 209, 127, 0.16);
  border-bottom: 1px solid rgba(37, 209, 127, 0.16);
  background: ${(props) => props.theme.colors.cover2};
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin: 0 48px;
  padding: 0 24px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    height: 56px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 12px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 12px 16px;
    margin: 0 16px;
  }

  .arrow {
    margin: 0 8px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  a:hover {
    color: ${(props) => props.theme.colors.text};

  }
`;

export const AnchorCard = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  ${(props) => props.theme.breakpoints.up('sm')} {
    justify-content: space-between;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    &:not(:last-child) {
      padding-bottom: 16px;

    }
  }
  .index {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(140, 140, 140, 0.40);
    box-shadow: 0px 1.918px 10.069px 0px rgba(0, 0, 0, 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    color: ${(props) => props.theme.colors.text};
  }
  .event-item {
    position: relative;
    display: none;
    flex: 1;
    gap: 8px;
    align-items: center;
    width: 100%;
    display: flex;
 
    .lineDashed {
      position: absolute;
      top: calc(50% + 10px);
      left: 10px;
      z-index: 3;
      width: 0px;
      height: calc(100% - 4px);

      border-left: 1px dashed ${(props) => props.theme.colors.divider8};
    }
  }
`;

export const AnchorIcon = styled.img`
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

export const AnchorName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 130%;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 12px;
  }

  &:hover  {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const PersonalHardtop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .tips {
    color: #5d5d5d;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 16px;
  }

`;