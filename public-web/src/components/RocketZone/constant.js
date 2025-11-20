/**
 * Owner: solar@kupotech.com
 */
import { DateTimeFormat, NumberFormat, styled } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import FireIcon from 'static/rocket_zone/fire.gif';
import { _t } from 'tools/i18n';
import Tooltip from 'TradeActivityCommon/Tooltip';
import CoinTransfer from './containers/NewCurrencyList/CoinTransfer';
// import listingNewLogo from 'static/rocket_zone/listingNew.png';
// import newListingBg from 'static/rocket_zone/newListingBg.png';
import burningdropLogo from 'static/rocket_zone/burningdrop.png';
import burningdropDarkLogo from 'static/rocket_zone/burningdropDark.png';
import gempoolLogo from 'static/rocket_zone/gempool.png';
import gempoolDarkLogo from 'static/rocket_zone/gempoolDark.png';
import gemslotLogo from 'static/rocket_zone/gemslot.png';
import gemslotDarkLogo from 'static/rocket_zone/gemslotDark.png';
import gemvoteLogo from 'static/rocket_zone/gemvote.png';
import gemvoteDarkLogo from 'static/rocket_zone/gemvoteDark.png';
import premarketLogo from 'static/rocket_zone/premarket.png';
import premarketDarkLogo from 'static/rocket_zone/premarketDark.png';
import spotlightLogo from 'static/rocket_zone/spotlight.png';
import spotlightDarkLogo from 'static/rocket_zone/spotlightDark.png';

export const PlaceholderWrapper = styled.span`
  color: ${(props) => props.theme.colors.text30};
`;

// gemspace tab key
export const TABKEYS = {
  NEWLISTING: 'newlisting',
  ONGOING: 'ongoing',
};

// gemspace priorityDisplay data transform
export const TABKEYSTRANSFORM = {
  NewListing: 'newlisting',
  OngoingEvents: 'ongoing',
};

// gemspace tab items
export const TABITEMS = [
  {
    label: _t('pJjafnPJ1VoUajBnCWuvVZ'),
    value: TABKEYS.NEWLISTING,
  },
  {
    label: _t('xABoGvHq3r7wxzvi42W5pC'),
    value: TABKEYS.ONGOING,
  },
];

// gemspace tab icons
export const TABICONS = {
  new: <span className="mark newIcon">{_t('09e3bc749d994000a222')}</span>,
  hot: <img src={FireIcon} alt="fire" className="fireIcon" />,
  live: <span className="mark liveIcon">{_t('85b6156e73fe4000acc7')}</span>,
};

