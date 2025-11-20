/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Button, Box } from '@kufox/mui';
import siteConfig from 'utils/siteConfig';
import { useLocale } from '@kucoin-base/i18n';
import Advantage from 'components/JoinUs/Advantage';
import Welfare from 'components/JoinUs/Welfare';
import Process from 'components/JoinUs/Process';
import { push } from 'utils/router';
import banner_h5 from 'static/join-us/banner_h5.png';
import banner from 'static/join-us/banner.png';
import { _t, addLangToPath } from 'src/tools/i18n';
import { TipDialog, useTipDialogStore } from 'components/JoinUs/TipDialog';
import { useMediaQuery } from '@kux/mui';
import getIsInApp from 'utils/runInApp';
import { trackClick, saTrackForBiz } from 'utils/ga';

const { LANDING_HOST } = siteConfig;

const Banner = styled.div((props) => {
  return {
    width: '100%',
    height: px2rem(400),
    background: `url(${banner}) no-repeat center`,
    backgroundSize: 'cover',
    [props.theme.breakpoints.down('md')]: {
      height: px2rem(450),
      background: `url(${banner_h5}) no-repeat center`,
      backgroundSize: 'cover',
    },
  };
});

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

const Title = styled.h1((props) => {
  return {
    flexWrap: 'wrap',
    textAlign: 'center',
    fontWeight: 500,
    color: '#fff',
    width: px2rem(700),
    fontSize: px2rem(40),
    lineHeight: px2rem(48),
    [props.theme.breakpoints.down('md')]: {
      width: '80%',
      fontSize: px2rem(30),
      lineHeight: px2rem(36),
      margin: 'auto',
    },
  };
});

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

const Link = styled.li`
  list-style: none;
  line-height: ${px2rem(50)};
  font-size: ${px2rem(16)};
  &:not(:first-child) {
    margin-left: ${px2rem(66)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(14)};
    &:not(:first-child) {
      margin-left: 0;
    }
  }
`;

const Url = styled.a`
  display: block;
  position: relative;
  height: 100%;
  line-height: ${px2rem(50)};
  text-decoration: none;
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

const Page = styled.div`
  background: #fff;
  min-height: 80vh;
  * {
    font-family: Roboto !important;
  }
  a[type='button'] {
    &:hover {
      color: #fff;
    }
  }
`;

const linkStyle = { textDecoration: 'none' };

export default () => {
  const { currentLang } = useLocale();
  const { openDialog: openTipDialog } = useTipDialogStore();

  const showLang = currentLang === 'zh_CN' ? 'zh_CN' : 'en_US';
  const openUrl = useCallback((e, url) => {
    e.preventDefault();
    const newWindow = window.open(addLangToPath(url));
    newWindow.opener = null;
  }, []);
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isInApp = getIsInApp();
  const clickJoinUs = (e) => {
    e?.preventDefault();
    /** 点击埋点 */
    trackClick(['JobOpenings', '1']);
    /** 打开三方跳转提醒弹窗 */
    openTipDialog();
  };

  /** 曝光埋点 */
  useEffect(() => {
    saTrackForBiz({}, ['B1JoinUs', '1'], {});
  }, []);

  return (
    <Page data-inspector="careers_page">
      <Banner>
        <Links>
          <Link>
            <Url
              href={addLangToPath('/about-us')}
              onClick={(e) => {
                e?.preventDefault();
                push('/about-us');
              }}
            >
              {_t('aboutus.about')}
            </Url>
          </Link>
          <Link>
            <Url active>{_t('application.joinus')}</Url>
          </Link>
          <Link>
            <Url
              style={linkStyle}
              href={addLangToPath(`${LANDING_HOST}/community-collect`)}
              onClick={(e) => {
                openUrl(e, `${LANDING_HOST}/community-collect`);
              }}
            >
              {_t('aboutus.community')}
            </Url>
          </Link>
          <Link>
            <Url
              style={linkStyle}
              href={addLangToPath('/news/en-kucoin-media-kit')}
              onClick={(e) => {
                openUrl(e, `/news/en-kucoin-media-kit`);
              }}
            >
              {_t('aboutus.press')}
            </Url>
          </Link>
        </Links>
        <Text>
          <Title>{_t('application.joinus.tips')}</Title>
        </Text>
        <Box display="flex" justifyContent="center" mt={px2rem(54)}>
          <Button
            size="large"
            data-inspector="JoinUsBtn"
            onClick={(e) => {
              clickJoinUs(e);
            }}
          >
            {_t('application.joinus.lookforjob')}
          </Button>
        </Box>
      </Banner>
      <Advantage />
      <Welfare />
      <Process />
      <TipDialog isSm={isInApp || isSm} />
    </Page>
  );
};
