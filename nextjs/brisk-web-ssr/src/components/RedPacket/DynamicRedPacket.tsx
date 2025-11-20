/**
 * Owner: iron@kupotech.com
 * DynamicRedPacket component - converted to TypeScript with zustand
 */
import { getByCodeUsingGet, type WelfareRecordExistsResponse } from '@/api/welfare';
import { useRedPacketStore } from '@/store/redPacket';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DynamicRedPacket = dynamic(() => import('./index'));

const DynamicRedPacketWrapper: React.FC = () => {
  const { setRedPacketInfo } = useRedPacketStore();
  // 修改 redPacketInfo 的获取，使 dynamic 组件不依赖 homepage model
  const [redPacketInfo, setLocalRedPacketInfo] = useState<WelfareRecordExistsResponse>({});

  const code = useMemo(() => {
    const reg = new RegExp('(^|&)code=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r) {
      return decodeURIComponent(r[2]);
    }
    return null;
  }, []);

  const pullRedPacketInfo = useCallback(async () => {
    if (!code) return;

    try {
      const {data} = await getByCodeUsingGet({code});
      if (data) {
        setLocalRedPacketInfo(data);
        setRedPacketInfo(data);
      }
    } catch (e:any) {
      console.error(e);
    }
  }, [code, setRedPacketInfo]);

  useEffect(() => {
    if (code) {
      pullRedPacketInfo();
    }
  }, [code, pullRedPacketInfo]);

  return redPacketInfo.sendRecordId ? <DynamicRedPacket code={code as string} redPacketInfo={redPacketInfo} /> : null;
};

export default React.memo(DynamicRedPacketWrapper);
