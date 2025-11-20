/**
 * Owner: brick.fan@kupotech.com
 */
import { styled, Tabs, Tab } from '@kux/mui';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { pullArticleDetail } from 'services/blog';
import { _t } from 'tools/i18n';
import { NEWSLIST } from 'src/components/SecurityMenu/config';
import clsx from 'classnames';
import DefaultImg from 'static/securityV2/light/default.svg';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 140px;
  .news-title {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 36px;
    line-height: 130%;
    text-align: center;
  }
  .news-desc {
    margin-top: 12px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  .tag-item {
    flex-shrink: 0;
    margin: 0 8px 0 0;
    padding: 10px 22px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    background-color: ${({ theme }) => theme.colors.cover2};
    border-radius: 100px;
    cursor: pointer;
    border: none;
    &:last-child {
      margin-right: 0;
    }
  }
  .tag-item-active {
    color: #fff !important;
    background-color: ${({ theme }) =>
      theme.currentTheme === 'light' ? theme.colors.cover : theme.colors.primary};
  }
  .KuxTabs-container {
    margin-top: 40px;
  }
  .news-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 24px;
  }
  .news-item {
    flex-shrink: 0;
    width: calc((100% - 48px) / 3);
    padding-bottom: 24px;
    cursor: pointer;
  }
  .image-wrapper {
    position: relative;
    width: 100%;
    max-height: 220px;
    overflow: hidden;
    background-image: ${(props) => `url(${props.defaultBgImg || DefaultImg})`};
    background-size: 100%;
    border-radius: 8px;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      padding-bottom: calc(100% * 220 / 385);
    }
    ${(props) => props.theme.breakpoints.down('lg')} {
      padding-bottom: calc(100% * 200 / 350);
    }
    @media screen and (max-width: 767px) {
      padding-bottom: calc(100% * 197 / 345);
    }
  }
  .image-title {
    display: -webkit-box;
    margin-top: 12px;
    overflow: hidden;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 20px;
    line-height: 130%;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 100%;
    margin-top: 120px;
    padding: 0 24px;
    .news-title {
      font-size: 28px;
    }
    .news-desc {
      font-size: 12px;
    }
    .tags {
      justify-content: center;
    }
    .tag-item {
      margin-right: 8px;
      padding: 10px 18px;
    }
    .news-item {
      width: calc((100% - 24px) / 2);
    }
    .image-wrapper {
      padding-bottom: calc(100% * 200 / 350);
    }
    .image-title {
      font-size: 18px;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
    margin-top: 60px;
    padding: 0 16px;
    .news-title {
      font-size: 20px;
    }
    .news-desc {
      font-size: 12px;
    }
    .tags {
      justify-content: center;
    }
    .tag-item {
      margin-right: 8px;
      padding: 10px 18px;
      font-size: 14px;
    }
    .news-item {
      width: 100%;
    }
    .image-wrapper {
      padding-bottom: calc(100% * 197 / 345);
    }
    .image-title {
      font-size: 14px;
    }
  }
  .image-desc {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    margin-top: 8px};
    font-size: 12px;
  }
  .image-date {
    color: ${(props) => props.theme.colors.text40};
    text-align: right;
  }
`;

const NewsTag = styled.div`
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  font-style: normal;
  font-weight: 500;
  border-radius: 2px;
  border: 0.5px solid rgba(33, 195, 151, 0.16);
  background: rgba(45, 189, 150, 0.08);
  padding: 1px 4px;
`;

const News = () => {
  const [activeTag, setActiveTag] = useState(NEWSLIST[0].tag);
  const [newsList, setNewsList] = useState(NEWSLIST);
  const [activeNews, setActiveNews] = useState(NEWSLIST[0].news);

  const chooseTag = (event, newValue) => {
    const { tag, news, type } = NEWSLIST[newValue];
    setActiveTag(tag);
    if (news.some((i) => i.key && !i.title)) {
      const keys = [];
      _.forEach(news, (i) => {
        if (i.key) keys.push(i.key);
      });
      Promise.all(keys.map((key) => pullArticleDetail(key)))
        .then((list) => {
          const _news = _.map(news, (ix) => {
            let newItem = ix;
            _.forEach(list, (res, indexxx) => {
              if (res.code === '200' && res.data && ix.path === res.data.path) {
                newItem = res.data;
                return;
              }
            });
            return newItem;
          });
          const _newsList = _.map(newsList, (ix) => {
            if (ix.type === type) {
              return {
                ...ix,
                news: _news,
              };
            }
            return ix;
          });
          setActiveNews(_news);
          setNewsList(_newsList);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setActiveNews(news);
    }
  };

  useEffect(() => {
    chooseTag(null, 0);
  }, []);

  return (
    <Container>
      <div className="news-title">{_t('nSm8sBGT4Ukt1KLSkcc2Go')}</div>
      <div className="news-desc">{_t('pV8KK4kjcDdHw16jJ2fbvu')}</div>
      <Tabs
        value={activeTag}
        onChange={chooseTag}
        variant="bordered"
        bordered={false}
        activeType="default"
        type="normal"
        showScrollButtons={false}
        centeredActive
        size="xlarge"
      >
        {newsList.map((item) => (
          <Tab
            className={clsx('tag-item', { 'tag-item-active': activeTag === item.tag })}
            label={_t(item.tag)}
            key={item.tag}
          />
        ))}
      </Tabs>
      <div className="news-content">
        {_.map(activeNews, (item) => {
          return (
            <a
              className="news-item"
              key={item.path}
              href={item.id ? `/blog${item.path}` : item.path}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="image-wrapper">
                <img
                  alt="kucoin-security-img"
                  src={item.images && item.images.length ? item.images[0] : null}
                />
              </div>
              <div className="image-title">{item.title}</div>
              <div className="image-desc">
                <>
                  {item.tags &&
                    item.tags.map((tag) => {
                      return <NewsTag key={tag}>{tag}</NewsTag>;
                    })}
                </>
                <span className="image-date">{item.publish_at}</span>
              </div>
            </a>
          );
        })}
      </div>
    </Container>
  );
};

export default News;
