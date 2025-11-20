/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined, ICSuccessOutlined, ICArrowDownOutlined, ICCopyOutlined } from '@kux/icons';
import { NumberFormat, styled, numberFormat, Button, useResponsive, useSnackbar } from '@kux/mui';
import { useCallback, useMemo } from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import LazyImg from 'src/components/common/LazyImg';
import { ReactComponent as DoubleArrowIcon } from 'static/gempool/doubleArrow.svg';
import inviteIcon from 'static/gempool/invite_user.svg';
import growthIcon from 'static/gempool/growth_icon.svg';
import { _t, _tHTML } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import { useSelector } from 'src/hooks/useSelector';
import { getShareLink } from 'src/utils/getUtm';
import CopyToClipboard from 'react-copy-to-clipboard';
import { KCS_LEVEL_ICONS, TASK_CONTENT_CONFIG, VIP_ICONS } from '../config';
import { InviteUserSteps } from '../ProjectDetail/containers/InviteUserSteps'

const ContentWrapper = styled.div`
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 20px;
  }
`;

const ListWrapper = styled.div`
  .done-list-title {
    font-size: 14px;
    color: ${(props) => props.theme.colors.text40};
    padding-bottom: 12px;

    &.has-border {
      margin-top: 12px;
      padding-top: 12px;
      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-top: 20px;
        padding-top: 12px;
      }
    }
  }
`;
const BtnWrapper = styled.span`
  cursor: pointer;
  transform: rotate(0deg);
  [dir='rtl'] & {
    transform: rotate(180deg);
  }
`;

const TaskItemWrapper = styled.div`
  border-radius: 12px;
  background: none;
  border: 1px solid
    ${(props) => (!props.taskState ? props.theme.colors.cover8 : props.theme.colors.primary12)};
  padding: 16px;
  margin-bottom: 12px;

  .main-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .invite-task {
    width: 100%;
  }
  &.inviteTaskItem {
    border: 1px solid ${(props) => props.theme.colors.primary40};
    background: linear-gradient(180deg, rgba(127, 252, 167, 0.14) 0%, rgba(127, 252, 167, 0.00) 50.28%);
    padding: 12px 16px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 16px;
    }

  }
  .invite-progress-info {
    margin-top: 16px;
  }

  .KuxButton-containedSizeMini {
    color: ${(props) => props.theme.currentTheme === 'light' ? '#fff' : '#1d1d1d'};
  }

  input:checked + div svg {
    transform: rotate(180deg);
  }

  .highlight {
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  .title-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    margin-right: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    svg {
      width: 16px;
      min-width: 16px;
      height: 16px;
      margin-right: 4px;
      color: ${(props) => props.theme.colors.primary};
    }
    .inviteTaskTitle {
      width: 100%;
      display:flex;
      justify-content: space-between;
      align-items: center;
      .highlight {
        font-size: 16px;
        font-weight: 600;
        ${(props) => props.theme.breakpoints.up('sm')} {
          font-size: 20px;
          font-weight: 700;
        }
        &::before {
          display: inline-block;
          width: 12px;
          height: 12px;
          content: '';
          margin-right: 2px;
          background: url("${growthIcon}") no-repeat;
        }
      }
      .btn {
        display: inline-flex;
        &.invite-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 16px;
          width: 24px;
          height: 24px;
          color: ${(props) => props.theme.colors.backgroundMajor};
          background: ${(props) => props.theme.colors.text};
          border-radius: 24px;
          svg {
            width: 12px;
            height: 12px;
            margin-right: 0;
            color: ${(props) => props.theme.colors.backgroundMajor};
          }
        }
      }
      ${(props) => props.theme.breakpoints.down('sm')} {
        > span:first-of-type {
          flex: 1;
        }
      }
    }
    .inviteBtn {
      margin-left: 20px;
      img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
    }
    .title {
      font-weight: 500;
      &.blod {
        width: 100%;
        font-weight: 500;
      }
      ${(props) => props.theme.breakpoints.up('sm')} {
        font-weight: 400;
      }
    }
  }
  .invite-subtitle {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
    margin-top: 8px;

    .percent {
      font-weight: 600;
      padding: 0 4px;
      color: ${(props) => props.theme.colors.text};

      &.highlight {
        color: ${(props) => props.theme.colors.primary};
      }
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .resultWrapper {
    display: inline-flex;
    align-items: center;
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    img {
      width: 28px;
      height: 20px;
      margin-right: 8px;

      &.vip {
        width: 20px;
        height: 20px;
      }
    }

    button {
      flex-shrink: 1;
      line-height: 1.1;
    }

    .rightLogo {
      cursor: pointer;
      color: ${props => props.theme.colors.icon};
    }

    .doubleArrow {
      margin-right: 8px;
    }

    .greyText {
      margin: 0 4px 0 -4px;
      color: ${(props) => props.theme.colors.text30};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }

    .light {
      opacity: 0.4;
    }

    .grey {
      color: ${(props) => props.theme.colors.text30};
    }
    svg {
      width: 16px;
      height: 16px;
      // margin-right: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: ${(props) => props.theme.colors.backgroundMajor};
      background: ${(props) => props.theme.colors.text};
      border-radius: 24px;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    .resultWrapper .btn {
      width: 24px;
      height: 24px;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const InviteTaskTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
  .highlightBlod {
    margin-left: 4px;
    font-size: 16px;
    font-weight: 700;
  }
`;

