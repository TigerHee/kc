/**
 * Owner: jesse@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { styled } from '@kufox/mui';

import { Download } from './SvgIcon';
import useExport from '../hooks/useExport';
import useExportMsg from '../hooks/useExportMsg';

const Wrap = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(0, 13, 29, 0.04);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -12px;

  .icon {
    display: flex;
    width: 24px;
    color: #000d1d;
    cursor: pointer;
    &:hover {
      color: #01bc8d;
    }
  }
`;

const MsgDot = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  background: ${(props) => (props.status == '2' ? '#01BC8D' : '#EC6767')};
`;

const ExportTrigger = () => {
  const { setShowDrawer } = useExport();
  const { exportMsgData = {} } = useExportMsg();
  const { hasNewMsg = false, status } = exportMsgData;

  // 有未读消息且任务状态在导出中（0/1）导出完成（2）
  const isShowMsgDot = hasNewMsg && (status == 0 || status == 2 || status == 1);

  return (
    <Wrap className="AffiliateRound2-ExportTrigger">
      <div className="icon" onClick={setShowDrawer} role="button" tabIndex={0}>
        <Download />
      </div>
      {isShowMsgDot ? <MsgDot status={status} /> : null}
    </Wrap>
  );
};

export default ExportTrigger;
