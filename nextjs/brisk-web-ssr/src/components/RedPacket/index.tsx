/**
 * Owner: willen@kupotech.com
 * NewRedPacket main component - converted to TypeScript with zustand and @kux/mui-next
 */
import React, { useEffect, useState } from 'react';
import { Modal, Empty } from '@kux/design';
import { useResponsive, Dialog, Spin } from '@kux/mui-next';
import { useRedPacketStore } from '@/store/redPacket';
import { useUserStore } from '@/store/user';
import { saTrackForBiz } from '@/tools/ga';
import OpenedRedPacket from './OpenedRedPacket';
import UnopenedRedPacket from './UnopenedRedPacket';
import styles from './styles.module.scss';

interface RedPacketModalProps {
  code?: string;
  redPacketInfo: any;
}

// welfareStatus: -1:异常状态  0:不存在 1:可领取 2:已抢完 3:已过期
const RedPacketModal: React.FC<RedPacketModalProps> = ({ code, redPacketInfo }) => {
  const receiving = useRedPacketStore((state) => state.receiving);
  const isLogin = useUserStore((state) => state.isLogin);
  const { isReceive, welfareStatus, sendRecordId } = redPacketInfo;
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const { xs, sm } = useResponsive();
  const isSm = xs && !sm;

  const showResourceTip = useRedPacketStore(state =>state.showResourceTip);
  const resourceTipData = useRedPacketStore(state =>state.resourceTipData);

  // 设置是否领取中
  const setReceiving = (_receiving: boolean) => {
    useRedPacketStore.getState().setReceiving(_receiving);
  };

  const closeTip = () => useRedPacketStore.getState().closeTip();

  useEffect(() => {
    if (visible && sendRecordId) {
      saTrackForBiz({}, ['ed_envelope', '1']);
    }
  }, [visible, sendRecordId]);

  // if (!code) {
  //   return null;
  // }

  // 显示领取红包-资源位中台错误提示
  useEffect(() => {
    if (!showResourceTip || !resourceTipData) return;
    Modal.confirm({
      title: null,
      content: (
        <Empty name='warn' size='small' description={resourceTipData.content} />
      ),
      okText: resourceTipData.btnText,
      cancelText: null,
      closeSync: false,
    }).then(ok => {
      if (ok) {
        app.openLink({
          webLink: resourceTipData.link,
          appLink: resourceTipData.link,
          open: 'new'
        });
      }
      closeTip();
    });
  }, [showResourceTip, resourceTipData]);

  const renderModalContent = () => {
    // 如果已经领取 或 抢完已登录， 直接到详情页面
    if (isReceive || (welfareStatus === 2 && isLogin)) {
      return <OpenedRedPacket onClose={() => setVisible(false)} />;
      // 其他情况全是弹窗未打开
    }
    return isOpened ? (
      <OpenedRedPacket onClose={() => setVisible(false)} />
    ) : (
      <UnopenedRedPacket
        code={code as string}
        onOpen={() => setIsOpened(true)}
        onClose={() => setVisible(false)}
        receiving={receiving}
        setReceiving={setReceiving}
      />
    );
  };

  return sendRecordId ? (
    <Dialog
      className={styles.redPacketDialog}
      header={null}
      title={null}
      open={visible}
      footer={null}
      maskClosable={false}
      closable={false}
    >
      <Spin
        className={styles.redPacketDialogSpin}
        type="brand"
        size={isSm ? 'small' : 'basic'}
        spinning={receiving}
      >
        <div className={styles.redPacketDialogContent}>{renderModalContent()}</div>
      </Spin>
    </Dialog>
  ) : null;
};

export default RedPacketModal;
