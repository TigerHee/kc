import { styled, Divider as CusDivider } from '@kux/mui';
import Link from '../../components/Link';
import AnimateDropdown from '../AnimateDropdown';

export const Root = styled.div`
  display: flex;
  align-items: center;
`;

export const Dropdown = styled(AnimateDropdown)`
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  line-height: 22px;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const AvatarBox = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;

  & .KuxAvatar-root {
    border: none;
    background-color: #d9d9d9;
  }
`;

export const UserFlag = styled.div`
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.cover20};
  width: 38px;
  height: 38px;
  border-radius: 32px 32px;
  line-height: 130%;
  text-align: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
  transition: all 0.3s ease;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  ${(props) =>
    props.inTrade && {
      width: '30px',
      height: '30px',
      fontSize: '14px',
    }}
`;

export const OverlayWrapper = styled('div')(
  ({ inDrawer, isLong_language, theme, inTrade }) => `
  width: ${inDrawer ? 'auto' : isLong_language ? '340px' : '320px'};
  padding: ${inDrawer ? '0' : '10px 0'};
  background: ${theme.colors.layer};
  box-shadow: ${inDrawer ? 'none' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
  border-radius: ${inDrawer ? '0px' : '20px'};
  max-height: calc(100vh - 100px);
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  margin-top: ${inDrawer ? '0px' : inTrade ? '8px' : '20px'};
  ${theme.breakpoints.down('xl')} {
    margin-top: ${inDrawer ? '0px' : inTrade ? '8px' : '12px'};
  }

`,
);

export const MenuItem = styled(Link)(
  ({ theme, inDrawer }) => `
  position: relative;
  display: block;
  padding: ${inDrawer ? '17.61px 12px' : '14px 24px 16px 24px'} ;
  cursor: pointer;
  color: ${theme.colors.text};
  text-decoration: none !important;
  font-size: ${inDrawer ? '16px' : '14px'};
  font-weight: 500;
  line-height: 130%;
  position: relative;
  white-space: break-spaces;
  word-break: break-all;
  border-radius: ${inDrawer ? '8px' : 'unset'};
  ${theme.breakpoints.down('sm')} {
    padding: 17.61px 6px
  }
  &:hover {
    background: ${theme.colors.cover2};
    color: ${theme.colors.text};
    & .uid {
      border-color: ${theme.colors.divider};
    }

    & .in {
      border-color: ${theme.colors.divider};
    }
  }
  @keyframes move {
    0% {
      right: 20px;
    }
    100% {
      right: 18px;
    }
  }
  @keyframes move-rtl {
    0% {
      left: 20px;
    }
    100% {
      left: 18px;
    }
  }
  @keyframes changeColor {
    0% {
      fill: #737e8d;
    }
    100% {
      fill: #18bb97;
    }
  }
  & .arrow {
    display: none;
  }
  &:hover .arrow {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    transform-origin: center center;
    animation: move 0.3s linear forwards;
    -webkit-animation: move 0.3s linear forwards;

    & path {
      animation: changeColor 0.3s linear forwards;
      -webkit-animation: changeColor 0.3s linear forwards;
    }

    [dir='rtl'] & {
      right: unset;
      left: 20px;
      transform: rotate(180deg) translateY(50%);
      -webkit-animation: move-rtl 0.3s linear forwards;
      animation: move-rtl 0.3s linear forwards;
    }
  }
  &.center {
    text-align: center;
  }
  & .nameView {
    display: flex;
    align-items: center;
  }
  & .email {
    font-size: ${inDrawer ? '24px' : '20px'};
    line-height: 130%;
    color: ${theme.colors.text};
    margin-right: 8px;
    font-weight: 700;
  }
  & .verify {
    padding: 0px 8px;
    width: auto;
    height: 20px;
    margin: 0 0 0 8px;
    text-align: center;
    border-radius: 2px;
    background: ${theme.colors.secondary};
    font-size: 12px;
    color: ${theme.colors.text40};
  }
  & .in {
  }
  & .no {
    background: rgba(255, 181, 71, 0.12);
    color: ${theme.colors.complementary};
  }
  & .already {
    background: rgba(36, 174, 143, 0.12);
    color: ${theme.colors.primary};
  }
  & .tagView {
    display: flex;
    align-items: center;
    margin-top: 12px;
  }
  & .subAccount {
    font-size: 12px;
    line-height: 1.5;
    color: ${theme.colors.text60};
    margin-right: 8px;
  }
  & .uid {
    display: flex;
    align-items: center;
    width: auto;
    height: auto;
    padding: ${inDrawer ? '6px 12px' : '2px 8px'};
    background: ${theme.colors.cover4};
    border-radius: ${inDrawer ? '20px' : '12px'};
    font-size: ${inDrawer ? '14px' : '12px'};
    line-height: 130%;
    color: ${theme.colors.text40};
    font-weight: 400;
    cursor: pointer;
    ${theme.breakpoints.down('sm')} {
      padding: 6px;
    }
  }
  & .tipsIcon {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${theme.colors.complementary};
    left: 2px;
    [dir='rtl'] & {
      left: unset;
      right: 2px;
    }
  }
  &.alignCenter {
    display: flex;
    align-items: center;
  }
  & .subAccountAuth {
    margin-top: 21px;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;
    color: ${theme.colors.text60};
    & span {
      color: ${theme.colors.primary};
    }
  }
  & .redDot {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${theme.colors.secondary};
    left: ${inDrawer ? '0px' : '8px'};
    top: 50%;
    transform: translate(0, -50%);
    [dir='rtl'] & {
      left: unset;
      right: ${inDrawer ? '0px' : '8px'};
    }
  }
`,
);

