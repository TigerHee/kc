/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 18:07:53
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-23 12:15:42
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/SpotlightR8Record/List.js
 * @Description:
 */
import JsBridge from '@knb/native-bridge';
import { Breadcrumb, useResponsive } from '@kux/mui';
import clxs from 'classnames';
import { Link } from 'components/Router';
import { memo } from 'react';
import { shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import RecordList from './RecordList.js';
import { BaseContainer, BreadcrumbWrapper, ContentBody, HistoryHeader } from './styled';
// 申购记录
const Index = () => {
  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();
  const { recordId } = useParams();

  const { tokenName: currencyFullName } = useSelector(
    (state) => state.spotlight8.detailInfo,
    shallowEqual,
  );

  return (
    <BaseContainer>
      {!isInApp && (
        <>
          <BreadcrumbWrapper>
            <Breadcrumb.Item>
              <Link to="/">{_t('home')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/spotlight-center">{_t('vTWw5ibiqesJDwEfga6g1g')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/spotlight_r8/${recordId}`}>{currencyFullName}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{_t('2a183e74427f4000ad5b')}</Breadcrumb.Item>
          </BreadcrumbWrapper>
          <HistoryHeader>
            <div className="headerTitle">{_t('2a183e74427f4000ad5b')}</div>
          </HistoryHeader>
        </>
      )}

      <ContentBody
        data-inspector="inspector_spotlight8_recordList"
        className={clxs({ h5_ContentBody: !sm })}
      >
        <RecordList />
      </ContentBody>
    </BaseContainer>
  );
};
export default memo(Index);
