/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import banner_01 from 'static/account/overview/banner_01.png';
import banner_01_dark from 'static/account/overview/banner_01_dark.png';
import banner_02 from 'static/account/overview/banner_02.png';
import banner_02_dark from 'static/account/overview/banner_02_dark.png';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const SlickSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 5000,
  autoplay: true,
  arrows: false,
};
const BannerWrapper = styled.div`
  margin-bottom: 28px;
  position: relative;
`;

const ItemInner = styled.div`
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.cover2};
  padding: 0 32px;
  height: 180px;
  transition: all 0.3s ease;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    padding: 0 24px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    height: unset;
    padding: 32px 32px 28px 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 20px;
  }
  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 130%;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text};
  max-height: 46px;
  overflow: hidden;
  direction: ltr;
`;
const Desc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text40};
  margin-bottom: 9px;
  max-height: 39px;
  overflow: hidden;
  direction: ltr;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    max-height: 19px;
  }
`;
const Link = styled.a`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;

const LinkIcon = styled(ICArrowRight2Outlined)`
  margin-left: 8px;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const ItemLeft = styled.div`
  flex: 1;
  text-align: left;
`;
const ItemRight = styled.div`
  margin-left: 19px;
  position: relative;
  top: -10px;
`;
const BannerImg = styled.img`
  width: 84px;
  height: 84px;
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  [dir='rtl'] & {
    flex-direction: row-reverse;
  }
`;
const Dot = styled.div`
  width: 8px;
  height: 4px;
  border-radius: 20px;
  margin-right: 4px;
  background-color: ${({ theme, active }) => (active ? theme.colors.text40 : theme.colors.cover12)};
  cursor: pointer;
`;

const OverviewBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const sliderRef = useRef(null);
  const { isRTL } = useLocale();
  const theme = useTheme();
  const list = [
    {
      key: 1,
      title: _t('so4M3xpPAfWsDxzazRnmPR'),
      desc: _t('xb3u8jYjwFamAVHTRDndLG'),
      linkText: _t('giaB79mDK2BjMVQ431AuYd'),
      linkUrl: '/referral',
      locationId: 'InviteFriends',
      banner: theme.currentTheme === 'light' ? banner_01 : banner_01_dark,
    },
    {
      key: 2,
      title: _t('3cYoNJJdVRCNjrjKijkQMh'),
      desc: _t('hfcdE2N83dM6QpY1UAqm9q'),
      linkText: _t('rTpJNEwUyCtHK7d9pBgZ8N'),
      linkUrl: '/affiliate',
      locationId: 'Afflilate',
      banner: theme.currentTheme === 'light' ? banner_02 : banner_02_dark,
    },
  ];
  return !isSub && list?.length ? (
    <BannerWrapper data-inspector="account_overview_banner">
      <Slider
        {...SlickSettings}
        rtl={isRTL}
        afterChange={(index) => setActiveIndex(index)}
        ref={sliderRef}
      >
        {list.map((item) => (
          <div key={item.key}>
            <ItemInner>
              <ItemLeft>
                <Title>{item.title}</Title>
                <Desc>{item.desc}</Desc>
                <Link
                  href={addLangToPath(item.linkUrl)}
                  target="_blank"
                  onClick={() => trackClick(['Advertise', item.locationId])}
                >
                  {item.linkText}
                  <LinkIcon />
                </Link>
                <Dots>
                  {list.map((item, index) => (
                    <Dot
                      key={item.key}
                      active={activeIndex === index}
                      onClick={() => sliderRef?.current?.slickGoTo?.(index)}
                    />
                  ))}
                </Dots>
              </ItemLeft>
              <ItemRight>
                <BannerImg src={item.banner} />
              </ItemRight>
            </ItemInner>
          </div>
        ))}
      </Slider>
    </BannerWrapper>
  ) : null;
};
export default OverviewBanner;