export const ServiceManager = styled.div`
  display: flex;
  background: ${(props) => props.theme.colors.cover2};
  flex-direction: row;
  justify-content: space-between;
  margin: 0 24px;
  padding: 16px 14px;
  line-height: 18px;
  border-radius: 4px;
  & .leftText {
    position: relative;
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    opacity: ${(props) => (props.serviceStatus === 'INEFFECTIVE' ? 0.6 : 1)};
    display: block;
    white-space: pre-wrap;
    margin-right: 12px;
  }
  & .rightText {
    color: ${(props) => props.theme.colors.primary};
    font-size: 12px;
    font-weight: 500;
  }
  & .helpIcon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    position: absolute;
    bottom: 0px;
  }
  & .rowItem {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  & .closeWrapper {
    display: flex;
  }
  & .close {
    opacity: 0.6;
    margin-left: 4px;
  }
`;

export const ServiceManagerDes = styled.div`
  background: rgba(255, 181, 71, 0.12);
  border: 1px solid rgba(255, 181, 71, 0.2);
  border-radius: 4px;
  margin: 6px 24px 24px 24px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 16px;
  color: #fba629;
  white-space: pre-wrap;
`;

export const Vip = styled.div`
  padding: ${(props) => (props.inDrawer ? '24px 12px' : '12px 24px')};
  font-size: ${(props) => (props.inDrawer ? '14px' : '12px')};
  color: ${(props) => props.theme.colors.text60};
  position: relative;
  border-radius: ${(props) => (props.inDrawer ? '8px' : 'unset')};
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
    color: ${(props) => props.theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 6px;
  }
`;

