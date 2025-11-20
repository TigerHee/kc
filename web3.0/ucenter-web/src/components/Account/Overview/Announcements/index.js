/**
 * Owner: willen@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { Empty, Spin, styled, Tabs } from '@kux/mui';
import TimeAgoFormat from 'components/common/TimeAgoFormat';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const { Tab } = Tabs;

const AnnouncementsWrapper = styled.div`
  padding: 20px 32px 24px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  margin-bottom: 28px;
  transition: all 0.3s ease;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    padding: 24px 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 20px 20px;
  }
`;

const BoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 11px 0;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;
const ViewMore = styled.a`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
`;

const NewsList = styled.div`
  margin: 0 -12px;
`;

const NewsItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover2};
    border-radius: 12px;
  }
`;
const NewsTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  overflow: hidden;
`;
const NewsTime = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;

const ExtendEmpty = styled(Empty)`
  display: block;
  margin-top: 20px;
`;

const ExtendTabs = styled(Tabs)`
  height: 18px;
  margin-bottom: 12px;
  .KuxTabs-Container {
    padding-top: 0;
  }
  .KuxTabs-indicator {
    display: none;
  }
  .KuxTabs-scrollButton {
    padding-top: 0;
  }
`;

const CATEGORIES = [
  { id: 'latest-announcements', label: _t('eZrciL4Z6G1Nu9wLQgJwZL') },
  { id: 'activities', label: _t('t2cqNkf7T3yCyvmAJMGWtJ') },
  { id: 'new-listings', label: _t('cmkYpEW3KpExb2K5viofns') },
  { id: 'product-updates', label: _t('mYe8F494uZgkYyivwiawqy') },
  { id: 'vip', label: _t('ermRuud5dSd45zYuTZxQG3') },
  { id: 'maintenance-updates', label: _t('tGS8mPRTJvFFYqBb4KEEBj') },
  { id: 'delistings', label: _t('wjNWW6BNJNzXYAB2wsdtZN') },
  { id: 'others', label: _t('uhSifYhuk5ARTLAoj8rzdi') },
];

const OverviewAnnouncements = () => {
  const [activeCategory, setActiveCategory] = useState('latest-announcements');
  const news = useSelector((s) => s.accountOverview.news);
  const loading = useSelector((s) => s.loading);
  const loadingNews = useSelector(
    (state) => state.loading.effects['accountOverview/getNewsByCategories'],
  );
  const dispatch = useDispatch();
  const { isRTL } = useLocale();

  const handleClickCategory = (active) => {
    // 重复点击return;
    if (active === activeCategory || loadingNews) return;
    setActiveCategory(active);
  };

  const fetchNews = (current) => {
    dispatch({
      type: 'accountOverview/getNewsByCategories',
      payload: {
        pageSize: 5,
        page: 1,
        category: current,
      },
    });
  };

  useEffect(() => {
    fetchNews('latest-announcements');
    return () => {
      dispatch({ type: 'accountOverview/update', payload: { news: [] } });
    };
  }, []);

  return (
    <AnnouncementsWrapper data-inspector="account_overview_announcements">
      <BoxHeader>
        <Title>{_t('aaCMuTNp6D7PageQoRwZ1M')}</Title>
        <ViewMore
          target="_blank"
          href={addLangToPath('/announcement')}
          onClick={() => trackClick(['News', 'NewsCenter'])}
        >
          {_t('4Q2i99Wc1z2xWe1NJ6tvF4')}
        </ViewMore>
      </BoxHeader>
      <ExtendTabs
        value={activeCategory}
        onChange={(e, val) => handleClickCategory(val)}
        size="small"
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        {CATEGORIES.map((i) => (
          <Tab key={i.id} value={i.id} label={i.label} onClick={() => fetchNews(i.id)} />
        ))}
      </ExtendTabs>
      {news?.length ? (
        <Spin spinning={loading.effects['accountOverview/getNewsByCategories']} size="small">
          <NewsList>
            {news.map((item) =>
              item.title ? (
                <NewsItem
                  key={item.id}
                  onClick={() => {
                    const { path, is_new_data } = item;
                    const href = is_new_data ? `/announcement${path}` : `/news${path}`;
                    trackClick(['News', '1'], { Name: item.title });
                    window.open(href);
                  }}
                >
                  <NewsTitle>{item.title}</NewsTitle>
                  <NewsTime>
                    <TimeAgoFormat timestamp={item.publish_ts * 1000} />
                  </NewsTime>
                </NewsItem>
              ) : null,
            )}
          </NewsList>
        </Spin>
      ) : (
        <ExtendEmpty size="small" description={_t('hoqk98pcivrSHjEds7SCJP')} />
      )}
    </AnnouncementsWrapper>
  );
};
export default OverviewAnnouncements;
