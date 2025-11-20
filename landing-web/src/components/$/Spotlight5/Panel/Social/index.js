/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from 'kc-svg-sprite';
import { _t } from 'utils/lang';
import { Icon } from 'antd';
import style from './style.less';

/** key => [iconId, hoverIconId] */
const SOCIAL_MAP = {
  linkedin: ['social-linkedin3-fill', 'social-linkedin3-hover-fill'],
  medium: ['social-medium3-fill', 'social-medium3-hover-fill'],
  telegram: ['social-telegram3-fill', 'social-telegram3-hover-fill'],
  twitter: ['social-twitter3-fill', 'social-twitter3-hover-fill'],
  website: ['social-website3-fill', 'social-website3-hover-fill'],
  whitepaper: ['social-whitepaper3-fill', 'social-whitepaper3-hover-fill'],
};

const iconSize = {
  width: 22,
  height: 22,
};

const Social = ({ currency, iconMap, spotlink, exchange_report_link }) => {
  return (
    <div className={style.socialWrapper}>
      <div className={style.social}>
        {map(iconMap, (url, key) => {
          const [iconId, iconHoverId] = SOCIAL_MAP[key];

          return (
            <a
              key={key}
              className={style.icon}
              href={url}
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
          <a href={exchange_report_link} target="_blank" rel="noopener noreferrer">
            {_t('spotlight.report.kucoin', { coin: currency })}<Icon type="double-right" />
          </a>
        )}
        {spotlink && (
          <a className="ml-30" href={spotlink} target="_blank" rel="noopener noreferrer">
            {currency} {_t('spotlight.report')}<Icon type="double-right" />
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
