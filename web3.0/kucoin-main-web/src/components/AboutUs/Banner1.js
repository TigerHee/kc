/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import siteConfig from 'utils/siteConfig';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Link } from 'components/Router';
import banner from 'static/about-us/banner1_bg.png';
import { tenantConfig } from 'config/tenant';

const { LANDING_HOST } = siteConfig;

const LayoutBox = styled.div`
  padding: 0 ${px2rem(24)};

  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(12)};
  }
`;

const Banner = styled.div`
  min-height: ${px2rem(400)};
  max-width: 100%;
  overflow: hidden;
  background: url(${banner}) no-repeat center;
  background-size: cover;
`;

const Text = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  margin-top: ${px2rem(68)};

  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(86)};
  }
`;

const Title = styled.div`
  font-size: ${px2rem(40)};
  line-height: ${px2rem(48)};
  text-align: center;
  font-weight: 500;
  color: #fff;

  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(30)};
    line-height: ${px2rem(36)};
  }
`;

const Links = styled.ul`
  display: flex;
  height: ${px2rem(50)};
  background: rgba(0, 10, 30, 0.3);
  justify-content: center;
  padding: 0 ${px2rem(24)};

  ${(props) => props.theme.breakpoints.down('md')} {
    justify-content: space-between;
    padding: 0 ${px2rem(12)};
  }
`;

const LinkLi = styled.li`
  list-style: none;
  line-height: ${px2rem(50)};
  font-size: ${px2rem(16)};

  &:not(:first-of-type) {
    margin-left: ${px2rem(66)};
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(14)};

    &:not(:first-of-type) {
      margin-left: ${px2rem(0)};
    }
  }
`;

const Url = styled(Link)`
  display: block;
  position: relative;
  height: 100%;
  line-height: ${px2rem(50)};
  color: ${(props) => (props.active ? props.theme.colors.primary : 'rgba(255,255,255, 0.6)')};

  &::after {
    position: absolute;
    bottom: 0;
    left: ${px2rem(7)};
    display: ${(props) => (props.active ? 'block' : 'none')};
    width: calc(100% - ${px2rem(14)});
    height: ${px2rem(4)};
    background-color: ${(props) => props.theme.colors.primary};
    content: '';
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary};

    &::after {
      display: block;
    }
  }
`;

const Intro = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  text-align: center;
  width: 100%;
  margin-top: ${px2rem(10)};
  font-size: ${px2rem(14)};
  line-height: ${px2rem(21)};

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 80%;
    margin: ${px2rem(24)} auto 0 auto;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(18)};
  }
`;

const Banner1 = () => {
  return (
    <Banner data-inspector="about_us_banner">
      {tenantConfig.aboutUs.showGlobalBannerLinks ? (
        <Links>
          <LinkLi>
            <Url to="/about-us" active>
              {_t('aboutus.about')}
            </Url>
          </LinkLi>
          <LinkLi>
            <Url to="/careers">{_t('application.joinus')}</Url>
          </LinkLi>
          <LinkLi>
            <Url to={addLangToPath(`${LANDING_HOST}/community-collect`)}>
              {_t('aboutus.community')}
            </Url>
          </LinkLi>
          <LinkLi>
            <Url to={addLangToPath(`/news/en-kucoin-media-kit`)}>{_t('aboutus.press')}</Url>
          </LinkLi>
        </Links>
      ) : null}
      <LayoutBox>
        <Text>
          <Title>{_tHTML('aboutus.title')}</Title>
        </Text>
        <Intro>{_tHTML('aboutus.title.intro')}</Intro>
      </LayoutBox>
    </Banner>
  );
};

export default Banner1;