const TaskContent = ({ list, questionId, onClose, inviteBonusLevel }) => {
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const isSm = !sm;
  const referralCode = useSelector((state) => state.user.referralCode);
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const handleParticipate = useCallback(() => {
    onClose && onClose();
    if (questionId) {
      dispatch({
        type: 'gempool/update',
        payload: {
          questionId,
        },
      });
    }
    dispatch({
      type: 'gempool/update',
      payload: {
        questionModal: true,
      },
    });
  }, [dispatch, questionId, onClose]);

  const taskGroup = useMemo(() => {
    if (!list || !list.length) return {
      done: [],
      undone: [],
    };
    const done = list.filter((item) => item.taskState);
    const undone = list.filter((item) => !item.taskState);
    return {
      done,
      undone,
    };
  }, [list]);

  const undoneTaskList = useMemo(() => {
    return generateTaskList(
      taskGroup.undone,
      currentLang,
      handleParticipate,
      inviteBonusLevel,
      message,
      referralCode,
      isSm,
    );
  }, [taskGroup.undone, currentLang, handleParticipate, message, referralCode, inviteBonusLevel, isSm]);

  const doneTaskList = useMemo(() => {
    return generateTaskList(
      taskGroup.done,
      currentLang,
      handleParticipate,
      inviteBonusLevel,
      message,
      referralCode,
      isSm,
      true,
    );
  }
  , [taskGroup.done, currentLang, handleParticipate, message, referralCode, inviteBonusLevel, isSm]);

  const campaignId = useSelector(state => state.gempool.questionId, shallowEqual) || {};
  const taskMap = useSelector(state => state.gempool.tasksMap, shallowEqual) || {};
  const {
    userBonusCoefficient: taskUserBonusCoefficient,
  } = taskMap[campaignId] || {};


  return (
    <ContentWrapper>
      <InviteTaskTitle>
        {_tHTML('4053d4740c714800a923', {
          total: taskUserBonusCoefficient ? numberFormat({
            number: taskUserBonusCoefficient,
            lang: currentLang,
            options: {
              style: 'percent',
            },
          }) : '--'
        })}
      </InviteTaskTitle>
      <ListWrapper>
        {undoneTaskList}
        {
          taskGroup.done.length > 0 ? (
            <>
            <div className={"done-list-title" + (taskGroup.undone.length > 0 ? ' has-border' : '') }>
              {_t('90e72e8c33894000a6da', {
                num: taskGroup.done.length,
              })}
            </div>
            {doneTaskList}
            </>
          ) : null
        }
      </ListWrapper>
    </ContentWrapper>
  );
};

export default TaskContent;

