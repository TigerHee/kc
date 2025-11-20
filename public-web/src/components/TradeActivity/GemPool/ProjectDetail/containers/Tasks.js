/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICArrowRightOutlined, ICArrowDownOutlined } from '@kux/icons';
import { Button, numberFormat, NumberFormat, styled, useResponsive, useSnackbar } from '@kux/mui';
import { Link } from 'components/Router';
import moment from 'moment';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import tipBgIcon from 'static/gempool/staking_tip_bg.svg';
import { ReactComponent as DoubleArrowIcon } from 'static/gempool/doubleArrow.svg';
import doubleArrowDark from 'static/gempool/doubleArrowDark.svg';
import doubleArrowLight from 'static/gempool/doubleArrowLight.svg';
import logo3 from 'static/gempool/giftbox.svg';
import taskMask from 'static/gempool/taskMask.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import { push } from 'utils/router';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getShareLink } from 'src/utils/getUtm';
import { InviteUserSteps } from './InviteUserSteps'
import { KCS_LEVEL_ICONS, POOL_STATUS, TASK_CONTENT_CONFIG, VIP_ICONS } from '../../config';
import AnchorPlaceholder from './AnchorPlaceholder';
const { KUCOIN_HOST } = siteCfg;

const StyledCurrent = styled.section`
  position: relative;
  margin-bottom: 64px;

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 80px;
  }
`;

const ListWrapper = styled.div``;

const TaskItemWrapper = styled.div`
  border-radius: 16px;
  background: ${(props) => props.theme.colors.cover2};
  padding: 32px;
  margin-bottom: 16px;

  .main-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .invite-progress-info {
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid ${(props) => props.theme.colors.divider4};
  }

  input:checked + div svg {
    transform: rotate(180deg);
  }

  .contentWrapper {
    .title {
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
    }
    .desc {
      margin-top: 14px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .rateWrapper, .highlight {
        display: inline-flex;
        align-items: center;
        height: 18px;
        padding: 0px 6px;
        color: ${(props) => props.theme.colors.textEmphasis};
        font-weight: 600;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
        background: ${(props) => props.theme.colors.textPrimary};
        border-radius: 10px;

        img {
          width: 12px;
          height: 12px;
          margin-right: 3px;
        }
      }
      .highlight {
        padding-left: 21px;
        background: ${(props) => props.theme.colors.textPrimary} url(${(props) => props.theme.currentTheme === 'dark' ? doubleArrowDark: doubleArrowLight }) no-repeat;
        background-position: left 6px center;
        background-size: 12px 12px;
      }
    }
  }

  .resultWrapper {
    display: inline-flex;
    align-items: center;
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 18px;
    font-style: normal;
    line-height: 130%;

    .invite-subtitle {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 16px;
      margin-right: 16px;
      cursor: pointer;

      .percent {
        font-weight: 600;
        color: ${(props) => props.theme.colors.text};
        padding: 0 4px;

        &.highlight {
          color: ${(props) => props.theme.colors.primary};
        }
      }
    }

    .light {
      opacity: 0.4;
    }

    .greyText {
      margin: 0 4px 0 -4px;
      color: ${(props) => props.theme.colors.text30};
      font-weight: 500;
      font-style: normal;
      line-height: 130%;
    }

    .grey {
      color: ${(props) => props.theme.colors.text30};
    }

    img {
      width: 40px;
      height: 28px;
      margin-right: 12px;

      &.vip {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }

    svg {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .rightLogo {
      cursor: pointer;
    }
  }
`;

