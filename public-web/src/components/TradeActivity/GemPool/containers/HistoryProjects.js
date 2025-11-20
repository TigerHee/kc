/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { Link } from 'components/Router';
import { memo, useCallback } from 'react';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from '../../utils';
import { POOL_STATUS } from '../config';
import ProjectItem from './ProjectItem';
import { EmptyRecord } from './CurrentProjects';

const StyledHistory = styled.section`
  margin-bottom: 64px;
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 120px;
  }
`;
const HistoryListWrapper = styled.div``;
const HistoryItemWrapper = styled.div`
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;


const MoreWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    cursor: pointer;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-left: 8px;
      border: 1px solid ${(props) => props.theme.colors.cover16};
      border-radius: 16px;

      svg {
        width: 16px;
        height: 16px;
        color: ${(props) => props.theme.colors.text};
        transform: rotate(180deg);
        [dir='rtl'] & {
          transform: rotate(0deg);
        }
      }
    }
  }
`;

function HistoryProjects({ historyRecords }) {
  const isInApp = JsBridge.isApp();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const { items } = historyRecords || {};


  const handleLocateTo = useCallback(() => {
    locateToUrlInApp('/gempool/history');
  }, []);

  if (!items?.length) {
    return (
      <StyledHistory data-inspector="inspector_gempool_history_projects">
        <EmptyRecord currentTheme={currentTheme} />
      </StyledHistory>
    );
  }

  return (
    <StyledHistory data-inspector="inspector_gempool_history_projects">
      <HistoryListWrapper>
        {items?.slice(0, 2)?.map((item) => {
          return (
            <HistoryItemWrapper key={item?.campaignId}>
              <ProjectItem {...item} status={POOL_STATUS.COMPLETED} />
            </HistoryItemWrapper>
          );
        })}
      </HistoryListWrapper>
      <MoreWrapper>
        <Link to="/gempool/history" onClick={handleLocateTo} dontGoWithHref={isInApp}>
          {_t('2YyXGzmRgscwyygscEYUgi')}
          <span className="icon">
            <ICArrowLeft2Outlined />
          </span>
        </Link>
      </MoreWrapper>
    </StyledHistory>
  );
}

export default memo(HistoryProjects);
