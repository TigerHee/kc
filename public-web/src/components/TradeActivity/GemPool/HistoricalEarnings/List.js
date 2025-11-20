/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 18:07:53
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-20 21:51:43
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/List.js
 * @Description:
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined } from '@kux/icons';
import { Tabs, useResponsive } from '@kux/mui';
import clxs from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import { locateToUrlInApp } from 'TradeActivity/utils';
import EarningsRecordList from './EarningsRecordList/index.js';
import EarningsSummaryList from './EarningsSummaryList/index.js';
import { BaseContainer, ContentBody, HistoryHeader, LinkWrapper, TabBox } from './styled';

const { Tab } = Tabs;

const TYPES = [
  {
    label: _t('c9077e495cdb4000a179'),
    value: 1,
  },
  {
    label: _t('c538dbcd6cc94000a530'),
    value: 2,
  },
];
// 记录首页
const Index = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));

  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();
  const [pageType, setPageType] = useState(1); // 筛选类型
  const handleChangeTab = useCallback((e, value) => {
    setPageType(value);
  }, []);

  const renderPageIndex = useMemo(() => {
    switch (pageType) {
      case 1:
        return <EarningsRecordList />;
        return null;
      case 2:
        return <EarningsSummaryList />;
      default:
        return null;
    }
  }, [pageType]);

  const handleLocateTo = useCallback(() => {
    locateToUrlInApp('/gempool');
  }, []);

  const { isRTL } = useLocale();
  return (
    <BaseContainer>
      {!isInApp && (
        <HistoryHeader>
          <div className="headerTitle">{_t('62b56b869ea84000a68b')}</div>
          <LinkWrapper
            to="/gempool"
            onClick={handleLocateTo}
            className="goBack"
            dontGoWithHref={isInApp}
          >
            {_t('0dc064ef5c3b4000a277')}
            <ICArrowRightOutlined />
          </LinkWrapper>
        </HistoryHeader>
      )}
      <TabBox
        data-inspector="inspector_gempoolHistoryEarnings_tabs"
        className={clxs({ h5_TabBox: !sm })}
      >
        <Tabs
          direction={isRTL ? 'rtl' : 'ltr'}
          animation={false}
          value={pageType}
          onChange={handleChangeTab}
        >
          {TYPES.map(({ value, label }) => {
            return <Tab value={value} label={label} key={value + label} />;
          })}
        </Tabs>
      </TabBox>

      <ContentBody
        data-inspector="inspector_gempoolHistoryEarnings_list"
        className={clxs({ h5_ContentBody: !sm })}
      >
        {renderPageIndex}
      </ContentBody>
    </BaseContainer>
  );
};
export default memo(Index);
