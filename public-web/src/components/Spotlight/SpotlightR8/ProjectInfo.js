/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import ball from 'static/spotlight8/ball.svg';
import ballLight from 'static/spotlight8/ballLight.svg';
import { ReactComponent as CoingeckoLogo } from 'static/spotlight8/coingecko.svg';
import { ReactComponent as DiscordLogo } from 'static/spotlight8/discord.svg';
import { ReactComponent as GithubLogo } from 'static/spotlight8/github.svg';
import { ReactComponent as HomeLinkLogo } from 'static/spotlight8/homeLink.svg';
import { ReactComponent as InstagramLogo } from 'static/spotlight8/instagram.svg';
import { ReactComponent as LinkedinLogo } from 'static/spotlight8/linkedin.svg';
import { ReactComponent as MLogo } from 'static/spotlight8/m.svg';
import { ReactComponent as MediumLogo } from 'static/spotlight8/medium.svg';
import { ReactComponent as RedditLogo } from 'static/spotlight8/reddit.svg';
import { ReactComponent as TelegramLogo } from 'static/spotlight8/telegram.svg';
import { ReactComponent as TwitterLogo } from 'static/spotlight8/twitter.svg';
import { ReactComponent as VkLogo } from 'static/spotlight8/vk.svg';
import { ReactComponent as YoutubeLogo } from 'static/spotlight8/youtube.svg';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import AnchorPlaceholder from 'TradeActivityCommon/AnchorPlaceholder';
import Title from './Title';

const medias = {
  home: <HomeLinkLogo />,
  twitter: <TwitterLogo />,
  telegram: <TelegramLogo />,
  youtube: <YoutubeLogo />,
  reddit: <RedditLogo />,
  github: <GithubLogo />,
  linkin: <LinkedinLogo />,
  instagram: <InstagramLogo />,
  coinmarket: <MLogo />,
  coingecko: <CoingeckoLogo />,
  discord: <DiscordLogo />,
  vk: <VkLogo />,
  medium: <MediumLogo />,
};

const Wrapper = styled.section`
  position: relative;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const ProjectContent = styled.div`
  margin-top: 20px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const ProjectName = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  > span {
    display: inline-block;
  }

  .fullName {
    margin-left: 8px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    .fullName {
      margin-left: 6px;
      font-size: 13px;
    }
  }
`;

const ProjectMedia = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
  color: ${(props) => props.theme.colors.text};

  .logo {
    margin-top: 20px;
    margin-right: 20px;
    cursor: pointer;
  }
  img {
    width: 28px;
    height: 28px;
  }
`;

const ProjectInfo = () => {
  const {
    tokenName: currencyFullName,
    token: currencyShortName,
    descriptionModule,
    mediaModule = [],
  } = useSelector((state) => state.spotlight8.detailInfo, shallowEqual);
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  if (!descriptionModule) return null;
  return (
    <Wrapper>
      <AnchorPlaceholder id="projectInfo" />
      <Title
        title={_t('wh96h6VC3WRWu8PX4xyenC')}
        icon={currentTheme === 'dark' ? ball : ballLight}
      />
      <ProjectName>
        <span>{currencyFullName}</span>
        <span className="fullName">{currencyShortName}</span>
      </ProjectName>

      <ProjectContent>{descriptionModule}</ProjectContent>
      {mediaModule?.length ? (
        <ProjectMedia>
          {map(mediaModule, ({ title, content }) => {
            const icon = medias[(title || '').toLowerCase()];
            if (icon) {
              return (
                <span key={title} className="logo" onClick={() => locateToUrl(content)}>
                  {icon}
                </span>
              );
            }
          })}
        </ProjectMedia>
      ) : null}
    </Wrapper>
  );
};

export default ProjectInfo;
