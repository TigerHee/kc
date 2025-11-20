import { useResponsive, useTheme } from '@kux/mui';
import { useState } from 'react';
import AssetsWebCompManager from 'src/mfRemoteComponents/AssetsWebCompManager';
import List from './components/List';
import Table from './components/Table';

const { WhtFormDialog } = AssetsWebCompManager;

const ASSET_TYPE = {
  NEW: 'NEW',
  OLD: 'OLD',
};

export default function AssetsCostReport({
  dataSource = [],
  loading = false,
  onAssetChange,
  // needShowAgree = false,
  onRetry,
}) {
  const theme = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const [target, setTarget] = useState(null);
  // const { currency, totalAmount, needTax, startDate, endDate, unitCost } = target || {};
  const { currency, totalAmount, needTax, assetAcquireStartTime, assetAcquireEndTime, unitCost } =
    target || {};

  return (
    <>
      {isH5 ? (
        <List dataSource={dataSource} loading={loading} onDeclare={setTarget} onRetry={onRetry} />
      ) : (
        <Table dataSource={dataSource} loading={loading} onDeclare={setTarget} onRetry={onRetry} />
      )}
      <WhtFormDialog
        theme={theme.currentTheme}
        show={Boolean(target)}
        assetType={typeof needTax === 'boolean' ? (needTax ? ASSET_TYPE.NEW : ASSET_TYPE.OLD) : ''}
        costCurrency={currency}
        needShowAgree={false}
        costValue={totalAmount}
        cost={unitCost}
        startDate={assetAcquireStartTime}
        endDate={assetAcquireEndTime}
        onCancel={() => setTarget(null)}
        onConfirm={(res) => {
          onAssetChange?.({ data: { target }, ...res });
          setTarget(null);
        }}
      />
    </>
  );
}
