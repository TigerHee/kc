/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { useKyc } from 'components/Spotlight/SpotlightR7/hooks';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { getReward, postReward } from 'src/services/spotlight8';
import { _t } from 'tools/i18n';
import { EnumStatus } from 'TradeActivityCommon/StatusModal';
import ChooseCoinModal from './ChooseCoinModal';
import { EVENT_STATUS } from './constants';
import { Participate } from './Participate';
import RewardModal from './RewardModal';
import StatusModal from './StatusModal';
import SubscribeModal from './SubscribeModal';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 2;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  border: none;
  margin-bottom: -1px;
  min-height: 250px;

  &.done {
    color: #8c8c8c;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px;
  }
`;


// 定义弹窗状态枚举
const ModalState = {
  IDLE: 'IDLE',
  CHOOSE_COIN: 'CHOOSE_COIN',
  STAKING: 'STAKING',
  STATUS: 'STATUS',
  REWARD: 'REWARD',
};

const ActiveProcess = () => {
  const dispatch = useDispatch();
  const { handleKyc } = useKyc();

  const [currentModal, setCurrentModal] = useState(ModalState.IDLE);
  const [rewardInfo, setRewardInfo] = useState({});
  const eventStatus = useSelector((state) => state.spotlight8.eventStatus);
  // 用户未申购选择的币种
  const [selectedCoin, setSelectedCoin] = useState('');
  const [statusConfig, setStatusConfig] = useState({
    title: '',
    text: '',
    status: '',
    okText: '',
    cancelText: '',
    onOk: null,
    onCancel: null,
  });

  const isLogin = useSelector((state) => state.user.isLogin);
  const campaignId = useSelector((state) => state.spotlight8.detailInfo?.campaignId);
  // 用户已申购后选择的币种
  const previousSubscribeCurrency = useSelector(
    (state) => state.spotlight8.summary?.userInvestSummary?.userInvestCurrency,
  );

  // 没有申购使用的币种即为首次申购
  const isFirstSubscribe = !previousSubscribeCurrency;

  // 申购使用的币种, 首次申购则使选币对话框选中的币种
  const subscribeCurrency = previousSubscribeCurrency || selectedCoin;

  // 处理币种选择
  const handleCoinConfirm = useCallback((coinName) => {
    setSelectedCoin(coinName);
    setCurrentModal(ModalState.STAKING);
  }, []);

  // 显示对话框弹窗提示
  const showDlgTip = useCallback((options) => {
    setStatusConfig({
      // 我知道了
      okText: _t('6d0dbad46c024000a3c9'),
      cancelText: null,
      onOk: () => setCurrentModal(ModalState.IDLE),
      onCancel: () => setCurrentModal(ModalState.IDLE),
      ...options,
    });

    setCurrentModal(ModalState.STATUS);
  }, []);

  // 显示 kyc 未完成弹窗
  const showKycDlg = useCallback(() => {
    setStatusConfig({
      // 请验证您的账户
      title: _t('a808882b4fd64000a5ab'),
      // 完成验证, 开启充币、买入及交易权限
      text: _t('43c3c7444af54000a9c3'),
      status: EnumStatus.Error,
      // 完成验证
      okText: _t('45fe03b75dfd4000aacf'),
      // 取消
      cancelText: _t('cancel'),
      onOk: handleKyc,
      onCancel: () => setCurrentModal(ModalState.IDLE),
    });

    setCurrentModal(ModalState.STATUS);
  }, [handleKyc]);

  // 显示申购相关弹窗: 未选币种则打开选择币种弹窗, 否则打开认购弹窗
  const showSubscribeDlg = useCallback(() => {
    if (isFirstSubscribe) {
      setCurrentModal(ModalState.CHOOSE_COIN);
    } else {
      setCurrentModal(ModalState.STAKING);
    }
  }, [isFirstSubscribe]);

  // 处理领取奖励
  const handleRewardConfirm = () => {
    // 调用接口
    postReward(campaignId).then((res) => {
      if (res.success) {
        setRewardInfo(res.data);
      }
    });
    setCurrentModal(ModalState.IDLE);
  };

  // 处理质押金额确认
  const handleSubscribeConfirm = ({ subAmount, stakingAmount, subToken }) => {
    try {
      dispatch({
        type: 'spotlight8/subcribe',
        payload: {
          subToken,
          subAmount,
          stakingAmount,
          campaignId,
        },
      }).then((res) => {
        if (res.success) {
          // 总申购数量(可能出现部分申购失败的情况, 只要不是全部失败, 就显示成功, 接口会返回成功的数量)
          const totalSubAmount = res.data?.amount || 0;
          // 成功状态
          setStatusConfig({
            title: _t('7d1e19edf73d4000a20e'),
            text: _t('d5fe06bb031e4000a6e8', { tokenNum: totalSubAmount, tokenName: subToken }),
            status: EnumStatus.Success,
            okText: _t('i.know'),
            cancelText: _t('back'),
            onOk: () => {
              // 处理查看逻辑
              setCurrentModal(ModalState.IDLE);
            },
            onCancel: () => setCurrentModal(ModalState.IDLE),
          });
          //显示质押的信息
          setCurrentModal(ModalState.STATUS);
          dispatch({
            type: 'spotlight8/getActivitySubcribeCount',
          });
        }
      });
    } catch (error) {
      // 失败状态
      setStatusConfig({
        title: _t('efc853e99ec34000a1c0'),
        text: error.message,
        status: EnumStatus.Error,
        //okText: _t('retry'),
        cancelText: _t('back'),
        //onOk: () => setCurrentModal(ModalState.STAKING),
        onCancel: () => setCurrentModal(ModalState.IDLE),
      });
      setCurrentModal(ModalState.STATUS);
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    // 如果未开始, 调用查询预约状态的接口, 其他状态查询无意义
    if (EVENT_STATUS.NOT_START === eventStatus) {
      dispatch({ type: 'spotlight8/getIsBooked', payload: { id: campaignId } });
    }
    // 如果用户已登录且活动状态为分发中, 则调用领取奖励接口
    if (eventStatus !== EVENT_STATUS.DISTRIBUTING) return;
    getReward(campaignId).then((res) => {
      if (
        res.success &&
        res.data &&
        !res.data.rewardConfirmed &&
        Number(res.data.rewardAmount) > 0
      ) {
        setRewardInfo(res.data);
        setCurrentModal(ModalState.REWARD);
      }
    });
  }, [dispatch, isLogin, campaignId, eventStatus]);

  return (
    <Wrapper>
      <ContentWrapper>
        {/* 活动进度 & 参与区块  */}
        <Participate
          showKycDlg={showKycDlg}
          showDlgTip={showDlgTip}
          showSubscribeDlg={showSubscribeDlg}
        />
      </ContentWrapper>
      {/* 选择认购币种弹窗  */}
      <ChooseCoinModal
        visible={currentModal === ModalState.CHOOSE_COIN}
        onClose={() => setCurrentModal(ModalState.IDLE)}
        onConfirm={handleCoinConfirm}
      />
      {/* Subscribe认购数量弹窗  */}
      {currentModal === ModalState.STAKING && (
        <SubscribeModal
          visible={currentModal === ModalState.STAKING}
          setSelectedCoin={setSelectedCoin}
          // 是否为首次认购, 未认购过则为true
          isFirstSubscribe={isFirstSubscribe}
          selectedCoin={subscribeCurrency}
          onClose={() => setCurrentModal(ModalState.IDLE)}
          onConfirm={handleSubscribeConfirm}
        />
      )}

      {/* 状态结果弹窗  */}
      <StatusModal
        visible={currentModal === ModalState.STATUS}
        contentTitle={statusConfig.title}
        contentText={statusConfig.text}
        okText={statusConfig.okText}
        cancelText={statusConfig.cancelText}
        resultStatus={statusConfig.status}
        onOk={statusConfig.onOk}
        onCancel={statusConfig.onCancel}
      />
      {/* 领取奖励弹窗  */}
      <RewardModal
        visible={currentModal === ModalState.REWARD}
        onClose={() => setCurrentModal(ModalState.IDLE)}
        onConfirm={handleRewardConfirm}
        rewardInfo={rewardInfo}
      />
    </Wrapper>
  );
};

export default memo(ActiveProcess);