function generateTaskList(tasks, currentLang, handleParticipate, inviteBonusLevel, message, referralCode, isSm, isDone = false) {
  if (!tasks || !tasks.length) {
    return null;
  }
  // input checkbox id 后缀, 避免重复
  // id 重复会导致 label 点击无效
  const idSuffix = Date.now();
  return tasks.map((item, index) => {
    if (!item || !TASK_CONTENT_CONFIG[item.taskType]) return null;

    const { taskState, taskType, vipLevel, kcsLevel, bonusCoefficient } = item;
    const taskConfig = TASK_CONTENT_CONFIG[taskType];
    let title = ''
    let operatorComp = null;
    let subTitle = null;
    let extraContent = null;

    if (taskType === 0) {
      // 0--考题
      operatorComp = taskState ? (
        <>
          <DoubleArrowIcon className="doubleArrow" />
          <NumberFormat
            lang={currentLang}
            options={{
              style: 'percent',
              maximumFractionDigits: 2,
            }}
            isPositive={true}
          >
            {bonusCoefficient}
          </NumberFormat>
        </>
      ) : (
        isSm ? (
          <BtnWrapper className="btn" onClick={handleParticipate}>
            <ICArrowRightOutlined />
          </BtnWrapper>
        ): <Button size="mini" onClick={handleParticipate}>{_t('agXGsQUJwvRgLaFTEkSHXg')}</Button>
      );
    } else if (taskType === 1) {
      // 1--VIP
      operatorComp = !!VIP_ICONS[vipLevel] ? (
        <>
          <LazyImg src={VIP_ICONS[vipLevel]} alt="vip" />
          <NumberFormat
            lang={currentLang}
            options={{
              style: 'percent',
              maximumFractionDigits: 2,
            }}
            isPositive={true}
          >
            {bonusCoefficient}
          </NumberFormat>
        </>
      ) : null;
    } else if (taskType === 2) {
      // 2--KCS加成
      if (kcsLevel === 0) {
        operatorComp = (
          <>
            <LazyImg src={KCS_LEVEL_ICONS[0]} alt="vip" className="vip light" />
            <span className="greyText">{_t('bd2b89dbd9a54000af5e')}</span>
            <span className={+bonusCoefficient > 0 ? '' : 'grey'}>
              <NumberFormat
                lang={currentLang}
                options={{
                  style: 'percent',
                  maximumFractionDigits: 2,
                }}
                isPositive={true}
              >
                {bonusCoefficient}
              </NumberFormat>
            </span>
          </>
        );
      } else {
        const kcsItem = KCS_LEVEL_ICONS[kcsLevel - 1];
        if (!kcsItem) {
          operatorComp = null;
        } else {
          operatorComp = (
            <>
              <LazyImg src={kcsItem} alt="vip" className="vip" />
              <NumberFormat
                lang={currentLang}
                options={{
                  style: 'percent',
                  maximumFractionDigits: 2,
                }}
                isPositive={true}
              >
                {bonusCoefficient}
              </NumberFormat>
              <ICArrowRightOutlined onClick={() => locateToUrl('/kcs')} className="rightLogo" />
            </>
          );
        }
      }
    } else if (taskType === 3) {
      // 3--邀请用户
      title = <div className='inviteTaskTitle'>
        {_tHTML('a79c53a0cbbc4000ab7b', {
          percent: numberFormat({
            number: item?.maxBonusCoefficient || '0',
            lang: currentLang,
            options: {
              style: 'percent',
            },
          })
        })}
        <CopyToClipboard
          text={getShareLink({ rcode: referralCode })}
          onCopy={() => {
            message.success(_t('afb1ecf83b964000a45c'));
          }}
        >
          {
            isSm ? (
              <BtnWrapper className="btn invite-btn">
                <ICCopyOutlined />
              </BtnWrapper>
            ) : (
              // 邀请好友
              <Button size="mini" className='inviteBtn'>
                <img src={inviteIcon} alt="invite-icon" />
                {_t('43fcc9080a494000a786')}
              </Button>
            )
          }
        </CopyToClipboard>
      </div>;
      // 3--邀请用户
      operatorComp = null;
      const hasBonus = !!Number(item.bonusCoefficient);
      subTitle = null;
      extraContent = <InviteUserSteps
        inDialog
        className='invite-progress-info'
        inviteBonusLevel={inviteBonusLevel ||[]}
        invitedUser={item.inviteActivityPeopleNumber}
        />;

    }
    return (
      <>
        <TaskItemWrapper key={`task_${index}`} taskState={taskState} className={clsx({ 'inviteTaskItem': taskType === 3 })}>
          <input type="checkbox" id={'bonus-task-'+item.taskId+'-'+idSuffix} style={{display: 'none'}} />
          <div className={clsx('main-content', { 'invite-task': taskType === 3 })}>
            <div className={clsx('contentWrapper', { 'invite-task': taskType === 3 })}>
              <div className={clsx('title-wrapper', { 'invite-task': taskType === 3 })}>
                {taskState ? <ICSuccessOutlined /> : null}
                <div className={`title ${isDone || item.taskType === 3 ? 'blod' : ''}`}> {title || taskConfig.title({
                  maxBonusCoefficient: numberFormat({
                    number: item.maxBonusCoefficient || '0',
                    lang: currentLang,
                    options: {
                      style: 'percent',
                    },
                  })
                })}</div>
              </div>
              {subTitle}
            </div>
            <div className="resultWrapper">{operatorComp}</div>
          </div>
          {extraContent}
        </TaskItemWrapper>
      </>
    );
  });
}


