/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';
import BannerBg from 'static/mining-pool/bannerbg.svg';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
  min-height: 432px;
  padding: 0px 40px 50px 60px;
  border-radius: 12px;
  background-color: rgba(186, 239, 203, 1);
  background-image: url(${BannerBg});
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0px 0px 56px 60px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: 208px;
    padding: 32px 24px 68px 24px;
    border-radius: 0px;
  }
`;

export const InfoWrapper = styled.div`
  max-width: 650px;
  align-self: flex-start;
  z-index: 99;
  [dir='rtl'] & {
    margin-right: 400px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 79.2%;
    [dir='rtl'] & {
      margin-right: 200px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
    [dir='rtl'] & {
      margin-right: 32px;
    }
  }
`;

export const Title = styled.h1`
  margin: 0px;
  color: #000d1d;
  font-size: ${(props) => (props.fontSizeChange ? 48 : 56)}px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0px;
    font-size: 48px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 24px;
  }
`;

export const SubTitle = styled.h2`
  color: #000d1d;
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
`;

export const Description = styled.p`
  display: inline-block;
  max-width: 650px;
  margin-top: ${(props) => (props.hasCountdown ? 0 : 24)}px;
  margin-bottom: 0px;
  color: #1d1d1d;
  font-size: 20px;
  font-weight: 400;
  line-height: 150%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    max-width: 100%%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
    margin-bottom: 16px;
    font-weight: 400;
    font-size: 12px;
  }
`;

export const Image = styled.img`
  position: absolute;
  right: 0px;
  bottom: ${({ showCenter }) => (showCenter ? 'auto' : '0px')};
`;

export const ContentWrapper = styled.section`
  position: absolute;
  left: 9.5%;
  bottom: -51px;
  width: 81%;
  height: 102px;
  padding: 18.5px 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Line = styled.div`
  width: 1px;
  height: 34px;
  background: rgba(29, 29, 29, 0.12);
  margin: 0px 38px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0px 14px;
  }
`;

export const SignWrapper = styled.div`
  flex: 1;
  height: 60px;
  padding-left: 24px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  button {
    z-index: 10;
  }
  .KuxInput-root {
    input {
      z-index: 10;
    }
    fieldset {
      display: none;
    }
  }
  --border-width: 1px;
  --border-radius: 32px;
  --border-color: linear-gradient(90deg, rgba(29, 29, 29, 0.12), #fff);
  [dir='rtl'] & {
    --border-color: linear-gradient(270deg, rgba(29, 29, 29, 0.12), #fff);
    padding-right: 24px;
    padding-left: 0px;
  }
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
    --mask-bg: linear-gradient(#fff, #fff);
    --mask-clip: content-box, padding-box;
  }
`;

export const SignH5 = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -68px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  button {
    margin-top: 16px;
  }
`;

export const TopImage = styled.img`
  position: absolute;
  top: 0px;
  right: 0px;
`;

export const BottomImage = styled.img`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;
