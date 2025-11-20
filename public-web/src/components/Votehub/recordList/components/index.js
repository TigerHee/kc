/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 18:07:53
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 22:15:38
 * @FilePath: /public-web/src/components/Votehub/recordList/components/index.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Tabs } from '@kux/mui';
import clxs from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ListPageHeader from 'src/components/Votehub/containers/components/ListPageHeader';
import { useIsMobileApp } from 'src/components/Votehub/hooks';
import NominateList from 'src/components/Votehub/recordList/components/NominateList/index.js';
import TicketList from 'src/components/Votehub/recordList/components/TicketList/index.js';
import VoteRecordList from 'src/components/Votehub/recordList/components/VoteRecordList/index.js';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import { skip2Url } from '../../util';
import { BaseContainer, ContentBody, TabBox } from './styled';

const { Tab } = Tabs;

const TYPES = [
  {
    label: _t('rdJk6HZis1PaAmFgnCF47J'),
    value: 1,
  },
  {
    label: _t('jcWpkwP8ooCg1wfjzhy2YJ'),
    value: 2,
  },
  {
    label: _t('3PiTTji1h7mEApu6z9exia'),
    value: 3,
  },
];
// 记录首页
const Index = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const activityStatus = useSelector((state) => state.votehub.activityStatus);
  const isMobileApp = useIsMobileApp();
  const [pageType, setPageType] = useState(1); // 筛选类型
  const handleChangeTab = useCallback((e, value) => {
    setPageType(value);
  }, []);

  const renderPageIndex = useMemo(() => {
    switch (pageType) {
      case 1:
        return <VoteRecordList />;
      case 2:
        return <NominateList />;
      case 3:
        return <TicketList />;
      default:
        return null;
    }
  }, [pageType]);

  const handle2Vote = useCallback(() => {
    skip2Url('/gemvote/voting');
  }, []);

  const { isRTL } = useLocale();
  return (
    <BaseContainer>
      <ListPageHeader title={_t('nrzND6HxSyEV4dCcUThwAh')} />
      <TabBox className={clxs({ h5_TabBox: isMobileApp })}>
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
        {activityStatus === 2 && !isMobileApp && (
          <Button onClick={handle2Vote} type="primary">
            {_t('ips1Y4wuXPd3RaPfoYyRSG')}
          </Button>
        )}
      </TabBox>
      <ContentBody className={clxs({ h5_ContentBody: isMobileApp })}>{renderPageIndex}</ContentBody>
    </BaseContainer>
  );
};
export default Index;
