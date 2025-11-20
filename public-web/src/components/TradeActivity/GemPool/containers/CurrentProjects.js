/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { memo } from 'react';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import emptyData from 'static/gempool/emptyData.png';
import emptyDataDark from 'static/gempool/emptyDataDark.png';
import { _t } from 'tools/i18n';
import { POOL_STATUS } from '../config';
import ProjectItem from './ProjectItem';
import QuestionModal from './QuestionModal';
import StakingModal from './StakingModal';
import StatusModal from './StatusModal';
import TaskModal from './TaskModal';

export const StyledCurrent = styled.section`
  margin-bottom: 64px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 80px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 120px;
  }
`;

export const ListWrapper = styled.div``;

export const EntranceWrapper = styled.div`
  display: inline-flex;
  padding: 5px 7px;
  align-items: center;
  border-radius: 24px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.text};
  cursor: pointer;
  justify-content: center;
  line-height: 1.3;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: auto;
    justify-content: initial;
  }
  .icons {
    display: inline-flex;
    align-items: center;
    margin-right: 3px;

    img {
      // 1px 边框
      width: 18px;
      height: 18px;
      margin-left: -5px;
      object-fit: cover;
      background: ${(props) => props.theme.colors.overlay};
      border: 1px solid ${(props) => props.theme.colors.overlay};
      border-radius: 18px;
      &:first-of-type {
        margin-left: -1px;
      }
    }
  }

  .text {
    max-width: 130px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 12px;
    font-style: normal;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .text {
      max-width: 140px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 7px 18px;
    .text {
      max-width: 160px;
      font-size: 14px;
    }
  }
`;

export const CurrentItemWrapper = styled.div`
  margin-top: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;

export const TitleWrapper = styled.h2`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin: 0;

  .title {
    display: flex;
    align-items: center;
    margin-right: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 130%;
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      transform: rotateY(0deg);
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;

    .title {
      font-size: 24px;
      img {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
    }
    .right {
      .KuxDivider-vertical {
        margin: 0 16px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
    .title {
      font-weight: 600;
      font-size: 36px;
      img {
        width: 48px;
        height: 48px;
      }
    }
    .right {
      .KuxDivider-vertical {
        margin: 0 24px;
      }
    }
  }
`;


export const EmptyWrapper = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  padding: 24px 16px 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  justify-content: center;
  color: ${(props) => props.theme.colors.text40};

  img {
    width: 40px;
    height: 40px;
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 32px 24px 0;
    font-size: 20px;
    img {
      width: 64px;
      height: 64px;
      margin-right: 12px;
    }
  }
`;

export function EmptyRecord({ currentTheme }) {
  return (
    <EmptyWrapper>
      <LazyImg src={currentTheme === 'dark' ? emptyDataDark : emptyData} alt="empty" />
      {_t('new.currency.empty')}
    </EmptyWrapper>
  )
}

function CurrentProjects({ list }) {
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  return (
    <>
      <StyledCurrent data-inspector="inspector_gempool_current_projects">
        <ListWrapper>
          {list?.length ? (
            list?.map((item) => {
              if (item && item.status !== POOL_STATUS.COMPLETED) {
                return (
                  <CurrentItemWrapper key={item?.campaignId}>
                    <ProjectItem {...item} showTopCountdown />
                  </CurrentItemWrapper>
                );
              }
            })
          ) : (
            <EmptyRecord currentTheme={currentTheme} />
          )}
        </ListWrapper>
      </StyledCurrent>
      <StakingModal />
      <QuestionModal />
      <TaskModal />
      <StatusModal />
    </>
  );
}

export default memo(CurrentProjects);
