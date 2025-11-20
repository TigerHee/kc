/**
 * Owner: Lena@kupotech.com
 */
import { styled } from '@kux/mui';
import { map } from 'lodash-es';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import DrivinglicenseImg from 'static/account/kyc/lego/drivinglicense.svg';
import IdcardImg from 'static/account/kyc/lego/idcard.svg';
import PassportImg from 'static/account/kyc/lego/passport.svg';
import Btn from '../Button';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Img = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  width: 100%;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;
const Tips = styled.div``;
const Title = styled.h3`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-weight: 600;
    font-size: 20px;
  }
`;
const TipsItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  margin-bottom: 8px;
  margin-left: 18px;
  position: relative;
  color: ${(props) => props.theme.colors.text60};
  &::before {
    position: absolute;
    top: 6px;
    left: -18px;
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #d9d9d9;
    border-radius: 50%;
    content: '';
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
`;

const ImgMap = {
  passport: { normal: PassportImg, sm: PassportImg },
  idcard: { normal: IdcardImg, sm: IdcardImg },
  drivinglicense: {
    normal: DrivinglicenseImg,
    sm: DrivinglicenseImg,
  },
};

const Allow = ({ handleAllow, isH5, ...otherProps }) => {
  const { identityType } = useSelector((state) => state.kyc.kycInfo || {});

  const TitleMap = {
    idcard: _t('7sphxTQpto6E68iFGHDEKS'),
    passport: _t('9CFUGPxCEb8EqiykXn7dRe'),
    drivinglicense: _t('vYoR7UxZXcRK4PhAP4enDN'),
  };
  const list = [
    _t('as8mZpYyTnQ694UJjA8ezj'),
    _t('vG9Ktsepaz2mdGqxGrpdiC'),
    _t('2gQXi6RhQ67CJkuVjo3cCr'),
  ];

  const BgImg = useMemo(() => {
    if (identityType) {
      const img = ImgMap[identityType] || ImgMap['idcard'];
      return isH5 ? img['sm'] : img['normal'];
    }
  }, [isH5, identityType]);

  return (
    <Wrapper>
      <ContentWrapper>
        <Img src={BgImg} alt="bg-image" />
        <Tips>
          <Title>{TitleMap[identityType]}</Title>
          {map(list, (item) => {
            return <TipsItem key={item}>{item}</TipsItem>;
          })}
        </Tips>
      </ContentWrapper>

      <Btn {...otherProps} btnText={_t('1uQj2nEFstsPBLTJqNQRV9')} onClick={handleAllow} />
    </Wrapper>
  );
};
export default Allow;