export const PROJECT_TYPE = (isInApp, currentLang, theme) => {
  const _path = `${__webpack_public_path__}${DEPLOY_PATH}/static/rocket_zone`;
  return {
    newListing: {
      // 新币专区
      // icon: listingNewLogo,
      // bg: newListingBg,
      icon: 'listingNew',
      bg: 'newListingBg',
      title: _t('2ijwEb4ACk9UYW8zj2hebd'),
      defaultImageUrl: `${_path}/newListingShare.jpg`,
    },
    // gemSlot: {
    //   icon: theme === 'light' ? gemslotLogo : gemslotDarkLogo,
    //   title: _t('615b6f53080e4000a487'),
    //   subTitle: _t('d10d4f0d98324000aa30'),
    //   moreHref: '/gemslot',
    //   defaultImageUrl: `${_path}/gemslotShare.jpg`,
    // },
    gemPad: {
      // spotlight
      icon: theme === 'light' ? spotlightLogo : spotlightDarkLogo,
      title: _t('vTWw5ibiqesJDwEfga6g1g'),
      subTitle: _t('vz8JDWVY53Vo8fitqnjirs'),
      moreHref: '/spotlight-center',
      detailDatas: ({ totalRaised, totalParticipants, averageAth, totalProjects }) => {
        return [
          {
            label: <div className="label">{_t('unJc2MFz7rYUmVQ9PvPvgw')}</div>,
            comp: totalRaised ? (
              <CoinTransfer quoteCurrency="USDT" value={totalRaised} defaultPrecision={0} />
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('2oUBLq89mCavnyCuaZHMDx')}</div>,
            comp: totalParticipants ? (
              <NumberFormat lang={currentLang}>{totalParticipants}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: (
              <Tooltip title={_t('627C1BN1xt2iFUAxk7mowU')}>
                <div className="label underline-label">{_t('digjPrbR6Uj8NioKsj5ZYo')}</div>
              </Tooltip>
            ),
            comp: averageAth ? (
              <NumberFormat
                options={{
                  style: 'percent',
                }}
                lang={currentLang}
              >
                {averageAth}
              </NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('iRsbXXfWxDumT2SJQtCurC')}</div>,
            comp: totalProjects ? (
              <NumberFormat lang={currentLang}>{totalProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
        ];
      },
      columsDatas: ({ price, quoteCurrency, campaignAmount, activityRegistrationCount, shortName, fixData }) => {
        const finalPrice = fixData.price || price;
        const finalQuoteCurrency = fixData.quoteCurrency || quoteCurrency || '';
        const finalCampaignAmount = fixData.campaignAmount || campaignAmount;
        const finalActivityRegistrationCount = fixData.activityRegistrationCount || activityRegistrationCount;
        const finalToken = fixData.token || shortName;
        return [
          {
            label: <div className="label">{_t('iEUetvsL4xWc3nHK7n6TGd')}</div>,
            comp: finalPrice ? (
              <>
                <NumberFormat lang={currentLang}>{finalPrice}</NumberFormat>
                {` ${finalQuoteCurrency}`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('vG2iucgVwjXGucQuT15f73')}</div>,
            comp: finalCampaignAmount ? (
              <>
                <NumberFormat lang={currentLang}>{finalCampaignAmount}</NumberFormat>
                {` ${finalToken}`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('37MTH3ZgHRYkGHYq7qDkVN')}</div>,
            comp: finalActivityRegistrationCount ? (
              <NumberFormat lang={currentLang}>{finalActivityRegistrationCount}</NumberFormat>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
        ];
      },
      defaultImageUrl: `${_path}/spotlightShare.jpg`,
    },
    gemNewPool: {
      // gemPool
      icon: theme === 'light' ? gempoolLogo : gempoolDarkLogo,
      title: _t('3f14d758f7b84000a527'),
      subTitle: _t('6d3e6cef03e34000af4c'),
      moreHref: '/gempool',
      jumpHref: (currency) => `/gempool/${currency}`,
      detailDatas: ({ totalStaked, totalParticipants, averageAth, totalProjects }) => {
        return [
          {
            label: <div className="label">{_t('71te92wRYCUGCZsXk4ywqz')}</div>,
            comp: totalStaked ? (
              <CoinTransfer quoteCurrency="USDT" value={totalStaked} defaultPrecision={0} />
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('2oUBLq89mCavnyCuaZHMDx')}</div>,
            comp: totalParticipants ? (
              <NumberFormat lang={currentLang}>{totalParticipants}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: (
              <Tooltip title={_t('627C1BN1xt2iFUAxk7mowU')}>
                <div className="label underline-label">{_t('digjPrbR6Uj8NioKsj5ZYo')}</div>
              </Tooltip>
            ),
            comp: averageAth ? (
              <NumberFormat
                options={{
                  style: 'percent',
                }}
                lang={currentLang}
              >
                {averageAth}
              </NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('iRsbXXfWxDumT2SJQtCurC')}</div>,
            comp: totalProjects ? (
              <NumberFormat lang={currentLang}>{totalProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
        ];
      },
      defaultImageUrl: `${_path}/gemPoolShare.jpg`,
    },
    gemPreMarket: {
      icon: theme === 'light' ? premarketLogo : premarketDarkLogo,
      title: _t('p2oTgByxdzWA9H6cob7umF'),
      subTitle: _t('41101a22008a4000a21c'),
      moreHref: '/pre-market',
      jumpHref: (currency) => `/pre-market/${currency}`,
      detailDatas: ({ totalStaked, totalParticipants, averageAth, totalProjects }) => {
        return [
          {
            label: <div className="label">{_t('c4084023bb544000ad35')}</div>,
            comp: totalStaked ? (
              <CoinTransfer quoteCurrency="USDT" value={totalStaked} defaultPrecision={0} />
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('2oUBLq89mCavnyCuaZHMDx')}</div>,
            comp: totalParticipants ? (
              <NumberFormat lang={currentLang}>{totalParticipants}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: (
              <Tooltip title={_t('627C1BN1xt2iFUAxk7mowU')}>
                <div className="label underline-label">{_t('digjPrbR6Uj8NioKsj5ZYo')}</div>
              </Tooltip>
            ),
            comp: averageAth ? (
              <NumberFormat
                options={{
                  style: 'percent',
                }}
                lang={currentLang}
              >
                {averageAth}
              </NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('iRsbXXfWxDumT2SJQtCurC')}</div>,
            comp: totalProjects ? (
              <NumberFormat lang={currentLang}>{totalProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
        ];
      },
      columsDatas: ({ deliveryTime, lastTradePrice, avgPrice, offerCurrency }) => {
        return [
          {
            label: <div className="label">{_t('i76HHGQ12BXie2WBaa5Uqo')}</div>,
            comp: deliveryTime ? (
              <>
                <DateTimeFormat
                  date={deliveryTime}
                  lang={currentLang}
                  options={{ timeZone: 'UTC', second: undefined }}
                >
                  {deliveryTime}
                </DateTimeFormat>
                {` (UTC)`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('mY7CdPaQz25Gej7Z2wq93A')}</div>,
            comp: lastTradePrice ? (
              <>
                <NumberFormat lang={currentLang}>{lastTradePrice}</NumberFormat>
                {` ${offerCurrency || ''}`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('wRWkH78Api3bn24R4B3MtD')}</div>,
            comp: avgPrice ? (
              <NumberFormat lang={currentLang}>{avgPrice}</NumberFormat>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
        ];
      },
      defaultImageUrl: `${_path}/premarketShare.jpg`,
    },
    gemVote: {
      icon: theme === 'light' ? gemvoteLogo : gemvoteDarkLogo,
      title: _t('nrzND6HxSyEV4dCcUThwAh'),
      subTitle: _t('mNvdmqHJQyFcuXt9YcR41w'),
      moreHref: '/gemvote',
      jumpHref: () => '/gemvote',
      detailDatas: ({ totalProjects, totalParticipants, activityPeriods, winnerProjects }) => {
        return [
          {
            label: <div className="label">{_t('7f0d665711854000a421')}</div>,
            comp: totalParticipants ? (
              <NumberFormat lang={currentLang}>{totalParticipants}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('20648c85d6224000acf4')}</div>,
            comp: totalProjects ? (
              <NumberFormat lang={currentLang}>{totalProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('87ce5e5573e84000a4d7')}</div>,
            comp: activityPeriods ? (
              <NumberFormat lang={currentLang}>{activityPeriods}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('9164108d6d614000a1a1')}</div>,
            comp: winnerProjects ? (
              <NumberFormat lang={currentLang}>{winnerProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
        ];
      },
      defaultImageUrl: `${_path}/gemVoteShare.jpg`,
    },
    gemPool: {
      // burningdrop
      icon: theme === 'light' ? burningdropLogo : burningdropDarkLogo,
      title: _t('7ZbTTXFtP3fSKhAAqkvNLg'),
      subTitle: _t('nDt6zR979P2qyoRU5JrhGU'),
      moreHref: isInApp ? '/earn/lockDrop?isBanner=1' : '/earn/x-lockdrop',
      detailDatas: ({ totalStaked, totalParticipants, averageAth, totalProjects }) => {
        return [
          {
            label: <div className="label">{_t('71te92wRYCUGCZsXk4ywqz')}</div>,
            comp: totalStaked ? (
              <CoinTransfer quoteCurrency="USDT" value={totalStaked} defaultPrecision={0} />
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('2oUBLq89mCavnyCuaZHMDx')}</div>,
            comp: totalParticipants ? (
              <NumberFormat lang={currentLang}>{totalParticipants}</NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: (
              <Tooltip title={_t('627C1BN1xt2iFUAxk7mowU')}>
                <div className="label underline-label">{_t('digjPrbR6Uj8NioKsj5ZYo')}</div>
              </Tooltip>
            ),
            comp: averageAth ? (
              <NumberFormat
                options={{
                  style: 'percent',
                }}
                lang={currentLang}
              >
                {averageAth}
              </NumberFormat>
            ) : (
              '--'
            ),
          },
          {
            label: <div className="label">{_t('iRsbXXfWxDumT2SJQtCurC')}</div>,
            comp: totalProjects ? (
              <NumberFormat lang={currentLang}>{totalProjects}</NumberFormat>
            ) : (
              '--'
            ),
          },
        ];
      },
      columsDatas: ({ lockPeriod, userUpperLimit, productUpperLimit, quoteCurrency }) => {
        return [
          {
            label: <div className="label">{_t('4273b9a994bf4000a9fc')}</div>,
            comp: productUpperLimit ? (
              <>
                <NumberFormat lang={currentLang}>{productUpperLimit}</NumberFormat>
                {` ${quoteCurrency || ''}`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('cae6cb1c670c4000af28')}</div>,
            comp: userUpperLimit ? (
              <>
                <NumberFormat lang={currentLang}>{userUpperLimit}</NumberFormat>
                {` ${quoteCurrency || ''}`}
              </>
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
          {
            label: <div className="label">{_t('23015f39ea2c4000abc2')}</div>,
            comp: lockPeriod ? (
              _t('d7d30ec744ff4000a2af', {
                day: numberFormat({
                  number: lockPeriod,
                  lang: currentLang,
                }),
              })
            ) : (
              <PlaceholderWrapper>--</PlaceholderWrapper>
            ),
          },
        ];
      },
      defaultImageUrl: `${_path}/burningDropShare.jpg`,
    },
  };
};
