/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useEffect } from 'react';
import {
  NewsWrapper,
  NewsTitle,
  NewsContent,
  NewsItem,
  NewsItemContent,
  NewsItemTitle,
  NewsItemTime,
  NewsMore,
  EmptyPro,
} from './style';
import { _t, _tHTML, getHrefProps } from 'utils/lang';
import { concatPath, showDatetime } from 'helper';
import { getNews } from 'services/homepage';
import { useSelector } from 'dva';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';
import { useResponsive } from '@kux/mui';

/**
 * Overlay
 */
const Overlay = (props) => {
  const { data, ...restProps } = props;
  const lang = useSelector((state) => state.app.currentLang);
  const screens = useResponsive();
  const { sm } = screens;

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await getNews({ pageSize: 3, lang });
      if (res && res.code === '200') {
        setNews(
          (res.items || []).sort((a, b) => {
            return a.stick - b.stick;
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // 执行初始化操作
  useEffect(() => {
    getData();
  }, []);

  return (
    <NewsWrapper {...restProps}>
      {sm && <NewsTitle>{_t('nav.topNews.tip')}</NewsTitle>}
      <Spin spinning={loading}>
        <NewsContent>
          {news?.length ? (
            news?.map(({ id, title, path, publish_ts }) => (
              <NewsItem
                key={id}
                href={getHrefProps(concatPath('/news', path))}
                target="_blank"
              >
                <NewsItemContent>
                  <NewsItemTitle>{title}</NewsItemTitle>
                    <NewsItemTime>
                      {!!publish_ts && showDatetime(publish_ts * 1000, 'MM-DD')}
                    </NewsItemTime>
                </NewsItemContent>
              </NewsItem>
            ))
          ) : (
            <EmptyPro>
              <Empty />
            </EmptyPro>
          )}
        </NewsContent>
      </Spin>
      <NewsMore href={getHrefProps(concatPath('/news'))} target="_blank">
        {_t('view.more')}
      </NewsMore>
    </NewsWrapper>
  );
};

export default memo(Overlay);
