import UserAvatarWithName from '@/components/UserAvatarWithName';
import { createApiKey, getApiKeyList } from '@/services/apikeys';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { API } from 'types';

const ApikeyList: React.FC = () => {
  const formRef = useRef<
    ProFormInstance<{
      name: string;
      remark: string;
      role: string;
      duration: number;
    }>
  >();

  const tableRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ProColumns<API.ApiKeysItem>[] = [
    // {
    //   title: 'id',
    //   dataIndex: '_id',
    //   valueType: 'text',
    //   fixed: 'left',
    //   width: 200,
    //   copyable: true,
    //   ellipsis: true,
    //   hideInSearch: true,
    // },
    {
      title: '密钥',
      fixed: 'left',
      hideInSearch: true,
      dataIndex: 'secret',
      valueType: 'password',
      width: 280,
      copyable: true,
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      valueType: 'text',
      width: 220,
      hideInSearch: true,
      renderText: (owner) => {
        return <UserAvatarWithName user={owner} />;
      },
    },
    {
      title: '失效时间',
      dataIndex: 'duration',
      width: 220,
      hideInSearch: true,
      renderText: (duration, record) => {
        const expired = new Date(record.createdAt).getTime() + duration * 1000;
        return new Date(expired).toLocaleString();
      },
    },
    {
      title: '备注',
      width: 220,
      dataIndex: 'remark',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '创建时间',
      hideInSearch: true,
      width: 220,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '最后使用时间',
      hideInSearch: true,
      width: 220,
      fixed: 'right',
      dataIndex: 'lastUsedAt',
      valueType: 'dateTime',
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formRef.current?.resetFields();
  };

  return (
    <div>
      <PageContainer
        header={{
          title: null,
        }}
      >
        <ProTable
          headerTitle="任务列表"
          expandable={{
            fixed: 'left',
          }}
          actionRef={tableRef}
          rowKey="_id"
          columns={columns}
          request={async () => {
            const data = await getApiKeyList();
            return {
              data,
              success: true,
            };
          }}
          toolBarRender={() => [
            <Button key="add" type="primary" onClick={() => setIsModalOpen(true)}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
        />
      </PageContainer>

      <Modal title="新增APIKEYS" open={isModalOpen} onCancel={handleCloseModal} footer={false}>
        <ProForm
          formRef={formRef}
          onFinish={(values) => {
            console.log('onFinish.values', values);
            createApiKey({
              duration: values.duration,
              remark: values.remark,
              data: {
                name: values.name,
                role: values.role.value,
                remark: values.remark,
              },
            }).then(() => {
              message.success('创建成功');
              handleCloseModal();
              tableRef.current?.reload();
            });
          }}
        >
          <ProFormText
            width="md"
            name="remark"
            label="备注"
            required={true}
            placeholder="请输入使用的备注"
          />
          <ProFormText
            width="md"
            name="name"
            label="名称"
            required={true}
            placeholder="作为标识的名称 P.S. web-checker@2025"
          />
          <ProFormSelect.SearchSelect
            width="md"
            required={true}
            options={[
              {
                value: 'user',
                label: '用户范围',
              },
              {
                value: 'admin',
                label: '管理员范围',
              },
            ]}
            name="role"
            mode="single"
            label="权限范围"
          />
          <ProFormDigit
            required={true}
            name="duration"
            label="授权时长"
            width="md"
            min={3600}
            max={365 * 24 * 60 * 60}
          />
        </ProForm>
      </Modal>
    </div>
  );
};
export default ApikeyList;