const TitleWrapper = styled.h2`
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
    }
  }

  .right {
    display: flex;
    align-items: center;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 24px;
    padding: 0;

    .title {
      font-size: 24px;
      img {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 40px;
    padding: 0;
    .title {
      font-weight: 600;
      font-size: 36px;
      img {
        width: 48px;
        height: 48px;
      }
    }
  }
`;
const TaskEntranceWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 23px;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.colors.primary12};
  background: ${(props) => props.theme.colors.primary4};
  margin-top: 24px;
  .tipBgIcon {
    position: absolute;
    width: 120px;
    height: 150%;
    z-index: 0;
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: block;
      width: 75px;
      left: 158px;
    }
  }
  .mask {
    position: absolute;
    top: 0;
    left: 88px;
    height: 100%;
    ${(props) => props.theme.breakpoints.up('lg')} {
      left: 160px;
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin-right: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    svg {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      transform: rotate(0deg);
      [dir='rtl'] & {
        transform: rotate(180deg);
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
  }

  .highlight {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
  }
`;
const H5TaskEntranceWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 32px;
  padding: 0 16px;
  position: relative;
  overflow: hidden;
  .tipBgIcon {
    position: absolute;
    width: 120px;
    height: 150%;
    z-index: 0;
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: block;
      width: 75px;
      left: 158px;
    }
  }
  .container {
    position: relative;
    display: flex;
    align-items: center;
    padding: 7px 11px;
    background: ${(props) => props.theme.colors.primary4};
    border: 1px solid ${(props) => props.theme.colors.primary12};
    border-radius: 16px;
    img {
      width: 20px;
      height: 20px;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      color: ${(props) => props.theme.colors.text};
      font-size: 12px;
      font-weight: 500;
      margin-left: 10px;
    }
    .btnGroup {
      margin-top: 2px;
      display:flex;
      align-items: center;
      color: ${(props) => props.theme.colors.primary};
      svg {
        margin-left: 4px;
        [dir=rtl] & {
          transform: scale(-1);
        }
      }
    }
    .highlight {
      color: ${(props) => props.theme.colors.primary};
    }
    .title {
      display: flex;
      flex: 1;
      align-items: center;
      margin-right: 16px;
      .text {
        flex: 1;
      }
      .name {
        margin-bottom: 2px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 500;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
      }
      .desc {
        color: ${(props) => props.theme.colors.textPrimary};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
      }
    }

    .right {
      width: 16px;
      height: 16px;
      color: ${(props) => props.theme.colors.textPrimary};
      transform: rotate(0deg);
      [dir='rtl'] & {
        transform: rotate(180deg);
      }
    }
  }
`;

export function TaskEntrance() {
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { currentLang } = useLocale();

  const isSm = !sm;
  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);
  const user = useSelector((state) => state.user.user, shallowEqual);

  const { openBonusTask, stakingStartTime, stakingEndTime, userBonusCoefficient, campaignId } =
    currentInfo || {};

  const status = useMemo(() => {
    if (moment().isBefore(stakingStartTime)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(stakingEndTime)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, [stakingStartTime, stakingEndTime]);

  const handleTaskModal = useCallback(() => {
    dispatch({
      type: 'gempool/updateCampaignExtra',
      payload: {
        campaignId,
      },
    });
    dispatch({
      type: 'gempool/update',
      payload: {
        taskModal: true,
        questionId: campaignId,
      },
    });
  }, [dispatch, campaignId]);

  const showEmpty = !openBonusTask || status === POOL_STATUS.COMPLETED || !user;

  useEffect(() => {
    if (showEmpty || !campaignId) return null;
    dispatch({
      type: 'gempool/pullGemPoolBonusTask',
      payload: {
        id: campaignId,
      },
      fullData: true,
    });
  }, [dispatch, campaignId, showEmpty]);

  const taskMap = useSelector(state => state.gempool.tasksMap, shallowEqual) || {};
  
  if (showEmpty) {
    return null;
  }

  const showTask = () => {
    const {
      userBonusCoefficient: taskUserBonusCoefficient,
      maxBonusCoefficient: taskMaxBonusCoefficient,
    } = taskMap[campaignId] || {};
    return (
      <>
        {_tHTML('f78a20209ff44800a527', {
          current: taskUserBonusCoefficient ? numberFormat({
            number: taskUserBonusCoefficient,
            lang: currentLang,
            options: {
              style: 'percent',
            },
          }) : '--',
          max: taskMaxBonusCoefficient ? numberFormat({
            number: taskMaxBonusCoefficient,
            lang: currentLang,
            options: {
              style: 'percent',
            },
          }) : '--',
        })}
      </>
    )
  }

  if (isSm) {
    return (
      <H5TaskEntranceWrapper onClick={handleTaskModal}>
        <div className="container">
          <img className='tipBgIcon' src={tipBgIcon} alt='tipBgIcon' />
          <LazyImg src={logo3} alt="logo" />
          <div className='wrapper'>
            <div className="title">
              <div className="text">
                {showTask()}
              </div>
            </div>
            <span className='btnGroup'>
              {_t('f8ca45c2ad874000afc8')}
              <ICArrowRight2Outlined />
            </span>
          </div>
        </div>
      </H5TaskEntranceWrapper>
    );
  }
  return (
    <TaskEntranceWrapper>
      <LazyImg src={taskMask} alt="mask" className="mask" />
      <div className="title">
        <LazyImg src={logo3} alt="logo" />
        {showTask()}
      </div>
      <Link className="right" to="#task">
        {_t('f8ca45c2ad874000afc8')}
        <ICArrowRight2Outlined />
      </Link>
    </TaskEntranceWrapper>
  );
}

function Tasks() {
  const myRef = useRef();
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const isSm = !sm;
  const referralCode = useSelector((state) => state.user.referralCode);
  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);
  const inviteBonusLevel = useSelector((state) => state.gempool.inviteBonusLevel, shallowEqual);
  const bonusTaskList = useSelector((state) => state.gempool.bonusTaskList, shallowEqual);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const { campaignId, openBonusTask, stakingStartTime, stakingEndTime } =
    currentInfo || {};

  const status = useMemo(() => {
    if (moment().isBefore(stakingStartTime)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(stakingEndTime)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, [stakingStartTime, stakingEndTime]);

  const handleParticipate = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        questionModal: true,
        questionId: campaignId,
      },
    });
  }, [dispatch, campaignId]);

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (isInApp) {
        const tragetUrl = KUCOIN_HOST + addLangToPath('/vip/privilege');
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(tragetUrl)}`,
          },
        });
      } else {
        push('/vip/privilege');
      }
    },
    [isInApp],
  );

  useEffect(() => {
    if (openBonusTask && !isSm && user && bonusTaskList?.length) {
      const node = myRef.current;

      if (node instanceof HTMLElement) {
        const a = node.querySelector('#vip a');

        if (a) {
          a.addEventListener('click', handleClick);
        }
      }

      return () => {
        const node = myRef.current;

        if (node instanceof HTMLElement) {
          const a = node.querySelector('#vip a');
          if (a) {
            a.removeEventListener('click', handleClick);
          }
        }
      };
    }
  }, [handleClick, openBonusTask, user, isSm, bonusTaskList]);

  const taskList = useMemo(() => {
    if (!bonusTaskList || !bonusTaskList.length) {
      return null;
    }
    return bonusTaskList.map((item, index) => {
      if (!item || !TASK_CONTENT_CONFIG[item.taskType]) return null;

      const { taskState, taskType, vipLevel, kcsLevel, bonusCoefficient } = item;
      const taskConfig = TASK_CONTENT_CONFIG[taskType];

      let descComp = null;
      if (taskType === 0) {
        // 0--考题
        descComp = taskConfig.subTitle({
            icon: currentTheme === 'light' ? doubleArrowLight : doubleArrowDark,
            num: numberFormat({
              number: item?.bonusCoefficient,
              lang: currentLang,
              options: {
                style: 'percent',
              },
            }),
          });
      } else if (taskType === 1) {
        // 1--VIP
        descComp = (
          <div className="desc" id="vip">
            {taskConfig.subTitle()}
          </div>
        );
      } else if (taskType === 2) {
        descComp = taskConfig.subTitle();
      } else if (taskType === 3) {
        // 3--邀请用户
        descComp = taskConfig.subTitle({
          percent: numberFormat({
            number: item?.maxBonusCoefficient || '0',
            lang: currentLang,
            options: {
              style: 'percent',
            },
          }),
        })
      }

      let operatorComp = null;
      let extraComp = null;
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
          <Button onClick={handleParticipate}>{_t('f8ca45c2ad874000afc8')}</Button>
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
        const hasBonus = !!Number(item.bonusCoefficient);
        // 3--邀请用户
        operatorComp = (
          <>
          <CopyToClipboard
            text={getShareLink({rcode: referralCode})}
            onCopy={() => {
              message.success(_t('afb1ecf83b964000a45c'));
            }}
          >
            {/* 邀请好友 */}
            <Button>{_t('43fcc9080a494000a786')}</Button>
          </CopyToClipboard>
          </>
        );
        extraComp = <InviteUserSteps
          className='invite-progress-info'
          inviteBonusLevel={inviteBonusLevel ||[]}
          invitedUser={item.inviteActivityPeopleNumber}
          />;
      }
      return (
        <TaskItemWrapper key={`task_${index}`} taskState={taskState}>
          <input type="checkbox" id={'bonus-task-'+taskType} style={{display: 'none'}} />
          <div className='main-content'>
            <div className="contentWrapper">
              <div className="title"> {taskConfig.title({
                  maxBonusCoefficient: numberFormat({
                    number: item.maxBonusCoefficient || '0',
                    lang: currentLang,
                    options: {
                      style: 'percent',
                    },
                  })
                })}</div>
              <div className="desc">{descComp}</div>
            </div>
            <div className="resultWrapper">{operatorComp}</div>
          </div>
          {extraComp}
        </TaskItemWrapper>
      );
    });
  }, [bonusTaskList, currentLang, currentTheme, inviteBonusLevel, referralCode, message, handleParticipate]);

  if (!openBonusTask || status === POOL_STATUS.COMPLETED || isSm || !user) {
    return null;
  }

  return (
    <>
      <StyledCurrent>
        <AnchorPlaceholder id="task" />
        <TitleWrapper>
          <div className="title">
            <LazyImg src={logo3} alt="logo" />
            {_t('5303349a53a44000ae11')}
          </div>
        </TitleWrapper>
        <ListWrapper ref={myRef}>{taskList}</ListWrapper>
      </StyledCurrent>
    </>
  );
}

export default memo(Tasks);
