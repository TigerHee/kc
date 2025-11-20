/**
 * Owner: willen@kupotech.com
 */
import { keyframes, Popover, px2rem, styled, useMediaQuery, useResponsive } from '@kufox/mui';
import QRCode from 'components/QrCodeWithLogo';
import { useIsLegalGp, useIsPulling } from 'hooks/useCountryInfo';
import { map } from 'lodash';
import android from 'static/newhomepage/download/android.png';
import appStore from 'static/newhomepage/download/app-store.png';
import googlePlay from 'static/newhomepage/download/google-play.png';
import config from '../../NewIndexCards/config';

const getdownList = (isLegalGp) => {
  if (isLegalGp) {
    return [
      {
        title: 'App Store',
        url: config.download.ios.AppStoreUrl,
        icon: appStore,
        idx: 1,
      },
      {
        title: 'Google Play',
        url: config.download.android.GooglePlayUrl,
        icon: googlePlay,
        idx: 2,
      },
      {
        title: 'Android APK',
        url: config.download.android.APKUrl,
        icon: android,
        idx: 3,
      },
    ];
  }

  return [
    {
      title: 'App Store',
      url: config.download.ios.AppStoreUrlByIllegalGp,
      icon: appStore,
      idx: 1,
    },
    {
      title: 'Android APK',
      url: config.download.android.APKUrlByIllegalGp,
      icon: android,
      idx: 2,
    },
  ];
};

const popAni = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const DownloadPop = styled.div`
  padding: 16px 8px;
  background: #fff;
  display: flex;
  animation: ${popAni} 0.2s linear;
`;

const DownLoadList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: ${px2rem(339)};
  ${(props) => props.theme.breakpoints.down('md')} {
    justify-content: space-between;
    width: 100%;
  }
`;

const DownItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: ${px2rem(70)};
  min-height: ${px2rem(60)};
  margin-top: ${px2rem(6)};
  padding-top: ${px2rem(12)};
  cursor: pointer;
  img {
    width: ${px2rem(40)};
    height: ${px2rem(40)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    align-items: flex-start;
    margin-right: 0;
    img {
      width: ${px2rem(36)};
      height: ${px2rem(36)};
    }
  }
  span {
    margin-top: ${px2rem(4)};
    color: ${(props) => props.theme.colors.text};
    font-weight: normal;
    font-size: ${px2rem(16)};
    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: ${px2rem(12)};
    }
  }
`;

const ResponsiveBox = styled.div`
  margin-right: ${px2rem(0)};
  flex: 1;
  display: flex;

  > a {
    flex: 1;
  }
`;

const TipResponsive = ({ item }) => {
  return (
    <ResponsiveBox>
      <a href={item.url} rel="nofollow">
        <DownItem>
          <img src={item.icon} alt={item.title} />
          <span>{item.title}</span>
        </DownItem>
      </a>
    </ResponsiveBox>
  );
};

const Tip = ({ item, placement }) => {
  return (
    <Popover
      placement={placement}
      arrow={false}
      title={
        <DownloadPop>
          {item.url ? <QRCode value={item.url} size={192} level="M" /> : null}
        </DownloadPop>
      }
    >
      <DownItem>
        <img src={item.icon} alt={item.title} />
        <span>{item.title}</span>
      </DownItem>
    </Popover>
  );
};

const Down = (props) => {
  const { className, placement = 'right' } = props || {};
  useResponsive();
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const isPulling = useIsPulling();
  const isLegalGp = useIsLegalGp();
  const downList = getdownList(isLegalGp);

  return (
    <DownLoadList className={`${className || ''}`}>
      {!isPulling &&
        map(downList, (item, key) => {
          if (lg) {
            return <Tip placement={placement} item={item} key={`lg${key}`} />;
          }
          return <TipResponsive item={item} key={key} />;
        })}
    </DownLoadList>
  );
};

export default Down;
