import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useResponsive, useTheme } from '@kux/mui-next';
import clsx from 'clsx';
import { queryPersistence } from 'tools/base/QueryPersistence';
import {
  LazyLoadImage,
  trackWindowScroll,
} from 'react-lazy-load-image-component';
import useIpCountryCode from 'hooks/useIpCountryCode';
import { kcsensorsManualTrack } from 'tools/sensors';
import {
  FOOTER_LINKS,
  WITHOUT_QUERY_PARAM,
  TR_FOOTER_LINKS,
  TH_FOOTER_LINKS,
  guardianHiddenLangs,
  KCglobalAmbassaVisibleLangs,
} from 'packages/footer/config';
import { useFooterStore } from 'packages/footer/model';
import { useCompliantShowWithInit } from 'packages/compliantCenter';
import { IS_SERVER_ENV, IS_SSG_ENV } from 'kc-next/env'
import { useTranslation } from 'tools/i18n';
import { changLangToPath, getRelativePath } from 'packages/footer/common/tools';
import { FOOTER_LINKS_UK_FORBIDDEN_SPM } from '../../common/constants';
import commonStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import { getCurrentLang } from 'kc-next/i18n';
import { bootConfig } from 'kc-next/boot';
import Whistleblower from '../Whistleblower';
import { getTenantConfig } from "packages/footer/tenantConfig";

