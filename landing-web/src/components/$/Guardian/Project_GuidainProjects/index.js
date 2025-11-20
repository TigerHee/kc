/**
 * Owner: jesse.shao@kupotech.com
 */

import { useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useIsMobile } from 'components/Responsive';
import style from './style.less';
import { _t } from 'utils/lang';
import { TRADE_HOST_CN } from 'utils/siteConfig';
import { useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import RenderCMS from '../RenderCMS';
import { compareVersion } from 'helper';


export default () => {

const { isInApp, appVersion } = useSelector(state => state.app);

  const isMobile = useIsMobile();

  const onJumpApp = useCallback(
    (oldUrl, newUrl) => {
      if (isInApp) {
        const isNewProto = compareVersion(appVersion, '3.18.0') >= 0;
        JsBridge.open({
          type: 'jump',
          params: {
            url: isNewProto ? newUrl : oldUrl,
          },
        });
        return;
      }
      const newTab = window.open();
      newTab.opener = null;
      newTab.location = 'kucoin://';
    },
    [isInApp, appVersion],
  );

  // const

  useEffect(() => {
    let ts = null;
    if(!isMobile) {
      ts = setTimeout(() => {
        const projectLeft = document.querySelector("#project_left");
        if(projectLeft) {
          const target = document.querySelector("#project_right");
          if(target) {
            target.style.maxHeight = projectLeft.getBoundingClientRect().height - 60 + 'px';
          }
        }

      }, 1000);
    }
    return () => {
      if(ts) {
        clearTimeout(ts);
      }
    }
  }, [isMobile]);


  const handleClick = useCallback((e) => {
    const symbol = e.target.dataset.symbol;
    if(!symbol || symbol === 'data-symbol'){
      return;
    }
    if(isInApp) {
      e.preventDefault();
      onJumpApp(`/market?symbol=${symbol || 'BTC-USDT'}`, `/market?symbol=${symbol || 'BTC-USDT'}`)
      // JsBridge.open({
      //   type: 'jump',
      //   params: {
      //     url: `/trade`,
      //   }
      // });
    } else {
      window.open(`${TRADE_HOST_CN}/${symbol || 'BTC-USDT'}`, '_blank');
      window.opener = null;
    }

  }, [isInApp, onJumpApp]);

  const renderChildren = useCallback((cmpt) => {
    console.log('cmpt', cmpt.props.children);
    const len = cmpt.props.children.props.children.length || 1;
    const children = cmpt.props.children || [];

    return (
      <div>
        <div className={style.project_part_title}>{_t('guardian.projects')}({len})</div>
        <div className={style.table_header}>
          <div className={clsx(style.col, style.col_1)}>{_t('guardian.project2')}</div>
          <div className={style.col}>{_t('guardian.trade')}</div>
          <div className={style.col}>{_t('guardian.community')}</div>
        </div>
        <div className={style.table_body}>
          {children}
        </div>
      </div>
    );
  }, []);


  const renderOrgs = useCallback(cmpt => {
    const len = cmpt.props.children.props.children.length || 1;
    return (
      <div>
        <div className={style.project_part_title}>{_t('guardian.institutions')}({len})</div>
        <div className={style.orgs_wrapper}>
          {cmpt}
        </div>
    </div>
    );
  }, []);

  return (
    <div className={clsx(style.part, 'part_wrapper', isMobile ? style.guardian_wrapper_h5 :'')}>
      <div className={clsx(style.title, 'part_title')}>{_t('guardian.supporters')}</div>
      <div className={clsx(style.content, 'part_content')}>
        <div className={clsx(style.project_part, 'project_part')} onClick={handleClick}>
            <RenderCMS
              run="com.landing.project.projects"
              renderChildren={renderChildren}
            />
        </div>
        <div className={clsx(style.project_part, 'project_part')}>
            <RenderCMS
              run="com.landing.project.orgs"
              renderChildren={renderOrgs}
            />
        </div>
      </div>
    </div>
  );
}
