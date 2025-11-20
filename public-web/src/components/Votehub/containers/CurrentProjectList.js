/**
 * Owner: jessie@kupotech.com
 */
// import JsBridge from '@knb/native-bridge';
import { ICArrowRightOutlined } from '@kux/icons';
import { Empty } from '@kux/mui';
import { Link } from 'components/Router';
import { map } from 'lodash';
import { memo, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import StarIcon from 'static/votehub/star.svg';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../hooks';
import {
  CurrentProjectContainer,
  EmptyWrapper,
  MoreArrow,
  StyledCurrentProject,
} from '../styledComponents';
import ProjectCard from './components/ProjectCard';
import Title from './components/Title';

const emptyArr = [];

const CurrentProjectList = () => {
  // const isInApp = JsBridge.isApp();
  const currenctPojectList = useSelector((state) => state.votehub.currenctPojectList, shallowEqual);
  const activityStatus = useSelector((state) => state.votehub.activityStatus);

  const size = useResponsiveSize();

  // 是否显示rank的规则
  const showRank = useMemo(() => {
    if (currenctPojectList?.length && currenctPojectList[0].voteNumber) {
      return true;
    }
    return false;
  }, [currenctPojectList]);

  // 页面显示数量
  const showNum = useMemo(() => {
    if (size === 'lg') {
      return 9;
    } else if (size === 'md') {
      return 8;
    } else {
      return 4;
    }
  }, [size]);

  const list = useMemo(() => {
    if (!currenctPojectList?.length) {
      return emptyArr;
    }
    return currenctPojectList.slice(0, showNum);
  }, [showNum, currenctPojectList]);

  if (activityStatus === 0 || !currenctPojectList?.length) return null;

  return (
    <StyledCurrentProject>
      <Title title={_t('boBzvBpw2ArscPq9LYEFt5')} coin={StarIcon} />
      <CurrentProjectContainer className={currenctPojectList?.length > showNum ? '' : 'isMin'}>
        {list?.length ? (
          <>
            {map(list, (item, index) => {
              if (!item) {
                return;
              }

              const isRank = showRank && index < 3;

              return (
                <div key={`current_project_${index}`} className="projectItem">
                  <ProjectCard
                    isProcessing={true}
                    rank={isRank ? index + 1 : 0}
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
            {currenctPojectList?.length > showNum ? (
              <MoreArrow>
                <Link to="/gemvote/voting">
                  {_t('4p9ha3e3EffeesokyWfNAe')}
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
      </CurrentProjectContainer>
    </StyledCurrentProject>
  );
};

export default memo(CurrentProjectList);
