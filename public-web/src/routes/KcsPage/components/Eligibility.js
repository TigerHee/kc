/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import E1ICON from 'static/kcs-intro/e1.svg';
import { default as E3ICON } from 'static/kcs-intro/e3.svg';
import { default as E4ICON } from 'static/kcs-intro/e4.svg';
import sensors from 'tools/ext/kc-sensors';
import { addLangToPath, _t } from 'tools/i18n';
import HOST from 'utils/siteConfig';
import { levelConfigMap } from '../config';
import { callJump } from '../utils';

const { MAINSITE_HOST, POOLX_HOST, M_POOLX_HOST } = HOST;

const isInApp = JsBridge.isApp();

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  padding-top: 100px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 64px 24px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 32px 16px 0px;
  }
`;
const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 36px;
  font-weight: 600;
  line-height: 130%;
  width: 100%;
  text-align: center;
  margin-bottom: 32px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 32px;
    font-size: 18px;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 24px;
`;
const Item = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  // gap: 16px;
  align-self: stretch;
  cursor: pointer;
  // transition: 0.3s;
  .bizIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    min-width: 56px;
    height: 56px;
    min-height: 56px;
    margin-right: 24px;
    background: ${({ theme }) => theme.colors.cover8};
    border-radius: 12px;
  }
  .title {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
  }
  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
  }
  .leftCon {
    display: flex;
    align-items: center;
    max-width: 952px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      max-width: 456px;
    }
  }
  .rightCon {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    cursor: pointer;
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.text20};
    .rightCon {
      color: ${({ theme, currentLevel }) =>
        levelConfigMap[currentLevel]?.hoverColor || theme.colors.primary};
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    .bizIcon {
      margin-right: 0;
      margin-bottom: 24px;
    }
    .leftCon {
      flex-direction: column;
      align-items: center;
    }
    .rightCon {
      margin-top: 32px;
      font-size: 14px;
    }
    .title {
      font-weight: 600;
      font-size: 16px;
    }
    p,
    .title {
      text-align: center;
    }
  }
`;
const list = [
  {
    icon: E1ICON,
    title: _t('c2617870ee754000a14e'),
    desc: _t('59b8f1bd903d4000ae76'),
    sensorsName: 'kcschain',
    onClick: () => {
      const url = 'https://staking.kcc.io/';
      callJump(
        {
          url,
        },
        url,
      );
    },
    url: 'https://staking.kcc.io/',
  },
  // {
  //   icon: E2ICON,
  //   title: 'Spotlight',
  //   desc: _t('3c1da3615aa24000a6fb'),
  //   sensorsName: 'spotlight',
  //   onClick: () => {
  //     const url = `${MAINSITE_HOST}/spotlight-center`;
  //     callJump(
  //       {
  //         url: addLangToPath(url),
  //       },
  //       url,
  //     );
  //   },
  //   url: '/spotlight-center',
  // },
  {
    icon: E3ICON,
    title: 'BurningDrop',
    sensorsName: 'burningdrop',
    bizType: 'LOCKDROP',
    desc: _t('66edabe123dc4000a03d'),
    onClick: () => {
      callJump(
        {
          url: addLangToPath(`${M_POOLX_HOST}/lockDrop?isBanner=1&appNeedLang=true&loading=2`),
        },
        `${POOLX_HOST}/x-lockdrop`,
      );
    },
    url: '/earn/x-lockdrop',
  },
  {
    icon: E4ICON,
    title: _t('3ad4748e22bf4000a479'),
    sensorsName: 'gemvote',
    desc: _t('2b636c30d3674000a202'),
    onClick: () => {
      const url = `${MAINSITE_HOST}/gemvote`;
      callJump(
        {
          url: addLangToPath(url),
        },
        url,
      );
    },
    url: '/gemvote',
  },
];
const Eligibility = ({ currentLevel }) => {
  const { theme } = useTheme();
  const toView = (onClick, sensorsName) => {
    sensors.trackClick([`${sensorsName}`, `1`]);
    onClick();
  };
  return (
    <Wrapper data-inspector="kcs_eligibility">
      <Title>
        <div>{_t('4b30c257c4bd4000abf5')}</div>
      </Title>
      <Content>
        {list
          .filter(({ bizType }) => (bizType ? tenantConfig.kcsPageConfig.bizTypes[bizType] : true))
          .map((i, index) => {
            const { title, desc, icon, url, sensorsName, onClick } = i || {};
            return (
              <Item
                key={index}
                currentLevel={currentLevel}
                onClick={() => toView(onClick, sensorsName)}
              >
                <div className="leftCon">
                  <div className="bizIcon">
                    <img src={icon} alt="icon" />
                  </div>
                  <div>
                    <div className="title"> {title || '--'}</div>
                    <p>{desc || '--'}</p>
                  </div>
                </div>
                <Link dontGoWithHref href={url} className="rightCon">
                  {_t('agXGsQUJwvRgLaFTEkSHXg')}
                  <ICArrowRight2Outlined
                    className="ml-4 kcs-arrow"
                    size={16}
                    color={theme?.colors?.primary}
                  />
                </Link>
              </Item>
            );
          })}
      </Content>
    </Wrapper>
  );
};

export default Eligibility;