function FooterLinks({ renderDynamicData }) {
  const ref = useRef<any>(null);
  const hasSetReady = useRef(false);
  const [isDynamicDataReady, setIsDynamicDataReady] = useState(false);
  const { t: _t } = useTranslation('footer');
  const [country, setCountry] = useState<string>();
  // ipCountryCode 提供给 country 使用，country 实际已经没有被使用了
  const ipCountryCode = useIpCountryCode();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const currentLang = getCurrentLang();
  const theme = useTheme();
  const tenantConfig = getTenantConfig(bootConfig._BRAND_SITE_);
  const showStatic = useFooterStore(store => store.showStatic);
  const multiLevelPositions = useFooterStore(store => store.multiLevelPositions);
  const pullFooterInfo = useFooterStore((store) => store.pullFooterInfo);
  // ip 是英国，返回 false, 不展示博客、媒體工具包、KuCoin Labs、KuCoin Ventures等入口
  // 在SSG模式下，渲染限制link到html
  const { show, init } = useCompliantShowWithInit(FOOTER_LINKS_UK_FORBIDDEN_SPM);
  // 如果没有初始化，则展示；如果初始化且不展示，则不展示；
  const showFooterLinks = !init || (init && show);

  useEffect(()=>{
    if(pullFooterInfo){
      pullFooterInfo();
    }
  },[pullFooterInfo]);

  useEffect(() => {
    // IP 库匹配到法国或者没有匹配到国家，都去掉法国的展示
    if (ipCountryCode === 'FR' || ipCountryCode === null) {
      // 已经没有功能使用
      setCountry('fr_FR');
    }
  }, [ipCountryCode]);

  useEffect(() => {
    if (!isDynamicDataReady || !ref.current) return;
    renderDynamicData();
  }, [renderDynamicData, isDynamicDataReady]);

  const linkContents = useCallback(
    (item, country) => {
      if (item.association) {
        return (
          <dd>
            <ul
              className={clsx(
                styles.newFooterAssociationList,
                'newFooterAssociationList'
              )}
            >
              {item.links.map(
                (
                  {
                    title,
                    hover,
                    img,
                    imgProps,
                    path,
                    isUKForbidden,
                    ...linkProps
                  },
                  i
                ) => {
                  if (hover) {
                    return (
                      <li
                        key={i}
                        className={clsx(
                          commonStyles.newFooterHover,
                          'newFooterAssociationItem',
                          'newFooterHover',
                          {
                            first: i === 0,
                          }
                        )}
                      >
                        <LazyLoadImage
                          src={img}
                          {...imgProps}
                          alt={imgProps.alt}
                        />
                        <div
                          className={clsx(
                            commonStyles.newFooterHoverMenu,
                            'newFooterHoverMenu',
                            {
                              [styles.newFooterReddit]:
                                title === 'Reddit' || title === 'Instagram',
                              [styles.newFooterFacebook]: title === 'Facebook',
                              [styles.newFooterTwitter]: title === 'Twitter',
                            }
                          )}
                        >
                          {hover(country, item.categoryKey)}
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className={styles.newFooterAssociationItem}>
                      <a
                        href={changLangToPath(
                          queryPersistence.formatUrlWithStore(path, WITHOUT_QUERY_PARAM),
                        )}
                        onClick={() => {
                          kcsensorsManualTrack(
                            {
                              spm: ['Footer', item.categoryKey],
                              data: { url: path },
                            },
                            'page_click'
                          )
                        }
                        }
                        key={i}
                        target="_blank"
                        {...imgProps}
                        {...linkProps}
                      >
                        <LazyLoadImage
                          src={img}
                          {...imgProps}
                          alt={imgProps.alt}
                        />
                      </a>
                    </li>
                  );
                }
              )}
            </ul>
          </dd>
        );
      }
      if (item.dynamicDataId) {
        ref.current = {};
        // 只在第一次遇到dynamicDataId时设置状态
        // 避免render死循环
        if (!hasSetReady.current) {
          hasSetReady.current = true;
          setIsDynamicDataReady(true);
        }
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
      return item.links.map(
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
          i
        ) => {
          if (hiddenLangs && hiddenLangs.includes(currentLang)) return null;
          // 英国合规
          if (!showFooterLinks && isUKForbidden === true) return null;
          // hidden，目前主要是判断多租户的隐藏
          if (hidden) return null;
          if (isStaticText) {
            return (
              <dd key={i} className={styles.commonFooterLink}>
                <a
                  className={styles.pureA}
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
              <dd key={i} className={styles.commonFooterLink}>
                <a
                  href={changLangToPath(
                    queryPersistence.formatUrlWithStore(path, WITHOUT_QUERY_PARAM),
                  )}
                  onClick={() => {
                    kcsensorsManualTrack(
                      {
                        spm: ['Footer', item.categoryKey],
                        data: { url: path },
                      },
                      'page_click'
                    )
                  }
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
        }
      );
    },
    [currentLang, commonStyles]
  );

  const getFooterData = useCallback(() => {
    if (Array.isArray(multiLevelPositions) && multiLevelPositions.length) {
        const footerInfo: any[] = [];
        multiLevelPositions.forEach((element) => {
          if (element) {
            const { textMap, children, title } = element;
            const categoryItem: any = {
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
                  const linkItem: any = {
                    title: item.textMap.name,
                  };
                  if(item.uri){
                    linkItem.path = getRelativePath(item.uri);
                  }else{
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
                  if ((daySrcImgMap && daySrcImgMap.icon) && (nightSrcImgMap && nightSrcImgMap.icon)) {
                    linkItem.img = theme.currentTheme === 'light' ? daySrcImgMap.icon : nightSrcImgMap.icon;
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
                title: _t('bZMWZGPy2x9wj5DcBZrK8F'),
                hover: () => <Whistleblower key="_hover_Whistleblower_" />,
                hidden: !tenantConfig.showWhistleblower,
              });
            }
            footerInfo.push(categoryItem);
          }
        });
        return footerInfo;
      }
  }, [theme, _t, multiLevelPositions]);

  const renderFooterLinks = useMemo(() => {
    const footerData = getFooterData();
    if (!showStatic && footerData) {
      return footerData;
    }
    const isTrSite = bootConfig._BRAND_SITE_ === 'TR';
    const isThSite = bootConfig._BRAND_SITE_ === 'TH';
    if (isTrSite) {
      return TR_FOOTER_LINKS({ _t });
    }
    if (isThSite) {
      return TH_FOOTER_LINKS({ _t, isH5 });
    }
    return FOOTER_LINKS({ _t });
  }, [_t, currentLang, isH5, showStatic, getFooterData]);

  return (
    <div
      className={clsx(
        styles.newFooterLinks,
        !showFooterLinks && styles.ukFooterLinks,
        'newFooterLinks',
        { ukFooterLinks: !showFooterLinks }
      )}
    >
      {renderFooterLinks.map((item, index) => {
        const isUKForbidden = !showFooterLinks && item.isUKForbidden === true;
        if (isUKForbidden) return null;

        if (item.hidden) return null;

        const itemProp: any = {};
        if (item.dynamicDataId) {
          itemProp.id = item.dynamicDataId;
        }
        return (
          <React.Fragment key={index}>
            <dl
              className={clsx(
                commonStyles.newFooterLinkGroup,
                'newFooterLinkGroup',
                item.association && 'association',
                !showFooterLinks && item.categoryKey === 'Developer' && 'ukLastGroup',
                {
                  [styles.association]: item.association,
                  [styles.ukLastGroup]: !showFooterLinks && item.categoryKey === 'Developer',
                  [commonStyles[item.customCls]]: item.customCls
                }
              )}
              data-inspector={`inspector_footer_categoryKey_${item.categoryKey}`}
              {...itemProp}
            >
              <dt
                className={clsx(
                  commonStyles.newFooterLinkGroupTitle,
                  'newFooterLinkGroupTitle',
                  {
                    [styles.associationTitle]: item.association,
                  }
                )}
              >
                {item.title}
              </dt>
              {linkContents(item, country)}
              {!isH5 && item.mergeNavList ? (
                <dd>
                  <dl>
                    <dt
                      className={clsx(
                        commonStyles.newFooterLinkGroupTitle,
                        styles.mergeNavTitle,
                        'newFooterLinkGroupTitle',
                        'mergeNavTitle'
                      )}
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
                  className={clsx(
                    commonStyles.newFooterLinkGroup,
                    'newFooterLinkGroup',
                    {
                      [styles.association]: item.mergeNavList.association,
                    }
                  )}
                  data-inspector={`inspector_footer_categoryKey_${item.categoryKey}`}
                >
                  <dt
                    className={clsx(
                      commonStyles.newFooterLinkGroupTitle,
                      'newFooterLinkGroupTitle'
                    )}
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
