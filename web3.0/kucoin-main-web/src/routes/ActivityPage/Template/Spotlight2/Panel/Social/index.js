/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'components/common/KCSvgIcon';
import { _t, addLangToPath } from 'tools/i18n';
import { Icon } from '@kc/ui';
import style from './style.less';
import { useLocale } from '@kucoin-base/i18n';

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
  width: 22,
  height: 22,
};

const Social = ({ currency, iconMap, spotlink, exchange_report_link }) => {
  useLocale();
  return (
    <div className={style.socialWrapper}>
      <div className={style.social}>
        {_.map(iconMap, (url, key) => {
          const [iconId, iconHoverId] = SOCIAL_MAP[key];

          return (
            <a
              key={key}
              className={style.icon}
              href={addLangToPath(url)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon iconId={iconId} style={iconSize} data-role="icon" />
              <SvgIcon iconId={iconHoverId} style={iconSize} data-role="icon-hover" />
            </a>
          );
        })}
      </div>
      <div className={style.report}>
        {exchange_report_link && (
          <a href={addLangToPath(exchange_report_link)} target="_blank" rel="noopener noreferrer">
            {_t('spotlight.report.kucoin', { coin: currency })}
            <Icon type="double-right" />
          </a>
        )}
        {spotlink && (
          <a
            className="ml-30"
            href={addLangToPath(spotlink)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currency} {_t('spotlight.report')}
            <Icon type="double-right" />
          </a>
        )}
      </div>
    </div>
  );
};

Social.propTypes = {
  iconMap: PropTypes.object,
  spotlink: PropTypes.string,
  exchange_report_link: PropTypes.string,
  currency: PropTypes.string,
};

Social.defaultProps = {
  iconMap: {},
  spotlink: '',
  exchange_report_link: '',
  currency: '',
};

export default Social;
