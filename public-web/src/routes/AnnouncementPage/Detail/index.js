/**
 * Owner: mcqueen@kupotech.com
 */

import { injectLocale } from '@kucoin-base/i18n';
import { showDatetime } from 'helper';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { matchReg } from 'utils/seoTools';
import {
  replaceHelpCenterUrl,
  replaceKucoinLink,
  replaceOldOrigin,
  replacezhHans2zhHant,
  resolveArticalLinks,
} from 'utils/tool';
import style from './style.less';

// import Head from 'components/NextHead';
import ArticleJson from 'components/Seo/ArticleJson';
import OgImage from 'components/Seo/OgImage';
import { useHtmlToReact } from 'hooks';

@connect((state) => {
  // const isloading = state.loading.effects['news/pullDetail'];
  return {
    articleDetail: state.announcement.articleDetail,
    // 这里的 heads 是空对象，没有 update 的地方。这个 heads 没有存在的意义
    // heads: state.components.head,
    breadPrePath: state.announcement.breadPrePath,
    // isloading,
  };
})
@injectLocale
export default class Article extends React.Component {
  /**
   * 拼接原有的title 以及meta[description]
   *
   * @return  {[type]}  [return description]
   */
  createArticleJson = () => {
    const { articleDetail } = this.props;
    if (articleDetail?.id) {
      const { images, first_publish_at, publish_at, title } = articleDetail;
      const param = {
        images,
        title,
      };
      if (publish_at) {
        param.dateModified = moment(publish_at).format();
      }
      if (first_publish_at) {
        param.datePublished = moment(first_publish_at * 1000).format();
      }
      return param;
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'announcement/update', payload: { pageType: 'detail' } });
  }

  componentDidUpdate(preProps) {
    // article tdk参数
    const { articleDetail: pre = {} } = preProps || {};
    const { articleDetail: current = {}, currentLang } = this.props || {};
    if (pre.id !== current.id && current.id) {
      const { title, content = '' } = current;
      const titleTdk = `${title}| KuCoin`;
      const description = matchReg(content).substring(0, 160);
      import('@kc/tdk').then(({ default: tdkManager }) => {
        tdkManager.handleUpdateTdk(currentLang, {
          title: titleTdk,
          description,
          keywords: titleTdk,
        });
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'announcement/update',
      payload: {
        articleDetail: {},
      },
    });
  }

  render() {
    const { articleDetail } = this.props;
    const { title, publish_ts, categories } = articleDetail || {};

    const jsonArticle = this.createArticleJson();

    return (
      <div className={style.container} data-inspector="legal_independent_page">
        <div className={style.wrapper_idp}>
          <div className={style.article}>
            {!!articleDetail?.images?.length && <OgImage imgSrc={articleDetail.images[0]} />}
            {jsonArticle ? <ArticleJson article={jsonArticle} type="NewsArticle" /> : null}
            <h1>{title}</h1>
            <div className={style.time}>
              <span>{publish_ts ? showDatetime(publish_ts * 1000) : ''}</span>
            </div>
            <div className={style.content}>
              <div className={style['kucoin-article']}>
                <RenderNews articleDetail={articleDetail} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RenderNews = (props) => {
  const { articleDetail } = props;
  function resolveArticalUrl(articleDetail) {
    let { content } = articleDetail || {};
    if (!content) {
      return content;
    }
    // 针对 kucoin-info 特殊处理 kucoin 内链
    if (
      articleDetail?.paths?.default === '/kucoin-info-privacy-policy' ||
      articleDetail?.paths?.default === '/kucoin-info-terms-of-use'
    ) {
      content = replaceKucoinLink(content);
    }
    // 替换 support.kucoin.plus 和 kucoin.zendesk.com 的链接
    const contentRe = replaceHelpCenterUrl(content);
    // 旧域名替换
    const newOriginContent = replaceOldOrigin(contentRe);
    // 简体中文路由换成繁体中文
    const newContent = replacezhHans2zhHant(newOriginContent);
    // 由于json文件原因，需要对内容中的链接做处理，以便当域名发生改变后能正常跳转
    return resolveArticalLinks(newContent);
  }
  const { eles } = useHtmlToReact({ html: resolveArticalUrl(articleDetail) });
  return <div data-inspector="article-detail">{eles}</div>;
};
