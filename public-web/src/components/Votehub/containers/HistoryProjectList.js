/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-03-04 17:56:13
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 11:14:29
 * @FilePath: /public-web/src/components/Votehub/containers/HistoryProjectList.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRightOutlined } from '@kux/icons';
import { Empty } from '@kux/mui';
import { Link } from 'components/Router';
import { map } from 'lodash';
import { memo, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import HistoryIcon from 'static/votehub/history.svg';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../hooks';
import {
  EmptyWrapper,
  HistoryProjectContainer,
  MoreArrow,
  StyledHistoryProject,
} from '../styledComponents';
import HistoryProjectCard from './components/HistoryProjectCard';
import Title from './components/Title';

const emptyArr = [];

const HistoryProjectList = () => {
  const size = useResponsiveSize();
  const isInApp = JsBridge.isApp();
  const nominatedProjectList = useSelector(
    (state) => state.votehub.nominatedProjectList,
    shallowEqual,
  );

  // 页面显示数量
  const showNum = useMemo(() => {
    if (size === 'lg') {
      return 4;
    } else if (size === 'md') {
      return 4;
    } else {
      return 2;
    }
  }, [size]);

  const list = useMemo(() => {
    if (!nominatedProjectList?.length) {
      return emptyArr;
    }
    return nominatedProjectList.slice(0, showNum);
  }, [nominatedProjectList, showNum]);

  if (!list?.length) return null;

  return (
    <StyledHistoryProject data-inspector="inspector_votehub_historically_project_list">
      <Title title={_t('fNRL9Lq2kuwVtWoPfr9geo')} coin={HistoryIcon} />
      <HistoryProjectContainer className={nominatedProjectList?.length > showNum ? '' : 'isMin'}>
        {list?.length ? (
          <>
            {map(list, (item, index) => {
              if (!item) {
                return;
              }
              return (
                <div key={`history_project_${index}`} className="projectItem">
                  <HistoryProjectCard
                    logoUrl={item?.logoUrl}
                    subName={item?.project}
                    name={item?.currency}
                    activityName={item?.activityName}
                    date={item?.winAt}
                    hot={item?.voteNum}
                    symbol={item?.onlineSymbol}
                  />
                </div>
              );
            })}
            {nominatedProjectList?.length > showNum ? (
              <MoreArrow>
                <Link to="/gemvote/history">
                  {_t('jaZkoWDJYteYRwV27EGCY4')}
                  <ICArrowRightOutlined />
                </Link>
              </MoreArrow>
            ) : null}
          </>
        ) : (
          <EmptyWrapper>
            <Empty description={_t('table.empty')} size={size === 'sm' ? 'small' : 'large'} />
          </EmptyWrapper>
        )}
      </HistoryProjectContainer>
    </StyledHistoryProject>
  );
};

export default memo(HistoryProjectList);
