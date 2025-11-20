import { GetProp, Table, TableColumnsType, Transfer } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { TransferProps } from 'antd/es/transfer';
import { ComplianceAPI } from 'types/compliance';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

export interface ComplianceDemandTableTransferProps extends TransferProps<TransferItem> {
  dataSource: ComplianceAPI.ComplianceAtomicItem[];
  leftColumns: TableColumnsType<ComplianceAPI.ComplianceAtomicItem>;
  rightColumns: TableColumnsType<ComplianceAPI.ComplianceAtomicItem>;
}

const ComplianceDemandTableTransfer: React.FC<ComplianceDemandTableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: '100%' }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            expandable={{
              fixed: 'left',
            }}
            scroll={{ x: 'max-content' }}
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

export default ComplianceDemandTableTransfer;
