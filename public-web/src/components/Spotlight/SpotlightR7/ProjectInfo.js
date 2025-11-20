/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import ball from 'static/spotlight7/ball.svg';
import coingecko from 'static/spotlight7/coingecko.svg';
import discord from 'static/spotlight7/discord.svg';
import github from 'static/spotlight7/github.svg';
import homeLink from 'static/spotlight7/homeLink.svg';
import instagram from 'static/spotlight7/instagram.svg';
import linkedin from 'static/spotlight7/linkedin.svg';
import m from 'static/spotlight7/m.svg';
import medium from 'static/spotlight7/medium.svg';
import reddit from 'static/spotlight7/reddit.svg';
import telegram from 'static/spotlight7/telegram.svg';
import twitter from 'static/spotlight7/twitter.svg';
import vk from 'static/spotlight7/vk.svg';
import youtube from 'static/spotlight7/youtube.svg';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import AnchorPlaceholder from 'TradeActivityCommon/AnchorPlaceholder';
import Title from './Title';

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

const Wrapper = styled.section`
  position: relative;
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
  }
`;

const ProjectMedia = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 24px;

  img {
    width: 28px;
    height: 28px;
    margin-right: 20px;
    margin-bottom: 20px;
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
  } = useSelector((state) => state.spotlight7.detailInfo, shallowEqual);

  return (
    <Wrapper>
      <AnchorPlaceholder id="projectInfo" />
      <Title title={_t('wh96h6VC3WRWu8PX4xyenC')} icon={ball} />
      <ProjectName>
        <span>{currencyFullName}</span>
        <span className="fullName">{currencyShortName}</span>
      </ProjectName>

      {descriptionModule ? <ProjectContent>{descriptionModule}</ProjectContent> : null}
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
    </Wrapper>
  );
};

export default ProjectInfo;