export const VipInner = styled(Link)(
  () => `
  display: block;
  text-decoration: none !important;
  @keyframes move {
    0% {
      right: 20px;
    }
    100% {
      right: 18px;
    }
  }
  @keyframes move-rtl {
    0% {
      left: 20px;
    }
    100% {
      left: 18px;
    }
  }
  @keyframes changeColor {
    0% {
      fill: #737e8d;
    }
    100% {
      fill: #18bb97;
    }
  }
  & .arrow {
    display: none;
  }
  &:hover .arrow {
    display: block;
    position: absolute;
    top: 50%;
    transform-origin: center center;
    transform: translateY(-50%);
    right: 20px;
    animation: move 0.3s linear forwards;
    -webkit-animation: move 0.3s linear forwards;
    & path {
      animation: changeColor 0.3s linear forwards;
      -webkit-animation: changeColor 0.3s linear forwards;
    }
    [dir='rtl'] & {
      right: unset;
      left: 20px;
      transform: rotate(180deg) translateY(-50%);
      -webkit-animation: move-rtl 0.3s linear forwards;
      animation: move-rtl 0.3s linear forwards;
    }
  }
`,
);

export const Maker = styled.span`
  line-height: 16px;
  color: ${(props) => props.theme.colors.text40};
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.span`
  flex: 1;
  font-weight: 400;
  font-size: ${(props) => (props.inDrawer ? '14px' : '12px')};
  color: ${(props) => props.theme.colors.text40};
`;

export const NumberSpan = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text};
`;

export const KcsDiscountStatus = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  margin-left: 2px;
  [dir='rtl'] & {
    margin-left: 0;
    margin-right: 2px;
  }
`;

export const KcsDiscount = styled.div`
  color: ${(props) => (props.inDrawer ? props.theme.colors.text40 : props.theme.colors.text)};
  font-size: ${(props) => (props.inDrawer ? '14px' : '12px')};
`;

export const Hr = styled(CusDivider)`
  width: 100%;
  max-width: ${(props) => (props.inDrawer ? '336px' : 'calc(100% - 48px)')};
  margin: ${(props) => (props.inDrawer ? '0 auto' : '0 24px 0')};
  background: ${(props) => props.theme.colors.divider4};
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 368px;
  }
`;

export const Hr0 = styled(Hr)`
  margin: ${(props) => (props.inDrawer ? '0 auto' : '0 24px 12px')};
`;

export const Hr1 = styled(Hr)`
  margin: 12px 0;
`;

export const Hr2 = styled(Hr)`
  margin: 8px auto;
`;

export const Hr3 = styled(Hr)`
  margin: ${(props) => (props.inDrawer ? '24px 0' : '12px 0')};
  width: 100%;
  max-width: unset;
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

export const VipWrapper = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 27px;
    margin-left: 7px;
  }
`;

export const Divider = styled(CusDivider)`
  width: 1px;
  height: 20px;
  background: ${(props) => props.theme.colors.cover8};
  margin: 0 12px;
  [dir='rtl'] & {
    margin: 0 12px;
  }
`;

export const KycLevelDot = styled.span`
  position: absolute;
  top: -6px;
  right: -2px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  img {
    width: 14px;
    height: 14px;
  }
`;

export const KycLevelTag = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px 2px 4px;
  margin-left: 8px;
  font-weight: 500;
  font-size: 12px;
  border-radius: 4px;
  line-height: normal;
  [dir='rtl'] & {
    margin-left: unset;
    margin-right: 8px;
  }
  color: ${({ theme, type }) =>
    type === 'SUCCESS'
      ? theme.colors.primary
      : type === 'ERROR'
      ? theme.colors.secondary
      : type === 'WARN'
      ? theme.colors.complementary
      : theme.colors.text};
  background-color: ${({ theme, type }) =>
    type === 'SUCCESS'
      ? theme.colors.primary12
      : type === 'ERROR'
      ? theme.colors.secondary12
      : type === 'WARN'
      ? theme.colors.complementary12
      : theme.colors.cover12};
  position: relative;
`;

export const KYCStatusIcon = styled.img`
  margin: 1px 5px 1px 1px;
`;

export const KCSWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const KCSLabel = styled.div``;

export const KCSValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme, level }) => {
    switch (level) {
      case 0:
        return theme.colors.text30;
      default:
        return theme.colors.text40;
    }
  }};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;

  img {
    width: 20px;
    height: 20px;
  }
`;
