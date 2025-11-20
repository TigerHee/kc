/**
 * Owner: jessie@kupotech.com
 */
// import JsBridge from '@knb/native-bridge';
import { Empty } from '@kux/mui';
import { map } from 'lodash';
import { memo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import WinIcon from 'static/votehub/win.svg';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../hooks';
import { EmptyWrapper, StyledWinProject, WinProjectContainer } from '../styledComponents';
import Title from './components/Title';
import WinProjectCard from './components/WinProjectCard';

const emptyArr = [];

const WinProjectList = () => {
  const size = useResponsiveSize();
  // const isInApp = JsBridge.isApp();
  const winProjectList = useSelector((state) => state.votehub.winProjectList, shallowEqual);
  const activityStatus = useSelector((state) => state.votehub.activityStatus);

  if (activityStatus !== 3 || !winProjectList?.length) return null;

  return (
    <StyledWinProject>
      <Title title={_t('6PxzKfRdhdPdnfKuZmENnA')} coin={WinIcon} />
      <WinProjectContainer>
        {winProjectList?.length ? (
          <>
            {map(winProjectList, (item, index) => {
              if (!item) {
                return;
              }
              return (
                <div
                  key={`win_project_${index}`}
                  className={`${winProjectList?.length > 1 ? 'multiProjectItem' : ''} projectItem`}
                >
                  <WinProjectCard
                    hot={item?.voteNumber}
                    logoUrl={item?.logoUrl}
                    subName={item?.project}
                    name={item?.currency}
                    description={item?.description}
                    item={item}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <EmptyWrapper>
            <Empty size={size === 'sm' ? 'small' : 'large'} description={_t('table.empty')} />
          </EmptyWrapper>
        )}
      </WinProjectContainer>
    </StyledWinProject>
  );
};

export default memo(WinProjectList);
