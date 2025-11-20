import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTheme, useResponsive } from '@kux/mui';
import map from 'lodash/map';
import clsx from 'clsx';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import useIpCountryCode from '@hooks/useIpCountryCode';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useCompliantShow } from '@packages/compliantCenter';
import {
  WITHOUT_QUERY_PARAM,
  TR_FOOTER_LINKS,
  TH_FOOTER_LINKS,
  FOOTER_LINKS,
  guardianHiddenLangs,
  KCglobalAmbassaVisibleLangs,
} from '../../config';
import { useLang } from '../../hookTool';
import { changLangToPath, getRelativePath } from '../../common/tools';
import { FOOTER_LINKS_UK_FORBIDDEN_SPM } from '../../common/constants';
import { useCommonStyles } from '../commonStyles';
import { useStyles } from './styles';
import { isSSG } from '../../constants';
import Whistleblower from '../Whistleblower';
import { getFooterInfo } from '../../service';
import { tenantConfig } from '../../tenantConfig';

const isTrSite = window?._BRAND_SITE_ === 'TR';
const isThSite = window?._BRAND_SITE_ === 'TH';

function FooterLinks({ renderDynamicData, currentLang }) {
  const ref = useRef();
  const { t } = useLang();
  const [country, setCountry] = useState();
  // ipCountryCode 提供给 country 使用，country 实际已经没有被使用了
  const ipCountryCode = useIpCountryCode();
  const theme = useTheme();
  const commonStyles = useCommonStyles({ theme });
  const styles = useStyles({ theme });
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const [showStatic, setShowStatic] = useState(false);
  const [footerData, setFooterData] = useState();

  // ip 是英国，返回 false, 不展示博客、媒體工具包、KuCoin Labs、KuCoin Ventures等入口
  let showFooterLinks = useCompliantShow(FOOTER_LINKS_UK_FORBIDDEN_SPM);
  if (isSSG) {
    showFooterLinks = true;
  }

  useEffect(() => {
    // IP 库匹配到法国或者没有匹配到国家，都去掉法国的展示
    if (ipCountryCode === 'FR' || ipCountryCode === null) {
      // 已经没有功能使用
      setCountry('fr_FR');
    }
  }, [ipCountryCode]);

  useEffect(() => {
    if (!ref.current) return;
    renderDynamicData();
  }, [renderDynamicData]);

  const linkContents = useCallback(
    (item, country) => {
      if (item.association) {
        return (
          <dd>
            <ul css={styles.newFooterAssociationList} className="newFooterAssociationList">
              {map(
                item.links,
                ({ title, hover, img, imgProps, path, isUKForbidden, ...linkProps }, i) => {
                  if (hover) {
                    return (
                      <li
                        key={i}
                        css={commonStyles.newFooterHover}
                        className={clsx('newFooterAssociationItem', 'newFooterHover', {
                          first: i === 0,
                        })}
                      >
                        <LazyLoadImage src={img} {...imgProps} alt={imgProps.alt} />
                        <div
                          css={[
                            commonStyles.newFooterHoverMenu,
                            (title === 'Reddit' || title === 'Instagram') && styles.newFooterReddit,
                            title === 'Facebook' && styles.newFooterFacebook,
                            title === 'Twitter' && styles.newFooterTwitter,
                          ]}
                          className={clsx('newFooterHoverMenu', {
                            newFooterReddit: title === 'Reddit' || title === 'Instagram',
                            newFooterFacebook: title === 'Facebook',
                            newFooterTwitter: title === 'Twitter',
                          })}
                        >
                          {hover(country, item.categoryKey)}
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={i} css={styles.newFooterAssociationItem}>
                      <a
                        href={changLangToPath(
                          currentLang,
                          queryPersistence.formatUrlWithStore(path, WITHOUT_QUERY_PARAM),
                        )}
                        onClick={() =>
                          kcsensorsManualTrack(
                            { spm: ['Footer', item.categoryKey], data: { url: path } },
                            'page_click',
                          )
                        }
                        key={i}
                        target="_blank"
                        {...imgProps}
                        {...linkProps}
                      >
                        <LazyLoadImage src={img} {...imgProps} alt={imgProps.alt} />
                      </a>
                    </li>
                  );
                },
              )}
            </ul>
          </dd>
        );
      }
      if (item.dynamicDataId) {
        ref.current = {};
        // 语义化标签 不要这个div
        return null;
        // return (
        //   <div
        //     ref={ref}
        //     id={item.dynamicDataId}
        //     key="dynamicDataId"
        //     data-category-key={item.categoryKey}
        //   />
        // );
      }
      return map(
        item.links,
        (
          {
            path,
            hover,
            title,
            visibleLangs,
            hiddenLangs,
            isUKForbidden,
            isStaticText,
            hidden,
            ...linkProps
          },
          i,
        ) => {
          if (hiddenLangs && hiddenLangs.includes(currentLang)) return null;
          // 英国合规
          if (!showFooterLinks && isUKForbidden === true) return null;
          // hidden，目前主要是判断多租户的隐藏
          if (hidden) return null;
          if (isStaticText) {
            return (
              <dd key={i}>
                <a
                  css={[styles.pureA]}
                  key={i}
                  {...linkProps}
                  data-inspector="inspector_footer_isStaticText"
                >
                  {title}
                </a>
              </dd>
            );
          }
          if (!visibleLangs || visibleLangs.includes(currentLang)) {
            if (hover) return hover(country, item.categoryKey);

            return (
              <dd key={i}>
                <a
                  href={changLangToPath(
                    currentLang,
                    queryPersistence.formatUrlWithStore(path, WITHOUT_QUERY_PARAM),
                  )}
                  onClick={() =>
                    kcsensorsManualTrack(
                      { spm: ['Footer', item.categoryKey], data: { url: path } },
                      'page_click',
                    )
                  }
                  target="_blank"
                  key={i}
                  data-inspector={`inspector_footer_a_path_${path}`}
                  {...linkProps}
                >
                  {title}
                </a>
              </dd>
            );
          }
          return null;
        },
      );
    },
    [
      styles.newFooterAssociationList,
      styles.newFooterAssociationItem,
      styles.newFooterReddit,
      styles.newFooterFacebook,
      styles.newFooterTwitter,
      styles.pureA,
      currentLang,
      commonStyles.newFooterHover,
      commonStyles.newFooterHoverMenu,
      showFooterLinks,
    ],
  );

  const requestFooterInfo = useCallback(() => {
    getFooterInfo()
      .then((res) => {
        if (res.success && res.data) {
          const { data } = res;
          // 使用前端的数据
          if (!data.supportPosition) {
            setShowStatic(true);
            return;
          }
          if (Array.isArray(data.multiLevelPositions) && data.multiLevelPositions.length) {
            const footerInfo = [];
            data.multiLevelPositions.forEach((element) => {
              if (element) {
                const { textMap, children, title } = element;
                const categoryItem = {
                  title: textMap.name,
                  categoryKey: title,
                  links: [],
                };
                if (categoryItem.categoryKey === 'Learn') {
                  // 通过接口获取币的数据
                  categoryItem.dynamicDataId = 'kc_howTobuy';
                  footerInfo.push(categoryItem);
                  return;
                }
                if (Array.isArray(children) && children.length) {
                  children.forEach((item) => {
                    if (item) {
                      const linkItem = {
                        title: item.textMap.name,
                      };
                      if (item.uri) {
                        linkItem.path = getRelativePath(item.uri);
                      } else {
                        linkItem.isStaticText = true;
                      }
                      // hiddenLangs 企业工作台不支持配置该功能
                      if (categoryItem.categoryKey === 'Serve') {
                        if (linkItem.path === '/land/guardian') {
                          linkItem.hiddenLangs = guardianHiddenLangs;
                        }
                      }
                      // visibleLangs 企业工作台不支持配置该功能
                      if (categoryItem.categoryKey === 'Business') {
                        if (linkItem.path === '/news/en-kucoin-global-ambassador-program') {
                          linkItem.visibleLangs = KCglobalAmbassaVisibleLangs;
                        }
                      }
                      const { daySrcImgMap, nightSrcImgMap } = item;
                      // eslint-disable-next-line prettier/prettier
                      if ((daySrcImgMap && daySrcImgMap.icon) && (nightSrcImgMap && nightSrcImgMap.icon)) {
                        // eslint-disable-next-line prettier/prettier
                        linkItem.img = theme.currentTheme === 'light' ? daySrcImgMap.icon : nightSrcImgMap.icon;
                        // eslint-disable-next-line prettier/prettier
                        linkItem.imgProps = { alt: item.textMap.name, 'aria-label': item.textMap.name };
                        linkItem.className = 'newFooterAssociationItem newFooterHover';
                        linkItem.rel = 'nofollow';
                        categoryItem.association = true;
                      }
                      categoryItem.links.push(linkItem);
                    }
                  });
                }
                if (categoryItem.categoryKey === 'Company') {
                  // 固定的内容
                  categoryItem.links.push({
                    path: '',
                    // 舉報通道
                    title: t('bZMWZGPy2x9wj5DcBZrK8F'),
                    hover: () => <Whistleblower key="_hover_Whistleblower_" />,
                    hidden: !tenantConfig.showWhistleblower,
                  });
                }
                footerInfo.push(categoryItem);
              }
            });
            setShowStatic(false);
            setFooterData(footerInfo);
          }
        }
      })
      .catch(() => {
        setShowStatic(true);
      });
  }, [theme, t]);

  useEffect(() => {
    requestFooterInfo();
  }, []);

  const renderFooterLinks = useMemo(() => {
    if (!showStatic && footerData) {
      return footerData;
    }
    if (isTrSite) {
      return TR_FOOTER_LINKS({ t, currentLang });
    }
    if (isThSite) {
      return TH_FOOTER_LINKS({ t, currentLang, isH5 });
    }
    return FOOTER_LINKS({ t, currentLang });
  }, [t, currentLang, isH5, showStatic, footerData]);

  return (
    <div
      css={[styles.newFooterLinks, !showFooterLinks && styles.ukFooterLinks]}
      className={clsx('newFooterLinks', { ukFooterLinks: !showFooterLinks })}
    >
      {map(renderFooterLinks, (item, index) => {
        const isUKForbidden = !showFooterLinks && item.isUKForbidden === true;
        if (isUKForbidden) return null;

        if (item.hidden) return null;

        const itemProp = {};
        if (item.dynamicDataId) {
          itemProp.id = item.dynamicDataId;
        }

        return (
          <React.Fragment key={index}>
            <dl
              css={[
                commonStyles.newFooterLinkGroup,
                item.association && styles.association,
                !showFooterLinks && item.categoryKey === 'Developer' && styles.ukLastGroup,
              ]}
              className={clsx('newFooterLinkGroup', {
                association: item.association,
                ukLastGroup: !showFooterLinks && item.categoryKey === 'Developer',
                [item.customCls]: item.customCls,
              })}
              data-inspector={`inspector_footer_categoryKey_${item.categoryKey}`}
              {...itemProp}
            >
              <dt
                css={[
                  commonStyles.newFooterLinkGroupTitle,
                  item.association && styles.associationTitle,
                ]}
                className="newFooterLinkGroupTitle"
              >
                {item.title}
              </dt>
              {linkContents(item, country)}
              {!isH5 && item.mergeNavList ? (
                <dd>
                  <dl>
                    <dt
                      css={[commonStyles.newFooterLinkGroupTitle, styles.mergeNavTitle]}
                      className="newFooterLinkGroupTitle mergeNavTitle"
                    >
                      {item.mergeNavList.title}
                    </dt>
                    {linkContents(item.mergeNavList, country)}
                  </dl>
                </dd>
              ) : null}
            </dl>
            {isH5 && item.mergeNavList ? (
              <dd>
                <dl
                  css={[
                    commonStyles.newFooterLinkGroup,
                    item.mergeNavList.association && styles.association,
                  ]}
                  className={clsx('newFooterLinkGroup', {
                    association: item.mergeNavList.association,
                  })}
                  data-inspector={`inspector_footer_categoryKey_${item.categoryKey}`}
                >
                  <dt
                    css={commonStyles.newFooterLinkGroupTitle}
                    className="newFooterLinkGroupTitle"
                  >
                    {item.mergeNavList.title}
                  </dt>
                  {linkContents(item.mergeNavList, country)}
                </dl>
              </dd>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default trackWindowScroll(FooterLinks);
