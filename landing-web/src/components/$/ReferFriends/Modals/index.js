/**
 * Owner: gavin.liu1@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { useDispatch, useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import Decimal from 'decimal.js';
import { KUCOIN_HOST_COM } from 'utils/siteConfig';
import { _t, _tHTML } from 'utils/lang';
import { addLangToPath } from 'utils/lang';
import ModalBase from './../common/ModalBase';
import useModals from './../hooks/useModals';
import { AWARD_ID as GIFT_MAP, MODAL_MAP } from '../common/map';
import useGoTrade from './../hooks/useGoTrade';
import useReferFriends from './../hooks/useReferFriends';
// import prizelist from 'src/assets/referFriend/modal-prize1.png';
import prize0 from 'src/assets/referFriend/prize0.svg';
import prize1 from 'src/assets/referFriend/prize1.svg';
import prize2 from 'src/assets/referFriend/prize2.svg';
import prize3 from 'src/assets/referFriend/prize3.svg';
import prize4 from 'src/assets/referFriend/prize4.svg';
import prize5 from 'src/assets/referFriend/prize5.svg';
import award1 from 'src/assets/referFriend/award1.svg';
import award2 from 'src/assets/referFriend/award2.svg';
import spot from 'src/assets/referFriend/spot.svg';
import prizeFace from 'src/assets/referFriend/prize-face.svg';
import up from 'src/assets/referFriend/up.svg';
import { referFriendExpose, referFriendTrackClick } from '../config';
import { withEffect } from '../common/withEffect';

const ContentProgressFirstLine = styled.div`
  background: #3c475b;
  border-radius: 10px;
  width: 100%;
`;

const ContentProgressFirstLineRaw = styled.div`
  background: #fff997;
  border-radius: 10px;
  width: ${(props) => props.count}%;
  height: 5px;
  transition: width 0.5s ease-in-out;
`;

export const Child = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: rgba(243, 243, 243, 0.6);
  overflow: hidden;

  .tip {
    color: #f3f3f3;
  }
  .usdt10000 {
    a {
      text-decoration: underline;
    }
  }
  .prizelist {
    display: block;
    height: 60px;
    min-height: 60px;

    margin: 12px 0;
    img {
      width: 60px;
      margin-right: 0px;
    }
  }
  .highlight {
    color: #01bc8d;
    font-weight: 700;
  }
  .yellow {
    color: #fff997;
    font-weight: 700;
  }
  .desc {
    margin: 12px 0 8px;
  }
`;

const Modals = ({ sharePost }) => {
  const { serverTime } = useSelector((state) => state.app);
  const { curModalId, clearModal, triggerGetGift, showModal, initModal } = useModals();
  const { handleTradeNow } = useGoTrade();
  const dispatch = useDispatch();
  const {
    referInfo,
    gift,
    isLogin,
    userByRcode,
    triggerPlatformAssist,
    userAssist,
    handleLogin,
    isInApp,
    hasGotFinalAward,
    diabledUserAssist,
  } = useReferFriends();
  const { firstTradeCompleted, totalSupportAmount, supportRule, firstTradeTime } = referInfo;

  // 被邀请人助力成功后，需要更新表格
  const refreshTable = () => {
    dispatch({
      type: 'referFriend/getAwardRecords',
      payload: {
        page: 1,
        pageSize: 500,
      },
    });
  };

  // 点击继续邀请助力后，去海报邀请
  const goShare = () => {
    clearModal();
    sharePost?.();
  };

  // 点击【返回kucoin首页】跳转平台主页:
  // 如果在app内访问，则返回到app首页；
  // 如果在web端则 去到 https://www.kucoin.com/
  // 点击返回返回上级页面
  const goBackPage = () => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      window.location.href = addLangToPath(KUCOIN_HOST_COM);
    }
  };

  const renderModal1 = () => {
    if (firstTradeCompleted) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('14JCEf4ta3HfFTtgCKBQZs')}</span>, () =>
            referFriendExpose(['inviterBonusPopUp1', '1']),
          )}
          title={_t('bnygR3bRcxuiPGeQq5QLBn')}
          awardImgUrl={prize1}
          awardImg91
          onOk={() => {
            referFriendTrackClick(['inviterBonusPopUp1', '1']);
            clearModal();
            triggerPlatformAssist();
          }}
        >
          <Child>
            {_tHTML('qR7qusVBh8ZbpyhhzJngzN', { num: '50' })}
            {/* <span>
              恭喜你获得 <span className="highlight">50 USDT</span> 提现资格！
            </span> */}
          </Child>
        </ModalBase>
      );
    }

    return (
      <ModalBase
        okText={withEffect(<span>{_t('cH8qrrceVgNUCPDJbWPPKZ')}</span>, () =>
          referFriendExpose(['inviterBonusPopUp1', '2']),
        )}
        onCancel={() => {
          referFriendTrackClick(['inviterBonusPopUp1', '3']);
          clearModal();
          // goBackPage();
        }}
        onOk={() => {
          referFriendTrackClick(['inviterBonusPopUp1', '2']);

          handleTradeNow();
        }}
        cancelText={_t('84BrRNJmV2NshoFtqALoJz')}
        title={_t('bnygR3bRcxuiPGeQq5QLBn')}
        awardImgUrl={prize1}
        awardImg91
      >
        <Child>
          {_tHTML('9wfiWZv9Mmfmkyi8eKumys', { num: '50' })}
          {/* <span>
            恭喜你获得 <span className="highlight">50 USDT</span> 提现资格！完成首次交易，即可提现
          </span> */}
        </Child>
      </ModalBase>
    );
  };

  // 待领取礼包枚举
  const renderModal2 = () => {
    const awardId = gift?.awardId;
    // 1.请求汇总接口查看是否还有后续礼包；// 2.关闭礼包1和礼包2 后，弹出好友助力结果弹窗。
    const refreshGiftAndShowSupport = async () => {
      await clearModal();
      // 查看是否有更多奖品
      const gift = await triggerGetGift();
      if (gift?.awardId) {
        showModal('BOOST_PRIZE_WINNING_POP_UP_WINDOW');
        // 领奖后刷新奖品列表
        refreshTable();
        return;
      }

      showModal(MODAL_MAP.FRIENDS_HELP_RESULTS_WINDOW);
    };

    if (awardId === GIFT_MAP.ReferralBonusGift1) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('jLq5cMQQkraWSmwzjRUzrP')}</span>, () =>
            referFriendExpose(['GiftPopUp', '1'], { giftName: awardId }),
          )}
          title={_t('95ELkMUJK9Utas8u2P7v11')}
          awardImgUrl={prize2}
          onOk={() => {
            referFriendTrackClick(['GiftPopUp', '1'], { giftName: awardId });
            refreshGiftAndShowSupport();
          }}
        >
          <Child>
            <span>
              {/* 50 USDT 合约手续费抵扣券 */}
              {_tHTML('dogFrLUZZBDepufTCHUQHr', { award: _t('dA3bL8P9CHNaie3RjWReW4') })}{' '}
              {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
              {/* 恭喜你，获得平台掉落的惊喜奖励 <span className="highlight">100 USDT</span>
              合约体验券，奖励将在活动结束后，<span className="tip">三天内发放到账</span> */}
            </span>
          </Child>
        </ModalBase>
      );
    }

    if (awardId === GIFT_MAP.ReferralBonusGift2) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('jLq5cMQQkraWSmwzjRUzrP')}</span>, () =>
            referFriendExpose(['GiftPopUp', '1'], { giftName: awardId }),
          )}
          title={_t('uuYzcCX7EYPiV8DFB6WKGK')}
          awardImgUrl={prize4}
          onOk={() => {
            referFriendTrackClick(['GiftPopUp', '1'], { giftName: awardId });
            refreshGiftAndShowSupport();
          }}
        >
          <Child>
            <span>
              {/* 恭喜你，获得平台掉落的惊喜奖励 <span className="highlight">100 USDT</span>
              合约体验金，奖励将在活动结束后，<span className="tip">三天内发放到账</span> */}
              {_tHTML('dogFrLUZZBDepufTCHUQHr', {
                award: _t('hQKddzu8pmJ8k4tk7zQHQU'),
              })}{' '}
              {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
            </span>
          </Child>
        </ModalBase>
      );
    }

    if (awardId === GIFT_MAP.ReferralBonusGift3) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('bytcyPjG32uLorKMJAmBXi')}</span>, () =>
            referFriendExpose(['50UGiftPopUp', '1']),
          )}
          title={_t('6YAqE66GxXdPbTJ3bTGLtP')}
          awardImgUrl={prizeFace}
          onOk={async () => {
            referFriendTrackClick(['50UGiftPopUp', '1']);
            await clearModal();
            // const gift = await triggerGetGift();
            // if (gift?.awardId) {
            //   showModal('BOOST_PRIZE_WINNING_POP_UP_WINDOW');
            //   return;
            // }
            // // 关闭礼包3后，不弹出好友助力结果弹窗，弹出平台助力弹窗：【519新增】
            showModal(MODAL_MAP.POWER_AWARDS_PACKAGE_AFTER_3_PLATFORM_DYNAMICAL_POPUP_WINDOW);
          }}
        >
          <Child>
            <span>
              {/* 好友助力成功，已达成 <span className="highlight">50 USDT</span>{' '} */}
              {/* 提现资格！奖励将在活动结束后，<span className="tip">三天内发放到账</span> */}
              {_tHTML('um6vJgEbSAi76dJ2jVqq7P', { num: '50' })} {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
            </span>
          </Child>
        </ModalBase>
      );
    }

    // 关闭礼包4后，不弹出好友助力结果弹窗，直接进入邀请助力首页。
    if (awardId === GIFT_MAP.ReferralBonusGift4) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('jLq5cMQQkraWSmwzjRUzrP')}</span>, () =>
            referFriendExpose(['10000UGiftPopUp', '1']),
          )}
          title={_t('t2nbJANUsKm17MVMA2ZF21')}
          awardImgUrl={prize3}
          onOk={() => {
            referFriendTrackClick(['10000UGiftPopUp', '1']);
            clearModal();
          }}
        >
          <Child>
            {/* 恭喜你，获得价值 10,000 USDT
              的旅游超级大奖！奖励将在活动结束后，三天内发放到账，并且还会有专人客服与您对接～详情可以查看规则 */}
            <span>
              {_tHTML('w9NxLEiDSm9D8tCmknqRfd', { num: '10,000' })}{' '}
              {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
            </span>
          </Child>
        </ModalBase>
      );
    }

    return null;
  };

  const renderModal3 = () => {
    const dividend = new Decimal(totalSupportAmount || 0);
    const divisor = totalSupportAmount > 50 ? new Decimal(10000) : new Decimal(50);
    let pct = dividend.div(divisor).times(100).toFixed(2);
    const num = totalSupportAmount > 50 ? '10,000' : '50';
    if (totalSupportAmount >= 9999 && totalSupportAmount < 10000) {
      pct = '99.99';
    }

    return (
      <ModalBase
        okText={withEffect(<span>{_t('79Xf1w57iDpnnfB3vPsAtY')}</span>, () =>
          referFriendExpose(['helpResultPopUp', '1']),
        )}
        onOk={() => {
          referFriendTrackClick(['helpResultPopUp', '1']);
          goShare();
        }}
        title={_t('4ssBXpvqVe1KKYUTktokPa')}
        showClose
        awardImg88
        onCloseIconClick={() => {
          referFriendTrackClick(['helpResultPopUp', '2']);
          clearModal();
        }}
      >
        <Child>
          <span>
            {_tHTML('9eUCHbTQbbUJcLya2AXJym', {
              num: totalSupportAmount,
            })}
            {/* 又有新的好友为我助力，已帮我助力
            <span className="highlight">{totalSupportAmount} USDT</span> */}
          </span>
          <div className="desc">
            {_tHTML('cKvmqj8UwS3rjYvuCrCf5u', {
              num,
              percent: pct,
            })}
            {/* 提现 50 USDT，进度已完成 <span className="yellow"> {pct}%</span> */}
          </div>
          <ContentProgressFirstLine>
            <ContentProgressFirstLineRaw count={pct} />
          </ContentProgressFirstLine>
        </Child>
      </ModalBase>
    );
  };

  // 被邀请人助力福利弹窗
  const renderModal4 = () => {
    // 交易超过了24h不展示vip体验券
    const hideVip = firstTradeCompleted && serverTime - firstTradeTime > 1000 * 60 * 60 * 24;

    /* 邀请人昵称，没有则展示脱敏邮箱/手机号（UID：邀请人uid）送了50USDT提现机会+VIP1体验券，完成登陆后即可领取 ✅ */
    const commonContent = withEffect(
      <>
        {/* withEffect包裹的文本需要有标签包裹，否则在谷歌翻译场景，一旦触发rerender会生成多个重复的文本 */}
        <span>{_t('dyx4p8Fa3YQYbXzy2f6bSf', {
          account: userByRcode?.inviterUser || '--',
          uid: userByRcode?.inviterUid || '--',
        })}</span>
        {/* <div className="">为我准备了</div> */}

        <div className="prizelist">
          <img src={award1} alt="award1" />
          {!hideVip && <img src={award2} alt="award2" />}
        </div>
        {/* <div className="highlight"> +50 USDT 提现机会</div> */}
        <div className="highlight">
          {_t('cvNbvdEYfohE1gfJVUgzXL', {
            num: '50',
          })}
        </div>
        {/* <div className="highlight"> + VIP1 体验券</div> */}
        {!hideVip && <div className="highlight">{_t('6rA81R3L2TfmDfuLqxtyk7')}</div>}
      </>,
      () => referFriendExpose(['invitedHelpPopUp', '1']),
    );
    const onModalClose = () => {
      referFriendTrackClick(['invitedHelpPopUp', '6']);
      clearModal();
    };

    // 若用户未登陆：
    if (!isLogin) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('k3PJkn6TmxJdvwDL9eQKdQ')}</span>, () =>
            referFriendExpose(['invitedHelpPopUp', '2']),
          )}
          title={_t('uZEc3h6PKro3B3gh58sHPU')}
          showClose
          awardImg88
          onCloseIconClick={onModalClose}
          onOk={() => {
            referFriendTrackClick(['invitedHelpPopUp', '2']);
            handleLogin();
          }}
        >
          <Child>
            {commonContent}
            <div>{_t('fyT16b3XmGL6ypsqC96cor')}</div>
          </Child>
        </ModalBase>
      );
    }

    // 用户已登陆：是老用户
    if (firstTradeCompleted) {
      return (
        <ModalBase
          okText={withEffect(<span>{_t('74qUCUpPLEXkxhEmmnnBxD')}</span>, () =>
            referFriendExpose(['invitedHelpPopUp', '5']),
          )}
          onOk={() => {
            referFriendTrackClick(['invitedHelpPopUp', '5']);
            userAssist(() => {
              // 助力成功回调:
              clearModal();
              refreshTable();
              // 转变角色，走邀请人流程
              initModal({ referInfo, isBeInvitedMan: false });
            });
          }}
          diabledOkButton={diabledUserAssist}
          title={_t('uZEc3h6PKro3B3gh58sHPU')}
          showClose
          awardImg88
          onCloseIconClick={() => {
            onModalClose();
            // 转变角色，走邀请人流程
            initModal({ referInfo, isBeInvitedMan: false });
          }}
        >
          <Child>
            {commonContent}
            <div>{_t('rr6rRuhyxUagwk8sL1Pqgz')}</div>
          </Child>
        </ModalBase>
      );
    }

    // 未交易的新用户
    referFriendExpose(['invitedHelpPopUp', '4']);
    return (
      <ModalBase
        okText={withEffect(<span>{_t('wnmRTgFXZj4nd8vtz5xZZq')}</span>, () =>
          referFriendExpose(['invitedHelpPopUp', '3']),
        )}
        cancelText={diabledUserAssist ? '' : _t('4dnwzUVADZwZg9GRmXyJ5k')}
        title={_t('uZEc3h6PKro3B3gh58sHPU')}
        onCancel={() => {
          referFriendTrackClick(['invitedHelpPopUp', '4']);
          // 未交易的新用户助力完停留在当前界面
          userAssist(refreshTable);
        }}
        showClose
        awardImg88
        onOk={() => {
          referFriendTrackClick(['invitedHelpPopUp', '3']);
          handleTradeNow();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['invitedHelpPopUp', '6']);
          goBackPage();
        }}
      >
        <Child>
          {commonContent}
          <div>{_t('irWQBcb6gZdFneVmqpBCxS')}</div>
        </Child>
      </ModalBase>
    );
  };

  if (curModalId === MODAL_MAP.SECRET_POWER_DOUBLED) {
    return (
      <ModalBase
        okText={_t('h1bF6dFfWCL7ULfz6bxTdn')}
        title={withEffect(<span>{_t('cnwY8sGReHMZd2GwmWyW14')}</span>, () =>
          referFriendExpose(['doubleBonusPopUp', '1']),
        )}
        awardImgUrl={up}
        awardImg91
        showClose
        onOk={() => {
          referFriendTrackClick(['doubleBonusPopUp', '1']);
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['doubleBonusPopUp', '2']);
          clearModal();
        }}
      >
        <Child>{_t('9ZHhcx2ihignc43sPY83a4')}</Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.SIGNATURE_SPOTLIGH) {
    return (
      <ModalBase
        okText={_t('h1bF6dFfWCL7ULfz6bxTdn')}
        topTitle={_t('81GGcxyyQuL6BeWWkXWAsd')}
        title={_t('ar9Zi8SrgB98WiMXrXJ9Ri')}
        awardImgUrl={spot}
        showClose
        onOk={() => {
          goShare();
        }}
        onCloseIconClick={() => {
          clearModal();
        }}
      >
        <Child>{_tHTML('gnMH72wzkBkB8ec1AjTiUY')}</Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.USDT_10000_TIP) {
    return (
      <ModalBase
        okText={withEffect(<span>{_t('jLq5cMQQkraWSmwzjRUzrP')}</span>, () =>
          referFriendExpose(['10000explainPopUp', '1']),
        )}
        title={'10,000 USDT'}
        awardImgUrl={prize0}
        awardImg91
        onOk={() => {
          referFriendTrackClick(['10000explainPopUp', '1']);
          clearModal();
        }}
      >
        <Child>
          {/* eslint-disable-next-line */}
          <span
            className="usdt10000"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (e.target.tagName !== 'A') {
                return;
              }

              if (isInApp) {
                JsBridge.open({
                  type: 'event',
                  params: {
                    name: 'updateHeader',
                    visible: true,
                  },
                });
              }
              window.originOpen(supportRule, 'noopener noreferrer');
            }}
          >
            {supportRule
              ? _tHTML('jL5EU7LpQgGNdjNEXpjF1b', {
                  url: supportRule || '/',
                }, 'span', false)
              : null}
            {/* 10000USDT为最终旅游基金，具体奖品见
            <a href={supportRule || '/'} target="_blank" rel="noreferrer">
              详细规则
            </a> */}
          </span>
        </Child>
      </ModalBase>
    );
  }

  // 如果已经获得了最终大奖，所有按钮都会变成我知道了
  const awardItemOkText = hasGotFinalAward
    ? _t('jLq5cMQQkraWSmwzjRUzrP')
    : _t('79Xf1w57iDpnnfB3vPsAtY');

  // 点击分享好友按钮，若用户未完成首次交易，弹窗提示需要完成首次交易后可参加邀请助力活动。
  if (curModalId === MODAL_MAP.TRADE_TIP) {
    return (
      <ModalBase
        okText={_t('cH8qrrceVgNUCPDJbWPPKZ')}
        onCancel={() => {
          clearModal();
        }}
        onOk={() => {
          handleTradeNow();
        }}
        cancelText={_t('xxCXe9y6xA8AVxFmWT7PSk')}
        title={_t('8J5QJo74DLpyw4x47p2xXa')}
        awardImgUrl={prize0}
        awardImg91
      >
        <Child>
          {_tHTML('87nVQy2iqnTxeqaj7mfvTw')}
          {/* 完成首次交易，即可参与最高可得<span className="highlight">10000 USDT</span>
          大奖的邀请助力活动 */}
        </Child>
      </ModalBase>
    );
  }

  // 奖品列表弹窗
  if (curModalId === MODAL_MAP.TRAVEL_PACKAGE) {
    return (
      <ModalBase
        okText={withEffect(<span>{awardItemOkText}</span>, () =>
          referFriendExpose(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.ReferralBonusGift4 }),
        )}
        title={_t('hMrFRJPRYBhdWHXDwLLYWX')}
        awardImgUrl={prize3}
        // 大奖的按钮是“我知道了”，就不会有多余的关闭按钮
        showClose={!hasGotFinalAward}
        onOk={() => {
          if (hasGotFinalAward) {
            clearModal();
            return;
          }
          referFriendTrackClick(['awardRecordPopUp', '1'], {
            giftName: GIFT_MAP.ReferralBonusGift4,
          });
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['awardRecordPopUp', '2'], {
            giftName: GIFT_MAP.ReferralBonusGift4,
          });
          clearModal();
        }}
      >
        <Child>
          <span>
            <span style={{ wordBreak: 'break-all' }}>
              {_tHTML('w9NxLEiDSm9D8tCmknqRfd', { num: '10,000' })}
            </span>{' '}
            {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
            {/* <span className="highlight">10,000 USDT Travel Package</span>
            ，法国双人7日游豪华大奖；奖励将在活动结束后，
            <span className="tip">三天内发放到账</span>，并且还会有专人客服与您对接～ */}
          </span>
        </Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.FUTURES_TRIAL_FUND) {
    return (
      <ModalBase
        okText={withEffect(<span>{awardItemOkText}</span>, () =>
          referFriendExpose(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.ReferralBonusGift2 }),
        )}
        title={_t('uuYzcCX7EYPiV8DFB6WKGK')}
        awardImgUrl={prize4}
        showClose={!hasGotFinalAward}
        onOk={() => {
          if (hasGotFinalAward) {
            clearModal();
            return;
          }
          referFriendTrackClick(['awardRecordPopUp', '1'], {
            giftName: GIFT_MAP.ReferralBonusGift2,
          });
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['awardRecordPopUp', '2'], {
            giftName: GIFT_MAP.ReferralBonusGift2,
          });
          clearModal();
        }}
      >
        <Child>
          <span>
            {_tHTML('qU1mwiofyZoRdqNuzbpakX', { num: '5' })} {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
            {/* <span className="highlight">10 USDT Futures Trial Fund</span>
            ，仅限于杠杆交易使用；奖励将在活动结束后，
            <span className="tip">三天内发放到账</span> */}
          </span>
        </Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.FUTURES_DEDUCTION_COUPON) {
    return (
      <ModalBase
        okText={withEffect(<span>{awardItemOkText}</span>, () =>
          referFriendExpose(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.ReferralBonusGift1 }),
        )}
        title={_t('5p97DDfb5KHSDamqnqAk4y')}
        awardImgUrl={prize2}
        showClose={!hasGotFinalAward}
        onOk={() => {
          if (hasGotFinalAward) {
            clearModal();
            return;
          }
          referFriendTrackClick(['awardRecordPopUp', '1'], {
            giftName: GIFT_MAP.ReferralBonusGift1,
          });
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['awardRecordPopUp', '2'], {
            giftName: GIFT_MAP.ReferralBonusGift1,
          });
          clearModal();
        }}
      >
        <Child>
          <span>
            {/* <span className="highlight">100 USDT Futures Deduction Coupon</span>
            ，仅限于杠杆交易使用；奖励将在活动结束后，
            <span className="tip">三天内发放到账</span> */}
            {_tHTML('kYa73Zy4Wzr3LR1tpMgRK9')} {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
          </span>
        </Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.VIP1_EXPERIENCE_TICKET) {
    return (
      <ModalBase
        okText={withEffect(<span>{awardItemOkText}</span>, () =>
          referFriendExpose(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.VIPLv1Trial }),
        )}
        title={_t('eMmgX8xxGtxrjhdHQmTxC8')}
        awardImgUrl={prize5}
        showClose={!hasGotFinalAward}
        onOk={() => {
          if (hasGotFinalAward) {
            clearModal();
            return;
          }
          referFriendTrackClick(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.VIPLv1Trial });
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['awardRecordPopUp', '2'], { giftName: GIFT_MAP.VIPLv1Trial });
          clearModal();
        }}
      >
        <Child>
          <span>
            {/* <span className="highlight">7 Days VIP1 Experience Ticket</span>
            ，可以享受VIP1的所有权益；奖励将在活动结束后，
            <span className="tip">三天内发放到账</span> */}
            {_tHTML('22UkbM24gS4Qczfd4yUi1j')} {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
          </span>
        </Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.TOKEN) {
    return (
      <ModalBase
        okText={withEffect(<span>{awardItemOkText}</span>, () =>
          referFriendExpose(['awardRecordPopUp', '1'], { giftName: GIFT_MAP.ReferralBonusGift3 }),
        )}
        title={'Token'}
        awardImgUrl={prize1}
        showClose={!hasGotFinalAward}
        onOk={() => {
          if (hasGotFinalAward) {
            clearModal();
            return;
          }
          referFriendTrackClick(['awardRecordPopUp', '1'], {
            giftName: GIFT_MAP.ReferralBonusGift3,
          });
          goShare();
        }}
        onCloseIconClick={() => {
          referFriendTrackClick(['awardRecordPopUp', '2'], {
            giftName: GIFT_MAP.ReferralBonusGift3,
          });
          clearModal();
        }}
      >
        <Child>
          <span>
            {/* <span className="highlight">50 USDT Token，可直接当现金使用</span>；奖励将在活动结束后，
            <span className="tip">三天内发放到账</span> */}
            {_tHTML('pwnEcbtrQwyahopgyPvNW3', {
              num: '50',
            })}{' '}
            {_tHTML('7RRJF7ttVxM7SePzW6gVzZ')}
          </span>
        </Child>
      </ModalBase>
    );
  }

  // 助力奖品-礼包3后的平台助力弹窗
  if (curModalId === MODAL_MAP.POWER_AWARDS_PACKAGE_AFTER_3_PLATFORM_DYNAMICAL_POPUP_WINDOW) {
    return (
      <ModalBase
        okText={_t('14JCEf4ta3HfFTtgCKBQZs')}
        title={withEffect(<span>{_t('bfrBjNC2zU35mF3WGaB3Ta')}</span>, () =>
          referFriendExpose(['inviterBonusPopUp2', '1']),
        )}
        awardImgUrl={prize0}
        awardImg91
        onOk={() => {
          referFriendTrackClick(['inviterBonusPopUp2', '1']);
          clearModal();
          triggerPlatformAssist();
        }}
      >
        <Child>
          <span>
            {_tHTML('wJ1n2GeZW1oZfKurrfWzgz', {
              num: '10,000',
            })}
            {/* 恭喜你，解锁<span className="highlight"> 10,000 USDT</span> 提现资格！ */}
          </span>
        </Child>
      </ModalBase>
    );
  }

  if (curModalId === MODAL_MAP.INVITER_BOOST_WELFARE_POPUP_WINDOW) {
    return renderModal1();
  }

  if (curModalId === MODAL_MAP.BOOST_PRIZE_WINNING_POP_UP_WINDOW) {
    return renderModal2();
  }

  if (curModalId === MODAL_MAP.FRIENDS_HELP_RESULTS_WINDOW) {
    return renderModal3();
  }

  // 被邀请人助力福利弹窗
  if (curModalId === MODAL_MAP.BE_INVITER_BOOST_WELFARE_POPUP_WINDOW) {
    return renderModal4();
  }

  return null;
};

export default Modals;
