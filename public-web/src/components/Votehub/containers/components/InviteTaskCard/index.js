/**
 * Owner: saiya.lee@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useState, useEffect, useCallback } from 'react';
import { Divider, Dialog, useResponsive, Button, useSnackbar } from '@kux/mui';
import { ICInfoOutlined, ICShareOutlined } from '@kux/icons';
import { _t, _tHTML } from 'tools/i18n';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import copyText from 'copy-to-clipboard';
import { useShare } from 'src/components/Votehub/hooks';
import { useViewModel, useAsyncCallback } from './useViewModel';
import TaskCard from '../TaskCard';
import {
  TooltipContentWrapper,
  MTooltipDialog,
  LabelText,
  OperatorActionsWrapper,
} from './styled';

export function InviteTaskCard() {
  const vm = useViewModel();
  if (!vm.taskInfo) return null;

  return (
    <>
      {vm.hasExtraTask ? <Divider /> : null}
      <TaskCard
        title={<InviteTitle taskInfo={vm.taskInfo} />}
        tag={_t('71oucZ3hoiHwYisbQ856HM')}
        // desc="邀请好友注册，即可获得投票票数"
        desc={_t('578d3418d23f4000aced', { totalAmount: vm.taskInfo.tradeAmount, netAmount: vm.taskInfo.depositAmount })}
        // 有 xx 张票待领取
        label={!!vm.ticketCount && <LabelText>{_tHTML('wHQ8xwfUHgRbQTQfs3GCZA', { num: vm.ticketCount })}</LabelText>}
        ticketCount={vm.ticketCount}
        operator={<OperatorActions ticketCount={vm.ticketCount} onReceive={vm.receiveTicket} />}
      />
    </>
  )
}

function InviteTitle({taskInfo}) {
  const [visible, setVisible] = useState(false);
  return (
    <span className='title'>
      {/* 邀请好友获取票数 */}
      <span>{_t('07f6d13ec8144000ab0b')}</span>
      <ICInfoOutlined onClick={() => setVisible(true)} />
      <RuleDialog taskInfo={taskInfo} visible={visible} onClose={() => setVisible(false)} />
    </span>
  )
}

function RuleDialog({ visible, onClose, taskInfo }) {
  const [show, setShow] = useState(visible);
  // sm 为 false 表示小屏幕, 奇怪的逻辑
  const { sm } = useResponsive();
  const isH5 = !sm;
  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setTimeout(() => {
        setShow(false);
      }, 300);
    }
  }, [visible])

  if (!show) return null;
  const ruleContent = (<TooltipContentWrapper>
    <ol>
      {/* 每周重复 */}
      <li>{_t('8027fba81c754000af9b')}</li>
      {/* 交易送票规则 */}
      <li>{_t('8f3c6d7cdb6b4000aa9b', {
        netAmount: taskInfo.depositAmount,
        netTicket: taskInfo.depositPoint,
        totalAmount: taskInfo.tradeAmount,
        totalTicket: taskInfo.tradePoint,
        kycTicket: taskInfo.kycPoint,
      })}</li>
      {/* 每周邀请 {num} 新注册好友时均可获得奖励 */}
      <li>{_t('8bb6ba745db54000af67', {
        num: taskInfo.inviteAmount,
      })}</li>
    </ol>
  </TooltipContentWrapper>)
  if (isH5) {
    return (
      <MTooltipDialog
        // 活动规则说明
        title={_t('e68eec54e7624000a0cc')}
        show={visible}
        onCancel={onClose}
        onOk={onClose}
        onBack={onClose}
        onClose={onClose}
        maskClosable={true}
        // 我知道了
        okText={_t('6d0dbad46c024000a3c9')}
        cancelText={null}
        centeredFooterButton
      >
        {ruleContent}
      </MTooltipDialog>
    )
  }
  return (
    <Dialog
      // 活动规则说明
      title={_t('e68eec54e7624000a0cc')}
      open={visible}
      onOk={onClose}
      // 我知道了
      okText={_t('6d0dbad46c024000a3c9')}
      cancelText={null}
      onCancel={onClose}
    >
      {ruleContent}
    </Dialog>
  )
}

function OperatorActions({ ticketCount, onReceive }) {
  const handleShare = useShare();
  const { message } = useSnackbar();
  const user = useSelector((state) => state.user.user, shallowEqual);
  // 邀请码, 合伙人则为合伙人邀请码, 否则为普通用户邀请码
  const referralCode = useSelector((state) => state.user.referralCode, shallowEqual);
  // sm 为 false 表示小屏幕, 奇怪的逻辑
  const { sm } = useResponsive();
  const btnSize = !sm ? 'mini' : 'basic';
  const [receiveTicket, isLoading] = useAsyncCallback(onReceive);

  const onShare = useCallback(() => {
    // 未登陆时调用 handleShare 会触发登陆, 复制以前逻辑
    if (JsBridge.isApp() || !user) {
      handleShare();
    } else {
      copyText(formatURL(window.location.href, { rcode: referralCode}));
      // 邀请码已复制, 请分享给好友
      message.success(_t('3c1b74b4b3cd4000af69'));
    }
  },[user, handleShare, message, referralCode]);

  return (
    <OperatorActionsWrapper>
      {!!ticketCount && <Button
      className='btn-receive'
      size={btnSize}
      onClick={receiveTicket}
      loading={isLoading}>
        {/* 领取奖励 */}
        {_t('6oWuXUkyKH81eEYxN8RgCH')}
      </Button>}
      <Button size={btnSize} onClick={onShare}>
        <ICShareOutlined size={!sm ? 12 : 16} />
        <span style={{width: !sm ? 4: 6}} />
        {/* {_t('邀请好友')} */}
        {_t('43fcc9080a494000a786')}
      </Button>
    </OperatorActionsWrapper>
  )
}

// 构造url, 避免直接拼接 query 导致的各种问题
function formatURL(u, query) {
  const url = new URL(u);
  if (!query) return url;
  Object.keys(query).forEach(key => {
    url.searchParams.set(key, query[key]);
  });
  return url.href;
}
