/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';
import LottieProvider from 'src/components/LottieProvider';

export const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column-reverse;
  }
`;

export const ShareWrapper = styled.div`
  width: ${({ isEn }) => (isEn ? 'calc(50% - 38px)' : 'auto')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    margin-top: 24px;
  }
`;

export const Line = styled.div`
  width: 1px;
  height: 60px;
  background: rgba(243, 243, 243, 0.12);
  margin: 0px 38px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: none;
  }
`;

export const SignWrapper = styled.div`
  flex: 1;
  width: ${({ isEn }) => (isEn ? 'calc(50% - 38px)' : 'auto')};
  height: 60px;
  padding-left: 24px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  [dir='rtl'] & {
    --border-color: linear-gradient(270deg, rgba(243, 243, 243, 0.12), #121212);
    padding-right: 0px;
    padding-left: 24px;
    img {
      transform: rotateZ(180deg);
    }
  }
  div {
    z-index: 10;
  }
  .KuxTextArea-container {
    padding: 0px 8px;
    textarea {
      z-index: 10;
      color: #fff;
    }
    textarea::placeholder {
      color: rgba(243, 243, 243, 0.6);
    }
    fieldset {
      display: none;
    }
  }
  --border-width: 1px;
  --border-radius: 32px;
  --border-color: linear-gradient(90deg, rgba(243, 243, 243, 0.12), #121212);
  background: transparent;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    height: 100%;
    padding: var(--border-width);
    background: var(--border-color);
    border-radius: var(--border-radius);
    content: '';
    -webkit-mask-image: var(--mask-bg), var(--mask-bg);
    -webkit-mask-clip: var(--mask-clip);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    [dir='rtl'] & {
      width: 100%;
    }
    --mask-bg: linear-gradient(#121212, #121212);
    --mask-clip: content-box, padding-box;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
`;

export const SignH5 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  [dir='rtl'] & {
    img {
      transform: rotateZ(180deg);
    }
  }
  .KuxTextArea-container {
    border: 1px solid rgba(243, 243, 243, 0.08);
    textarea {
      color: #fff;
    }
    textarea::placeholder {
      color: rgba(243, 243, 243, 0.6);
    }
    fieldset {
      display: none;
    }
  }
`;

export const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 46px;
  background: #01bc8d;
  padding: 9px 24px;
  height: 48px;
  cursor: pointer;
  span {
    margin: 0px 4px;
    color: #121212;
    font-weight: 700;
    font-size: 16px;
    line-height: 130%;
    text-wrap: nowrap;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;

export const LoadingLogo = styled(LottieProvider)`
  width: 24px;
  height: 26px;
  margin-right: 4px;
`;
