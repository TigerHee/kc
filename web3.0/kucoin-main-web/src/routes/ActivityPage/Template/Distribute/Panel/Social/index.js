/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { _t, addLangToPath } from 'tools/i18n';
import { Icon } from 'antd';
import style from './style.less';
import twitterSVG from 'static/social/twitter-color.svg';
import mediumSVG from 'static/social/medium.svg';
import telegramSVG from 'static/social/telegram.svg';
import { useLocale } from '@kucoin-base/i18n';

/** key => [iconId, hoverIconId] */
const SOCIAL_MAP = {
  telegram: ['social-telegram', telegramSVG],
  twitter: ['social-twitter', twitterSVG],
  medium: ['social-medium', mediumSVG],
  linkedin: ['social-linkedin-fill', null],
  website: ['social-website-fill', null],
  whitepaper: ['social-whitepaper-fill', null],
};

// const iconSize = {
//   width: 22,
//   height: 22,
// };

const Social = ({ currency, iconMap, spotlink }) => {
  useLocale();
  return (
    <div className={style.socialWrapper}>
      <div className={style.social}>
        {_.map(iconMap, (url, key) => {
          const [, com] = SOCIAL_MAP[key];
          if (!com) return null;
          return (
            <a
              key={key}
              className={style.icon}
              href={addLangToPath(url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* <SvgIcon iconId={iconId} style={iconSize} data-role="icon" />
              <SvgIcon iconId={iconHoverId} style={iconSize} data-role="icon-hover" /> */}
              {/* <Icon component={com} /> */}
              <img style={{ width: '20px', height: '20px' }} src={com} alt="key" />
            </a>
          );
        })}
      </div>
      {spotlink && (
        <a
          className={style.report}
          href={addLangToPath(spotlink)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {currency} {_t('spotlight.report')}
          <Icon type="double-right" />
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
