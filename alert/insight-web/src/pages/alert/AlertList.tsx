import {
  getAlertList,
  getConfigStatus,
  getAlertGroupList,
  handleAlertScan,
} from '@/services/alert';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { API } from 'types';
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { Button, Space, Tag, Modal } from 'antd';
import { history } from '@umijs/max';
import type { ActionType } from '@ant-design/pro-components'; // 加入类型
import { decodeHtml } from './utils';

const AlertList: React.FC = () => {
  const [valueEnumStatus, setValueEnumStatus] = useState({});
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.AlertItem>[] = [
    {
      title: '告警组',
      dataIndex: 'alarmGroup',
      valueType: 'select',
      fixed: 'left',
      request: async () => {
        const res = await getAlertGroupList();
        const list: { label: string; value: string }[] = [];
        res?.forEach((item) => {
          list.push({
            label: item.name,
            value: item.name,
          });
        });
        return list;
      },
      width: 150,
      render: (text, item) => {
        return item.alarmGroup;
      },
    },
    {
      title: '应用',
      // hideInSearch: true,
      dataIndex: 'appKey',
      valueType: 'text',
      align: 'center',
      width: 150,
    },
    {
      title: '确认状态',
      dataIndex: 'status',
      valueType: 'select',
      request: async () => {
        const res = await getConfigStatus();
        const valueEnum: Record<string, { text: string }> = {};
        res?.forEach(({ label, value }) => {
          valueEnum[value] = { text: label };
        });
        setValueEnumStatus(valueEnum);
        return res;
      },
      valueEnum: valueEnumStatus,
      width: 160,
    },
    {
      title: '处理完成',
      // hideInSearch: true,
      dataIndex: 'isFinished',
      valueType: 'select',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
      align: 'center',
      width: 80,
      render: (text, item) =>
        item?.finishData?.email ? <Tag color="success">是</Tag> : <Tag color="default">否</Tag>,
    },
    {
      title: 'alertMsg',
      dataIndex: 'alertMsg',
      valueType: 'text',
      align: 'center',
      width: 300,
      render: (text) => (
        <span style={{ lineHeight: '130%', display: 'flex', wordBreak: 'break-all' }}>
          {decodeHtml(String(text))}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      align: 'left',
      width: 100,
      hideInSearch: true,
      render: (text) => {
        return dayjs(text as string | number).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '相关人',
      dataIndex: 'relationUser',
      valueType: 'text',
      align: 'left',
      width: 200,
      // hideInSearch: true,
      render: (text, item) => {
        const { teamsSendList, viewData, finishData } = item;
        return (
          <div style={{ fontSize: '12px' }}>
            <div>通知: {teamsSendList.join(',')}</div>
            {viewData?.email && <div>响应: {viewData?.email}</div>}
            {finishData?.email && <div>完成: {finishData?.email}</div>}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 140,
      valueType: 'text',
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      renderText(text, record) {
        const { _id, alarmGroup } = record;
        return (
          <Space size={10}>
            <Button
              onClick={() => {
                history.push(`/alert/detail?_id=${_id}&alarmGroup=${alarmGroup}`);
              }}
              type="primary"
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="_id"
        actionRef={actionRef}
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        search={{
          defaultCollapsed: false, // 👈 默认展开搜索栏
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        request={async (params) => {
          const res = await getAlertList(params);
          return {
            data: res.list,
            success: true,
            total: res?.pagination?.total,
          };
        }}
        toolBarRender={() => [
          <Button
            key="custom-button"
            type="dashed"
            onClick={() => {
              Modal.confirm({
                title: '确认执行同步数据操作？',
                content: '请避免频繁使用该操作，仅在需要时执行',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await handleAlertScan();
                  actionRef.current?.reload();
                },
              });
            }}
            danger
          >
            同步最新数据
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default AlertList;
