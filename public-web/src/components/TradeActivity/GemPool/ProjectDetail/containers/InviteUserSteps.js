/**
 * Owner: saiya.lee@kupotech.com
 */
import { useMemo } from 'react';
import { numberFormat, styled, useResponsive } from '@kux/mui';
import { ICInfoOutlined } from '@kux/icons';
import clsx from 'clsx';
import { useLocale } from '@kucoin-base/i18n';
import { _t } from 'tools/i18n';
import { ReactComponent as UpIcon } from 'static/gempool/up_arrow.svg';
import { ReactComponent as UpIcon2 } from 'static/gempool/up_icon2.svg';
import Tooltip from 'components/Premarket/components/Tooltip';

const Wrapper = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;

  .invite-user-title {
    display: flex;
    align-items: center;
    line-height: 20px;
    color: ${(props) => props.theme.colors.text40};

    .invite-user-number {
      font-weight: 600;
      margin-left: 4px;
      color: ${(props) => props.theme.colors.text};
    }
    svg {
      margin-left: 4px;
    }
  }

  .invite-steps {
    position: relative;
    display: flex;
    margin-top: 12px;

    &.is-vertical {
      margin-top: 6px;
      flex-direction: column;

      .invite-track, .invite-progress {
        width: 4px;
        height: 100%;
        left: 10px;
        bottom: auto;
      }
      .invite-progress {
        background: #A0FE92;
        width: 4px;
        height: var(--progress-width, 0px);
      }
      .invite-step {
        flex-direction: row-reverse;
        justify-content: space-between;
        min-height: 40px;
        .icon {
          top: 0;
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
        }
        .label {
          margin-top: 0;
        }
      }
      .label {
        padding-left: 32px;
      }
      .percent {
        margin-bottom: 0;
        &::after {
          display: none;
        }
      }
    }

    .invite-track, .invite-progress {
      position: absolute;
      left: 0;
      width: 100%;
      height: 4px;
      background: ${(props) => props.theme.colors.cover4};
      border-radius: 2px;
      bottom: 30px;
    }
    .invite-progress {
      background: linear-gradient(276deg, #7FFCA7 0.89%, #AAFF8D 97.34%);
      width: var(--progress-width, 0px);
    }
  }
  .invite-step-placeholder {
    flex: 4;
  }
  .invite-step {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.text60};

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      background: ${(props) => props.theme.colors.overlay};
      border-radius: 50%;
      opacity: 1;
      position: relative;
      top: -5.5px;
      .dot {
        width: 6px;
        height: 6px;
        background: ${(props) => props.theme.colors.cover16};
        border-radius: 50%;
      }
    }

    .percent {
      position: relative;
      display: flex;
      align-items: center;
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => props.theme.colors.text60};
      background-color: ${(props) => props.theme.colors.cover4};
      margin-bottom: 12px;
      &::after {
        width: 8px;
        height: 8px;
        content: '';
        position: absolute;
        border-radius: 2px;
        background: linear-gradient(45deg, ${(props) => props.theme.colors.cover4}, ${(props) => props.theme.colors.cover4} 50%, transparent 50%, transparent 100%);
        left: 50%;
        bottom: -4px;
        transform: translateX(-50%) rotate(-45deg);
      }
      > svg {
        margin-right: 2px;
      }
    }

    .label {
      color: ${(props) => props.theme.colors.text40};
      margin-top: 2px;
    }

    &.active {
      .icon {
        opacity: 1;
        .dot {
          background: #A0FE92;
        }
      }

      .percent {
        background: linear-gradient(276deg, #7FFCA7 0.89%, #AAFF8D 97.34%);
        color: #1d1d1d;
        &::after {
          background: linear-gradient(45deg, #A0FE92, #A0FE92 50%, transparent 50%, transparent 100%);
        }
      }

      .label {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

export function InviteUserSteps({inviteBonusLevel, invitedUser, className, inDialog}) {
  const { sm } = useResponsive();
  const { currentLang } = useLocale();
  // 获取当前激活的 步骤
  const activeStep = useMemo(() => inviteBonusLevel.slice(0).reverse().find((item, index) => {
    return invitedUser >= item.userAmount
  })?.userAmount || 0, [inviteBonusLevel, invitedUser]);

  const isSm = !sm;
  // 是否是竖向展示: 超过10个, 或者5个以上且(小屏幕或在弹窗中)
  const isVertical = inviteBonusLevel.length >= 10 || ( inviteBonusLevel.length >=5 && (isSm || inDialog));

  // 计算进度条的宽度
  const progressWidth = useMemo(() => {
    const totalSteps = inviteBonusLevel.length;
    const index = inviteBonusLevel.findIndex((item) => item.userAmount === activeStep);
    // 激活到最后一个步骤, 宽度为100%
    if (index === (totalSteps - 1)) {
      return '100%';
    }
    const currentStepInfo = inviteBonusLevel[index];
    const nextStepInfo = inviteBonusLevel[index + 1];
    let additionalProgress = 0;
    // 步骤节点之间的进度
    if (!currentStepInfo) {
      additionalProgress = invitedUser / nextStepInfo.userAmount;
    } else {
      additionalProgress = (invitedUser - currentStepInfo.userAmount) / (nextStepInfo.userAmount - currentStepInfo.userAmount);
    }
    // 只有一个步骤时, 整体进度按5等分分割, 实际展示的进度需按 90%(5*2-1/5*2)来折算
    if (totalSteps === 1) {
      return ((additionalProgress * 0.9) * 100) + '%';
    }
    // 如果还未达到第一个步骤, 进度折半, 保证在第一段显示正常
    if (index === -1) {
      additionalProgress /= 2;
    }
    // 步骤自身的进度, 因为进度节点均分, 所以需要乘以2再减去1
    const currentStepProgress = index >= 0 ? ((index + 1) * 2 - 1) / 2 : 0;
    return (((currentStepProgress + additionalProgress) / totalSteps) * 100) + '%';
  }, [activeStep, invitedUser, inviteBonusLevel]);

  
  return (
    <Wrapper className={className}>
      <div className='invite-user-title'>
        {/* 邀请人数 */}
        <span>{_t('b0cf2d92b7894000a520')}</span>
        <span className='invite-user-number'>
          {numberFormat({
            number: invitedUser,
            lang: currentLang,
          })}
        </span>
        {/* 帮助信息 */}
        <Tooltip trigger="hover" header={_t('65b3555087b74000a81f')} title={_t('23d6d37cbed14000a717')} maxWidth={340}>
          <ICInfoOutlined />
        </Tooltip>
      </div>
      {inviteBonusLevel?.length > 0 && <div className={'invite-steps' + (isVertical ? ' is-vertical' : '')}>
        <div className='invite-track' />
        <div className='invite-progress' style={{'--progress-width': progressWidth}} />
        {inviteBonusLevel?.length === 1 && (<div className='invite-step-placeholder'/>)}
        {inviteBonusLevel?.map((item) => {
          const _activeStep = Number(activeStep);
          const userAmount = Number(item.userAmount)
          const isCurrent = _activeStep == userAmount;
          const isNext = _activeStep < userAmount;
          const isPass = _activeStep >= userAmount;
          return (
            <div
              className={clsx('invite-step', {
                active: isPass,
                isVertical,
              })}
              key={item.userAmount}>
              <div className={clsx('percent')}>
                {
                  isCurrent && <UpIcon />
                }
                {
                  isNext && <UpIcon2 />
                }
                {numberFormat({
                  isPositive: true,
                  number: item.boost || 0,
                  lang: currentLang,
                  options: {
                    style: 'percent',
                  },
                })}
              </div>
              <div className="icon">
                <div className='dot' />
              </div>
              <div className="label">
                {
                  _t('7fc6ad930ff24000a904', {
                    num: numberFormat({
                      number: item.userAmount,
                      lang: currentLang,
                    }),
                  })
                }
              </div>
            </div>
          );
        })}
      </div>}
    </Wrapper>
  );
}
