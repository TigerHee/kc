/**
 * Owner: sean.shi@kupotech.com
 */
import { useState } from 'react';
import { LinkTermDialog } from './linkTermDialog';
import { TextTermDialog } from './textTermDialog';

export const UpdateTermDialog = ({
  // 用户更新协议列表
  userUpdateTermList,
  // 签署回调
  signTermHandle,
  // 拒绝回调
  refuseSignTermHandle,
  // 关闭弹窗回调
  onClose,
}) => {
  const linkTermList = userUpdateTermList.filter((item) => item.agreementForm === 'link');
  const textTermList = userUpdateTermList.filter((item) => item.agreementForm === 'text');

  // 如果有链接式协议，优先弹出链接式协议签署弹窗
  const [showLinkModal, setShowLinkModal] = useState(!!linkTermList.length);

  // 链接式弹窗签署完成回调
  const onLinkSignClose = () => {
    // 如果有文本式协议，弹出文本式协议签署弹窗
    if (textTermList.length) {
      setShowLinkModal(false);
    } else {
      // 否则关闭更新协议弹窗
      onClose?.();
    }
  };

  return userUpdateTermList.length ? (
    <>
      <LinkTermDialog
        visible={showLinkModal}
        signTermHandle={signTermHandle}
        refuseSignTermHandle={refuseSignTermHandle}
        onClose={onLinkSignClose}
        userUpdateTermList={linkTermList}
      />
      <TextTermDialog
        visible={!showLinkModal}
        signTermHandle={signTermHandle}
        refuseSignTermHandle={refuseSignTermHandle}
        onClose={onClose}
        userUpdateTermList={textTermList}
      />
    </>
  ) : null;
};
