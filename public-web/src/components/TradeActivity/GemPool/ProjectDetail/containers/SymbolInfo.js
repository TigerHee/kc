/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { styled, useResponsive } from '@kux/mui';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import { useSelector } from 'src/hooks/useSelector';
import AnchorPlaceholder from './AnchorPlaceholder';

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: 40px;
  padding: 0 16px 58px;

  .currencyIntro {
    display: flex;
    align-items: center;
    > span {
      display: inline-flex;
      align-items: baseline;
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      object-fit: cover;
      border-radius: 24px;
    }

    .name {
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
    }
    .fullName {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
  }

  .media {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    .mediaItem {
      padding: 2px 7px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      border: 1px solid ${(props) => props.theme.colors.divider8};
      border-radius: 80px;
      cursor: pointer;
    }
  }

  .desc {
    margin-top: 16px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
`;

const emptyArr = [];

function SymbolInfo({ showDisclaim = false }) {
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();

  const dispatch = useDispatch();

  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);

  const { earnTokenLogo, earnTokenName, earnTokenOverview, mediaInfo } = currentInfo || {};

  const medias = useMemo(() => {
    try {
      if (mediaInfo) {
        return JSON.parse(mediaInfo);
      }
      return emptyArr;
    } catch (error) {
      return emptyArr;
    }
  }, [mediaInfo]);

  const handleJump = useCallback(
    (url) => {
      if (isInApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(url)}`,
          },
        });
      } else {
        window.open(url);
      }
    },
    [isInApp],
  );

  if (sm) {
    return null;
  }
  return (
    <ContentWrapper>
      <AnchorPlaceholder id="symbolInfo" />
      <div className="currencyIntro">
        {!!earnTokenLogo && <LazyImg src={earnTokenLogo} alt="logo" />}
        <span>
          <span className="name">{earnTokenName}</span>
        </span>
      </div>
      {medias?.length ? (
        <div className="media">
          {medias?.map((media, index) => {
            return (
              <span
                className="mediaItem"
                key={`${media?.mediaName}_${index}`}
                onClick={() => handleJump(media?.value)}
              >
                {media?.mediaName}
              </span>
            );
          })}
        </div>
      ) : null}
      <div className="desc">{earnTokenOverview}</div>
      {showDisclaim && <AppleDisclaim />}
    </ContentWrapper>
  );
}

export default memo(SymbolInfo);
