import { CodeBlock } from '@/components/CodeBlock';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, TableColumnsType } from 'antd';
import { TransferProps } from 'antd/es/transfer';
import { ComplianceAPI } from 'types/compliance';
import ComplianceDemandTableTransfer, {
  ComplianceDemandTableTransferProps,
} from './ComplianceDemandTableTransfer';
import { useState } from 'react';
import { updateComplianceDemandCodeScan } from '@/services/compliance';

interface EditCodeScanTransferModalWithButtonProps {
  id: string;
  onSuccess: () => void;
  values: ComplianceAPI.ComplianceAtomicItem[];
  atomicOptions: ComplianceAPI.ComplianceAtomicItem[];
}
const EditCodeScanTransferModalWithButton: React.FC<EditCodeScanTransferModalWithButtonProps> = (
  props,
) => {
  const { id, values, onSuccess, atomicOptions } = props;
  const [form] = Form.useForm();
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>(
    values.map((item) => item._id),
  );

  const transformColumns: TableColumnsType<ComplianceAPI.ComplianceAtomicItem> = [
    {
      title: '代码片段',
      dataIndex: 'code',
      width: 400,
      render: (_, record) => {
        return (
          <div>
            <CodeBlock
              data={[
                {
                  lineNumber: record.line,
                  code: record.code,
                },
              ]}
              highlineRow={0}
            />
          </div>
        );
      },
    },
    {
      title: '仓库',
      dataIndex: 'repo',
      align: 'center',
      width: 140,
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'spm',
      dataIndex: 'spm',
      width: 140,
    },
    {
      title: '注释',
      dataIndex: 'comment',
      width: 180,
    },
  ];

  const filterOption = (input: string, item: ComplianceAPI.ComplianceAtomicItem): boolean =>
    item.spm?.includes(input) ||
    item.comment?.includes(input) ||
    item.repo?.includes(input) ||
    item.code?.includes(input);

  const onChange: ComplianceDemandTableTransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <ModalForm
      style={{ width: '100%' }}
      title="创建合规需求"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: '100%',
      }}
      submitTimeout={2000}
      trigger={
        <Button
          block
          type="dashed"
          color="primary"
          style={{ margin: '5px 0' }}
          icon={<EditOutlined />}
        >
          关联代码
        </Button>
      }
      onFinish={async () => {
        try {
          await updateComplianceDemandCodeScan(id, targetKeys as string[]);
          onSuccess();
          form.resetFields();
          return true;
        } catch (error) {
          return false;
        }
      }}
      onOpenChange={(open) => {
        if (!open) {
          form.resetFields();
        } else {
        }
      }}
    >
      <p style={{ color: 'gray' }}>
        搜索功能说明：可以在搜索框中搜索内容，快速查找需要绑定或者移除的项，支持搜索内容：仓库名，代码备注，代码内容，spm
      </p>
      <ComplianceDemandTableTransfer
        showSearch={true}
        showSelectAll={true}
        dataSource={atomicOptions.map((o) => ({
          ...o,
          key: o._id,
        }))}
        targetKeys={targetKeys}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={transformColumns}
        rightColumns={transformColumns}
      />
    </ModalForm>
  );
};

export default EditCodeScanTransferModalWithButton;
