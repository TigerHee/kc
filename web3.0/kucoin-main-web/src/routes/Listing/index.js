/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { get } from 'lodash';
import { Button } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import siteConfig from 'utils/siteConfig';
import { push } from 'utils/router';
import { _t, _tHTML } from 'tools/i18n';
import { Wrapper } from './common/StyledComps';
import bannerImg from 'static/listing/banner.png';

const { ASSET_HUB_HOST } = siteConfig;

const Inner = styled.div`
  padding: 75px 0 132px 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 45px 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 40px 0;
  }
`;

const Banner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
  }
`;

const BannerContent = styled.div`
  width: 60%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 62%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const BannerImg = styled.img`
  width: 40%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 38%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
    width: 215px;
    margin: 12px auto 0;
  }
`;

const BannerTitle = styled.h1`
  font-weight: 600;
  font-size: 48px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0;
  padding: 0 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 36px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 24px;
  }
`;

const BannerInfo = styled.div`
  margin-top: 24px;
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 13, 29, 0.68);
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 20px;
  }
`;

const BannerTip = styled.div`
  margin-top: 12px;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  a {
    color: #01bc8d;
    text-decoration: underline;
  }
`;

const BtnGroup = styled.div`
  max-width: 1200px;
  margin: 60px auto 0 auto;
  display: flex;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: block;
    margin-top: 40px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 30px;
  }
`;

const ButtonStyle = styled(Button)`
  display: block;
  min-width: 250px;
  border-radius: 6px;
  font-weight: 500;
  :last-child {
    margin-left: ${(props) => (props.show ? '12px' : '')};
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    :last-child {
      margin-top: ${(props) => (props.show ? '14px' : '')};
      margin-left: 0;
    }
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 100%;
  }
`;

const InfoWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.cover2};
  padding: 0 24px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 16px;
  }
`;

const Info = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 46px 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 30px 0;
  }
`;

const InfoTitle = styled.div`
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text68};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`;

const InfoList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: block;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 26px;
  }
`;

const InfoItem = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  position: relative;
  transform: translateX(15px);
  ::before {
    position: absolute;
    top: 50%;
    left: -15px;
    display: block;
    width: 6px;
    height: 6px;
    background: #01bc8d;
    border-radius: 50%;
    transform: translateY(-50%);
    content: ' ';
  }
  a {
    color: #01bc8d;
    text-decoration: underline;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 12px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-weight: 400;
    font-size: 14px;
  }
`;

function Listing() {
  const { isLogin } = useSelector((state) => state.user);
  const { detail } = useSelector((state) => state.listing);
  const loading = useSelector((state) => state.loading.effects['listing/getSummary']);

  const { sm, md, lg } = useResponsive();
  const isPc = sm && md && lg;
  const status = get(detail, 'status');
  const hideApplyBtn = status === 2;
  const disableAppltBtn = status === 1 || status === 3;

  const handleApply = () => {
    if (disableAppltBtn) return;
    if (isLogin) {
      push('/listing/apply');
    } else {
      push(`/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`);
    }
  };

  const handleGo = () => {
    const newWindow = window.open(ASSET_HUB_HOST);
    newWindow.opener = null;
  };

  const renderBtn = (val) => {
    return val ? (
      <BtnGroup>
        {!hideApplyBtn && (
          <ButtonStyle
            size="large"
            loading={loading}
            disabled={disableAppltBtn}
            onClick={handleApply}
          >
            {disableAppltBtn ? _t('nBeDvjGFU7ymnYMsKujSMC') : _t('swRZe3pKna7JX5vTrMRxFq')}
          </ButtonStyle>
        )}
        <ButtonStyle show={!hideApplyBtn} variant="outlined" size="large" onClick={handleGo}>
          {_t('kDtbkHHjNXMGgYrVvwxt65')}
        </ButtonStyle>
      </BtnGroup>
    ) : null;
  };

  return (
    <div data-inspector="ListingPage">
      <Wrapper>
        <Inner>
          <Banner>
            <BannerContent>
              <BannerTitle>{_t('4MBwjzyH3wrRbaHjhyTLmE')}</BannerTitle>
              <BannerInfo>{_tHTML('bfRK92yP14PuboHpYrkYgD')}</BannerInfo>
              {/* <BannerTip>
              如有疑问可咨询KuCoin线上客服
              <a href="Official.kucoin.com" target="_blank" rel="noopener noreferrer">
                Official.kucoin.com
              </a>
            </BannerTip> */}
              {renderBtn(isPc)}
            </BannerContent>
            <BannerImg src={bannerImg} alt="" />
          </Banner>
          {renderBtn(!isPc)}
        </Inner>
      </Wrapper>
      {/* <InfoWrapper>
        <Info>
          <InfoTitle>申请时您需要提供如下文件，可以提前准备以免影响您的申请进度</InfoTitle>
          <InfoList>
            <InfoItem>
              KuCoin Non-Disclosure Agreement{' '}
              <a href="Official.kucoin.com" target="_blank" rel="noopener noreferrer">
                [点击下载模板]
              </a>
            </InfoItem>
            <InfoItem>The Legal Opinion Documents</InfoItem>
            <InfoItem>One Sentence Pitch for Your Project</InfoItem>
          </InfoList>
        </Info>
      </InfoWrapper> */}
    </div>
  );
}

export default Listing;
