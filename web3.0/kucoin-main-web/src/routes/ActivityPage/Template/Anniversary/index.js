/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Card } from '@kc/ui';
// import { connect } from 'react-redux';
import { activeItems, banner } from './config';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';
import { addLangToPath } from 'tools/i18n';

const { Meta } = Card;

@injectLocale
export default class Anniversary extends React.Component {
  render() {
    const { currentLang } = this.props;
    const lang = currentLang === 'zh_CN' ? 'cn' : 'en';
    const currentBanner = banner[lang];
    const currentActiveItems = activeItems[lang];
    return (
      <div className={style.activityWrapper} data-inspector="activity_anniversary_page">
        <a
          className={style.bannerWrapper}
          href={addLangToPath(currentBanner.url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="" src={currentBanner.img} />
          <div className={style.bannerTitle}>{currentBanner.title}</div>
          <div className={style.bannerDescription}>{currentBanner.description}</div>
        </a>
        <div className={style.activityGroup}>
          {currentActiveItems.map(({ img, title, date, url }, index) => {
            return (
              <div className={style.activeItem} key={index}>
                <a
                  href={addLangToPath(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ float: index % 2 === 0 ? 'left' : 'right' }}
                >
                  <Card
                    hoverable
                    bordered={!1}
                    style={{ width: 540 }}
                    cover={<img alt={title} src={img} />}
                  >
                    <Meta title={title} description={date} />
                  </Card>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
