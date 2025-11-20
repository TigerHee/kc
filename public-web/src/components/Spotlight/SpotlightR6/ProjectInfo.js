/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import ball from 'static/spotlight6/ball.svg';
import coingecko from 'static/spotlight6/coingek.svg';
import discord from 'static/spotlight6/discord.svg';
import github from 'static/spotlight6/github.svg';
import homeLink from 'static/spotlight6/homeLink.svg';
import instagram from 'static/spotlight6/instagram.svg';
import linkedin from 'static/spotlight6/linkedin.svg';
import m from 'static/spotlight6/m.svg';
import medium from 'static/spotlight6/medium.svg';
import reddit from 'static/spotlight6/reddit.svg';
import telegram from 'static/spotlight6/telegram.svg';
import twitter from 'static/spotlight6/twitter.svg';
import vk from 'static/spotlight6/vk.svg';
import youtube from 'static/spotlight6/youtube.svg';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import Title from './Title';
import TokenAllocation from './TokenAllocation';
import TokenReleaseSchedule from './TokenReleaseSchedule';

const medias = {
  home: homeLink,
  twitter: twitter,
  telegram: telegram,
  youtube: youtube,
  reddit: reddit,
  github: github,
  linkin: linkedin,
  instagram: instagram,
  coinmarket: m,
  coingecko: coingecko,
  discord: discord,
  vk: vk,
  medium: medium,
};

const Wrapper = styled.div`
  width: 100%;
  padding-top: 88px;
`;

const ProjectContent = styled.div`
  margin-bottom: 60px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(225, 232, 245, 0.68);

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 40px;
    font-size: 14px;
    line-height: 21px;
  }
`;

const ProjectName = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  color: #e1e8f5;
  margin-bottom: 14px;
  > span {
    margin-left: 4px;
    color: rgba(225, 232, 245, 0.4);
    font-size: 14px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const ProjectMedia = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 13, 29, 0.4);
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;

  img {
    width: 24px;
    height: 24px;
    margin-right: 24px;
    margin-bottom: 14px;
    cursor: pointer;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;

const ProjectInfo = () => {
  const {
    baseCurrencyName: currencyFullName,
    baseCurrency: currencyShortName,
    descriptionModule,
    mediaModule = [],
    releaseSchedule = [],
  } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);

  return !mediaModule?.length && !descriptionModule && !releaseSchedule?.length ? null : (
    <Wrapper id="projectInfo">
      <Title title={_t('wh96h6VC3WRWu8PX4xyenC')} icon={ball} />
      {mediaModule?.length || descriptionModule ? (
        <ProjectName>
          {currencyFullName}
          <span>{currencyShortName}</span>
        </ProjectName>
      ) : null}

      {mediaModule?.length ? (
        <ProjectMedia>
          {map(mediaModule, ({ title, content }) => {
            const icon = medias[(title || '').toLowerCase()];
            if (icon) {
              return (
                <img
                  src={icon}
                  alt={title}
                  key={title}
                  onClick={() => locateToUrl(content)}
                  role="button"
                />
              );
            }
          })}
        </ProjectMedia>
      ) : null}
      {descriptionModule ? <ProjectContent>{descriptionModule}</ProjectContent> : null}
      <TokenReleaseSchedule />
      <TokenAllocation />
    </Wrapper>
  );
};

export default ProjectInfo;
