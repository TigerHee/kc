import UserAvatarWithName from '@/components/UserAvatarWithName';
import { deleteComplianceDemand, getComplianceDemandList } from '@/services/compliance';
import { getUserListOptions } from '@/services/user';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Badge, Button, Popconfirm, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Common } from 'types/common';
import { ComplianceAPI } from 'types/compliance';
import CreateComplianceDemandModalWithButton from './components/CreateComplianceDemandModalWithButton';
import { history } from '@umijs/max';

const ComplianceDemandList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);
  const columns: ProColumns<ComplianceAPI.ComplianceDemandItem>[] = [
    {
      title: '需求标题',
      width: 250,
      dataIndex: 'title',
      fixed: 'left',
    },
    {
      title: '方案地址',
      hideInSearch: true,
      dataIndex: 'schemeUrl',
      width: 250,
      renderText: (_, record) => {
        return (
          <a target="_blank" href={record.schemeUrl} rel="noreferrer">
            {record.schemeUrl}
          </a>
        );
      },
    },
    {
      title: 'PRD地址',
      hideInSearch: true,
      dataIndex: 'prdUrl',
      width: 250,
      renderText: (_, record) => {
        return (
          <a target="_blank" href={record.prdUrl} rel="noreferrer">
            {record.prdUrl}
          </a>
        );
      },
    },
    {
      dataIndex: 'owner',
      title: '负责人',
      valueType: 'select',
      valueEnum: userOptions.reduce((acc, cur) => {
        Object.assign(acc, {
          [cur.value]: { text: cur.label },
        });
        return acc;
      }, {}),
      width: 200,
      renderText(text, record) {
        return <UserAvatarWithName user={record.owner} />;
      },
    },
    {
      title: '上线时间',
      dataIndex: 'publicAt',
      colSize: 2,
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      colSize: 2,
      valueType: 'dateTime',
      hideInSearch: true,
      width: 220,
    },
    {
      title: '关联代码',
      dataIndex: 'codeScan',
      width: 200,
      hideInSearch: true,
      renderText: (_, record) => {
        if (Array.isArray(record?.codeScan) && record?.codeScan.length > 0) {
          return <Badge count={record.codeScan.length} color="green" />;
        } else {
          return '-';
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 220,
      render: (_, record) => {
        return (
          <div
            style={{ gap: 10, display: 'flex', justifyItems: 'center', justifyContent: 'center' }}
          >
            <Popconfirm
              key="delete"
              placement="topLeft"
              title="确认删除吗？"
              description="正在删除合规需求，请确认操作"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {
                deleteComplianceDemand(record._id).then(() => {
                  message.success('删除成功');
                  actionRef.current?.reload();
                });
              }}
            >
              <Button variant="dashed" color="danger">
                删除
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={() => {
                history.push('/compliance/demand/detail/' + record._id);
              }}
            >
              查看
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getUserListOptions().then((res) => {
      setUserOptions(res);
    });
  }, []);

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <ProTable
        actionRef={actionRef}
        toolBarRender={() => [
          <CreateComplianceDemandModalWithButton
            key="create"
            userOptions={userOptions}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        rowKey="_id"
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        search={{
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const res = await getComplianceDemandList(params);
          return {
            success: true,
            data: res.list,
            total: res.total,
          };
        }}
      />
    </PageContainer>
  );
};

export default ComplianceDemandList;
