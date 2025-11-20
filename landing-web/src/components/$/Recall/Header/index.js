/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import useTheme from '@kufox/mui/hooks/useTheme';
import backLightIcon from 'assets/recall/arrow_left_light.svg';
import backDarkIcon from 'assets/recall/arrow_left_dark.svg';
import langIcon from 'assets/recall/lang.svg';
import doubtIcon from 'assets/recall/doubt.svg';
import { _t } from 'utils/lang';
import RestrictNotice from 'src/components/common/RestrictNotice';
import InfoDialog from './InfoDialog';
import LangSelectDialog from 'components/common/LangSelectDialog';
import { kcsensorsClick } from 'src/utils/ga';
import { useSelector } from 'dva';
import SiteRedirect from 'src/components/common/SiteRedirect';


const RestrictNoticeWrapper = styled.div`
  background: #fff;
`;

const HeaderContentWrapper = styled.section`
  width: 100%;
  position: fixed;
  z-index: 999;
  left: 0;
  top: ${({ isInApp, bannerHeight }) => (isInApp ? px2rem(44) : !bannerHeight ? px2rem(10) : 0)};
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: ${px2rem(44)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  width: ${px2rem(85)};
`;

const Back = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  padding-left: ${px2rem(12)};
  box-sizing: content-box;
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  margin-bottom: 0;
  font-weight: 600;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(26)};
  // ux要求写死
  color: #ffffff;
  text-shadow: 0 ${px2rem(1.5)} 0 rgba(0, 0, 0, 0.5);
`;

const Right = styled.div`
  width: ${px2rem(85)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const IconBox = styled.div`
  border-radius: ${px2rem(8)};
  // ux要求写死
  background: rgba(0, 20, 42, 0.2);
  & + div {
    margin-left: ${px2rem(6)};
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    padding-right: ${px2rem(10)};
  }
  visibility: ${props => (props.isInApp ? 'hidden' : 'visible')};
`;
const IconInner = styled.img`
  width: ${px2rem(18)};
  height: ${px2rem(18)};
  padding: ${px2rem(6)};
  box-sizing: content-box;
`;

const RecallHeader = ({ handleClose, bannerHeight }) => {
  const { currentTheme } = useTheme();
  const { isInApp } = useSelector(state => state.app);
  const [infoVisible, setInfoVisible] = useState(false);
  const [langSelectVisible, setLangSelectVisible] = useState(false);

  const handleInfoOpen = () => {
    setInfoVisible(true);
    try {
      kcsensorsClick(['rule', '1']);
    } catch (e) {
      console.log('e', e);
    }
  };

  const handleLangOpen = () => {
    setLangSelectVisible(true);
    try {
      kcsensorsClick(['language', '1']);
    } catch (e) {
      console.log('e', e);
    }
  };

  return (
    <HeaderContentWrapper isInApp={isInApp} bannerHeight={bannerHeight}>
      <RestrictNoticeWrapper id="land-recall-act-page">
        <RestrictNotice />
      </RestrictNoticeWrapper>
      <HeaderWrapper isInApp={isInApp}>
        <Left>
          <Back src={currentTheme === 'light' ? backLightIcon : backDarkIcon} onClick={handleClose} />
        </Left>
        <Title>{_t('nRW8WUghCQ2nmJKcc9Bcfh')}</Title>
        <Right>
          <IconBox isInApp={isInApp}>
            <IconInner src={langIcon} onClick={handleLangOpen} />
          </IconBox>
          <IconBox>
            <IconInner src={doubtIcon} onClick={handleInfoOpen} />
          </IconBox>
        </Right>
        <InfoDialog visible={infoVisible} onClose={() => setInfoVisible(false)} />
        <LangSelectDialog visible={langSelectVisible} onClose={() => setLangSelectVisible(false)} />
      </HeaderWrapper>
      <SiteRedirect />
    </HeaderContentWrapper>
  );
};

export default RecallHeader;
