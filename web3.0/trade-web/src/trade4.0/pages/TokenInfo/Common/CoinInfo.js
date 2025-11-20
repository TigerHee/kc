/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled } from '@/style/emotion';
import { ICArrowRightOutlined, ICInfoContainOutlined } from '@kux/icons';
import Tooltip from '@mui/Tooltip';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';
import { htmlToReactSync } from '@/utils/htmlToReactSync';
import SafeLink from 'components/SafeLink';
import {
  MoneyAmountFormat,
  SupplyFormat,
  NumberWithChar,
  InternetIcon,
} from './components';
import { eTheme } from '@/utils/theme';
import {
  CoinInfoWrap,
  CoinTitle,
  CoinSubTitle,
  CoinInfoMore,
  BriefIntroText,
  DisclaimerCard,
} from './Style';

const CoinInfoRowWrap = styled.div`
  > div:not(:last-of-type) {
    margin-bottom: 12px;
  }
  &&& {
    margin-bottom: 19px;
  }
`;
const CoinInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TitleBar = styled.div`
  display: inline-flex;
  align-items: baseline;
`;
const CoinInfoTitle = styled.span`
  color: ${eTheme('text40')};
  font-weight: 400;
`;

const CoinInfoText = styled.span`
  color: ${eTheme('text')};
  font-weight: 500;
`;

const BriefIntro = styled.div`
  color: ${eTheme('text40')};
`;

const SafeLinkPrimary = styled(SafeLink)`
  color: ${eTheme('primary')};
`;

const CoinSafeLink = styled(SafeLinkPrimary)`
  margin-left: 10px;
`;

const SafeLinkMore = styled(SafeLinkPrimary)`
  text-decoration: none;
`;

const CoinLinkWrap = styled.div`
  word-break: break-all;
  text-align: right;
  ${(props) => {
    if (props.muti) {
      return `
        display: flex;
        flex-flow: column;
      `;
    }
    return '';
  }}
`;

const getUrlPrefix = (href) => {
  try {
    const reg = new RegExp(/\w+:\/\/([^/:]+)(:\d*)?/);
    const matchObj = href.match(reg);
    if (matchObj) {
      return matchObj[1] || matchObj[0];
    } else {
      return href;
    }
  } catch (error) {
    return href;
  }
};

const CoinLink = (props) => {
  const { url, render } = props;
  return (
    <CoinSafeLink href={url}>
      {typeof render === 'function' ? render(url) : getUrlPrefix(url)}
    </CoinSafeLink>
  );
};

const ICInfoContainOutlinedBox = styled(ICInfoContainOutlined)`
  color: ${(props) => props.theme.colors.icon60};
  cursor: pointer;
  vertical-align: top;
  margin-left: 4px;
  margin-top: 2px;
  &:hover {
    color: ${(props) => props.theme.colors.icon};
  }
`;

const InfoTitleTooptip = (props) => {
  // 浏览器title旁展示tooltip的icon
  if (props.id === 'explorer') {
    return (
      <Tooltip placement="top" title={_t('e13QoerRhJ7bAzsoDNrAZN')}>
        <ICInfoContainOutlinedBox size={14} />
      </Tooltip>
    );
  }
  return null;
};

const CoinLinks = (props) => {
  const { url, render, muti = false } = props;
  return (
    <CoinLinkWrap muti={muti}>
      {Array.isArray(url) ? (
        url.map((urlLink) => (
          <CoinLink url={urlLink} key={urlLink} render={render} />
        ))
      ) : (
        <CoinLink url={url} key={url} render={render} />
      )}
    </CoinLinkWrap>
  );
};

const CoinInfoView = (props) => {
  const { coinInfo } = props;
  const {
    currentSymbol,
    briefIntroTitle,
    briefIntroText,
    coinName,
    code,
  } = coinInfo;
  const list = [
    {
      id: 'rank',
      textKey: 'coin.detail.coin.info.rank.title', // '排名',
      render(val) {
        if (val) {
          val = `No.${val}`;
        }
        return val || '--';
      },
    },
    {
      id: 'marketCap',
      textKey: 'uwDgDwhjriM9cyH84bsi4S', // '市值',
      render(val) {
        if (!val) return '';
        return <MoneyAmountFormat value={Number(val) ? val : null} />;
      },
    },
    {
      id: 'circulatingSupply',
      textKey: 'urtaDeFLyLjcciJB7hGx3S', // '流通供应量',
      render(val) {
        return <SupplyFormat value={val} />;
      },
    },
    {
      id: 'maxSupply',
      textKey: 'scMcJ4Ab2xC4NJbbByuze7', // '最大供应量',
      render(val) {
        return <SupplyFormat value={val} />;
      },
    },
    {
      id: 'ath',
      textKey: '3q1A5iw6XX5TgtheHdHb8G', // '历史最高价',
      render(val) {
        return val && currentSymbol ? (
          <NumberWithChar
            price={val}
            symbol={currentSymbol}
            needHandlePrice
            needTransfer={false}
          />
        ) : (
          '--'
        );
      },
    },
    {
      id: 'website',
      textKey: 'coin.detail.coin.info.website', // '官网',
      render(url) {
        if (!url) return '';
        return <CoinLinks url={url} muti />;
      },
    },
    {
      id: 'explorer',
      textKey: 'coin.detail.coin.info.explorer', // '浏览器',
      render(url) {
        if (!url) return '';
        return <CoinLinks url={url} muti />;
      },
    },
    {
      id: 'codeAndCommunity',
      textKey: 'coin.detail.coin.info.code.community', // '代码及社区',
      render(url) {
        if (!url) return '';
        const render = (urlLink) => (
          <InternetIcon
            url={urlLink}
            hideEmpty={Array.isArray(url) && !!url.length}
          />
        );
        return <CoinLinks url={url} render={render} />;
      },
    },
  ];
  return (
    <CoinInfoWrap>
      <TitleBar>
        <CoinTitle>{code}</CoinTitle>
        <CoinSubTitle>{coinName}</CoinSubTitle>
      </TitleBar>
      <CoinInfoRowWrap>
        {list.map(({ id, textKey, render }) => (
          <CoinInfoRow key={id}>
            <CoinInfoTitle>
              <span>{_t(textKey)}</span>
              <InfoTitleTooptip id={id} />
            </CoinInfoTitle>
            <CoinInfoText>
              {(typeof render === 'function'
                ? render(coinInfo[id])
                : coinInfo[id]) || '--'}
            </CoinInfoText>
          </CoinInfoRow>
        ))}
      </CoinInfoRowWrap>

      <DisclaimerCard>
        <span className="text">{_t('ea7e9822d9c04000a799')}</span>
      </DisclaimerCard>

      {(!!briefIntroTitle || !!briefIntroText) && (
        <BriefIntro>
          {!!briefIntroTitle && <div>{htmlToReactSync(briefIntroTitle)}</div>}
          {!!briefIntroText && (
            <BriefIntroText>{htmlToReactSync(briefIntroText)}</BriefIntroText>
          )}
        </BriefIntro>
      )}
      {isDisplayFeeInfo() && <CoinInfoMore>
        <SafeLinkMore href={`/price/${code}`} className="flex-center khc">
          {_t('view.more')}
          <ICArrowRightOutlined className="horizontal-flip-in-arabic" />
        </SafeLinkMore>
      </CoinInfoMore>}
    </CoinInfoWrap>
  );
};

export default memo(CoinInfoView);
