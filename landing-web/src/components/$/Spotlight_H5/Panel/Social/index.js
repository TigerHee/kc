/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'kc-svg-sprite';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import { Icon } from 'antd';
import { px2rem } from 'helper';
import JsBridge from 'utils/jsBridge';
import style from './style.less';

/** key => [iconId, hoverIconId] */
const SOCIAL_MAP = {
  linkedin: ['social-linkedin-fill', 'social-linkedin-hover-fill'],
  medium: ['social-medium-fill', 'social-medium-hover-fill'],
  telegram: ['social-telegram-fill', 'social-telegram-hover-fill'],
  twitter: ['social-twitter-fill', 'social-twitter-hover-fill'],
  website: ['social-website-fill', 'social-website-hover-fill'],
  whitepaper: ['social-whitepaper-fill', 'social-whitepaper-hover-fill'],
};

const iconSize = {
  width: px2rem(22),
  height: px2rem(22),
};

const Social = ({ currency, iconMap, spotlink }) => {
  const isInApp = useSelector(state => state.app.isInApp);

  const handleClick = useCallback((url, evt) => {
    evt.preventDefault();
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${url}`,
        }
      });
      return;
    }
    window.open(url, '_blank');
  }, [isInApp]);

  return (
    <div className={style.socialWrapper}>
      <div className={style.social}>
        {map(iconMap, (url, key) => {
          const [iconId, iconHoverId] = SOCIAL_MAP[key];

          return (
            <a
              key={key}
              className={style.icon}
              // href={url}
              href="#new-page"
              onClick={(e) => handleClick(url, e)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon iconId={iconId} style={iconSize} data-role="icon" />
              <SvgIcon iconId={iconHoverId} style={iconSize} data-role="icon-hover" />
            </a>
          );
        })}
      </div>
      {spotlink && (
        <a
          className={style.report}
          // href={spotlink}
          href="#new-page"
          onClick={(e) => handleClick(spotlink, e)}
          target="_blank"
          rel="noopener noreferrer">
          {currency} {_t('spotlight.report')}<Icon type="double-right" />
        </a>
      )}
    </div>
  );
};

Social.propTypes = {
  iconMap: PropTypes.object,
  spotlink: PropTypes.string,
  currency: PropTypes.string,
};

Social.defaultProps = {
  iconMap: {},
  spotlink: '',
  currency: '',
};

export default Social;
