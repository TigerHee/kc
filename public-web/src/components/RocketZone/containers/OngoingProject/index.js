/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICHistoryOutlined, ICShareOutlined } from '@kux/icons';
import { Divider, useResponsive } from '@kux/mui';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import emptyData from 'static/gempool/emptyData.png';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import { trackClick } from 'utils/ga';
import { PROJECT_TYPE } from '../../constant';
import Activity from './Activity';
import GemPoolActivity from './GemPoolActivity';
import GemSlot from './GemSlot';
import GemVote from './GemVote';
import {
  EmptyWrapper,
  LinkWrapper,
  ShareWrapper,
  StyledDetailInfo,
  StyledProject,
} from './styledComponents';

function OngoingProject(props) {
  const { typeName, details = [], id, ...rest } = props || {};
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const { sm, lg } = useResponsive();
  const dispatch = useDispatch();

  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const { moreHref, jumpHref, defaultImageUrl, subTitle, icon, title, detailDatas, columsDatas } =
    useMemo(() => {
      return PROJECT_TYPE(isInApp, currentLang, currentTheme)[typeName] || {};
    }, [isInApp, typeName, currentLang, currentTheme]);

  const contentList = useMemo(() => {
    if (typeName === 'gemSlot') {
      return <GemSlot details={details} />;
    }

    return map(details, (item, index) => {
      if (item) {
        const { jumpUrl, shortName } = item;
        const url = jumpUrl || (jumpHref && jumpHref(shortName));

        if (typeName === 'gemNewPool') {
          return <GemPoolActivity {...item} url={url} key={`activity_${index}`} />;
        }

        if (typeName === 'gemVote') {
          return <GemVote {...item} url={url} key={`activity_${index}`} />;
        }

        return (
          <Activity
            {...item}
            typeName={typeName}
            url={url}
            key={`activity_${index}`}
            columsDatas={columsDatas}
          />
        );
      }
    });
  }, [typeName, jumpHref, details, columsDatas]);

  const handleMore = useCallback(() => {
    trackClick([typeName, 'More']);
    locateToUrlInApp(moreHref);
  }, [moreHref, typeName]);

  // 防止app内用户点击多次，弹出多次弹框
  const handleShare = useCallback(
    debounce(
      () => {
        dispatch({
          type: 'rocketZone/update',
          payload: {
            shareInfo: {
              shareImg: defaultImageUrl,
              shareUrl: '/gemspace/ongoing',
            },
            shareModal: Math.random(),
          },
        });

        trackClick([typeName, 'Share']);
      },
      2000,
      { trailing: false, leading: true },
    ),
    [dispatch, defaultImageUrl, typeName],
  );

  if (!title) return null;

  return (
    <StyledProject id={id}>
      {!sm && <div className="bg" />}

      <div className="content">
        <div className="header">
          <h2 className="main-title">
            <div className="title-wrapper">
              <LazyImg src={icon} className="project-icon" />
              {title}
            </div>
            <div className="right-wrapper">
              {moreHref && (
                <>
                  <LinkWrapper to={moreHref} onClick={handleMore} dontGoWithHref={isInApp}>
                    <ICHistoryOutlined />
                    {_t('egx2bSQF1AHr1TrpoZDoaz')}
                  </LinkWrapper>
                  {!sm && <Divider type="vertical" />}
                </>
              )}
              <ShareWrapper onClick={handleShare}>
                <ICShareOutlined />
              </ShareWrapper>
            </div>
          </h2>
          {subTitle && <div className="sub-title">{subTitle}</div>}
        </div>
        {typeof detailDatas === 'function' ? (
          <StyledDetailInfo>
            {map(detailDatas({ ...rest }), ({ label, comp }, index) => {
              return (
                <div className="item">
                  <div className="value">{comp}</div>
                  {label}
                </div>
              );
            })}
          </StyledDetailInfo>
        ) : null}

        {details?.length ? (
          contentList
        ) : (
          <EmptyWrapper>
            <img src={emptyData} alt="empty" />
            {_t('i6chu81TBpiijMEkcqwfCF')}
          </EmptyWrapper>
        )}
      </div>
    </StyledProject>
  );
}

export default memo(OngoingProject);
