/**
 * Owner: garuda@kupotech.com
 * 全局都会注册的 Socket 订阅消息
 */
import useWorkerContractStatusSubscribe from '@/hooks/futures/useWorkerContractStatusSubscribe';
import useWorkerSnapshotSubscribe from '@/hooks/futures/useWorkerSnapshotSubscribe';
import useWorkerWalletSubscribe from '@/hooks/futures/useWorkerWalletSubscribe';
import useWorkerSubscribe from '@/hooks/useWorkerSubscribe';

const useGlobalSocketSubscribe = () => {
  // 订阅合约 notice 消息
  useWorkerSubscribe('/notice-center/notices', true);
  // 订阅合约 Snapshot.24h
  useWorkerSnapshotSubscribe();
  // 订阅合约 状态变化
  useWorkerContractStatusSubscribe();
  // 订阅合约 资产
  useWorkerWalletSubscribe();
};

export default useGlobalSocketSubscribe;
