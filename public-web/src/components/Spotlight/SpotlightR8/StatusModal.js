/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-02-21 10:42:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-02-24 20:32:47
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/StatusModal.js
 * @Description:
 */

import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';

export default ({
  contentTitle,
  contentText,
  visible,
  onCancel,
  onOk,
  okText,
  cancelText,
  resultStatus = EnumStatus.Warning,
}) => {

  return (
    <StatusModal
      destroyOnClose
      visible={visible}
      setDialogVisible={onCancel}
      resultStatus={resultStatus}
      contentTitle={contentTitle}
      contentText={contentText}
      handleSubmit={onOk}
      okText={okText}
      cancelText={cancelText}
    />
  );
};
