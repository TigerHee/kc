import { CodeBlock } from '@/components/CodeBlock';
import {
  deleteComplianceAtomic,
  getComplianceAtomicList,
  updateComplianceAtomicIsSkip,
} from '@/services/compliance';
import { getReposOptions } from '@/services/repos';
import { getFileLink } from '@/utils/bitbucket';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Common } from 'types/common';
import { ComplianceAPI } from 'types/compliance';
import UpdateComplianceAtomicModalWithButton from './components/UpdateComplianceAtomicModalWithButton';

const ComplianceAtomicList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [repoOptions, setRepoOptions] = useState<Common.ReposOptionItem[]>([]);

  const columns: ProColumns<ComplianceAPI.ComplianceAtomicItem>[] = [
    {
      title: '代码链接',
      width: 100,
      hideInSearch: true,
      align: 'left',
      fixed: 'left',
      tooltip: '点击跳转到bitbucket查看代码文件',
      render(_, record) {
        return (
          <a
            target="_blank"
            href={getFileLink(record.slug, record.repo, record.path, record.line)}
            rel="noreferrer"
          >
            #{record.line}
          </a>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 150,
      fixed: 'left',
      valueType: 'text',
      valueEnum: {
        CompliantBox: {
          text: '合规组件',
          status: 'Processing',
        },
        useCompliantShow: {
          text: '合规hook',
          status: 'Success',
        },
        HardCodeCountryCode: {
          text: '硬编码国家编码',
          status: 'Default',
        },
      },
    },
    {
      title: '代码片段',
      dataIndex: 'code',
      hideInSearch: true,
      width: 540,
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
      valueType: 'text',
      align: 'center',
      valueEnum: repoOptions
        .sort((a, b) => a.label.localeCompare(b.label))
        .reduce((prev, curr) => {
          Object.assign(prev, { [curr.value]: { text: curr.label } });
          return prev;
        }, {}),
      width: 140,
    },
    {
      title: '文件',
      dataIndex: 'path',
      valueType: 'text',
      width: 260,
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 220,
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: 'spm',
      dataIndex: 'spm',
      valueType: 'text',
      width: 140,
    },
    {
      title: '注释',
      dataIndex: 'comment',
      width: 180,
      valueType: 'text',
    },
    {
      title: '关联的需求',
      width: 240,
      align: 'left',
      hideInSearch: true,
      renderText: (_, record) => {
        if (!Array.isArray(record.complianceDemand) || record.complianceDemand.length === 0) {
          return '-';
        }
        return (
          <>
            {record.complianceDemand.map((demand) => {
              return (
                <div key={demand._id}>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`/compliance/demand/detail/${demand._id}`);
                    }}
                  >
                    {demand.title}
                  </a>
                </div>
              );
            })}
          </>
        );
      },
    },
    {
      title: '忽略检查',
      dataIndex: 'isSkip',
      width: 100,
      align: 'center',
      valueType: 'select',
      initialValue: 'false',
      tooltip: '标记为忽略的数据，将会视为不是合规相关的代码，下次扫描到不会更新数据，会忽略',
      valueEnum: {
        true: { text: '是', status: 'Success' },
        false: { text: '否', status: 'Default' },
      },
    },
    {
      title: '扫描删除',
      dataIndex: 'isScanDeleted',
      align: 'center',
      width: 100,
      valueType: 'select',
      tooltip:
        '扫描已上线的代码中不存在的代码，将会标记为扫描删除，人为二次确认是否需要从管理列表中彻底删除',
      valueEnum: {
        true: { text: '是', status: 'Error' },
        false: { text: '否', status: 'Default' },
      },
    },
    {
      title: '操作',
      width: 220,
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      renderText: (_, record) => {
        return (
          <>
            <Button.Group>
              {record.isSkip ? (
                <Button
                  color="primary"
                  type="dashed"
                  onClick={() => {
                    updateComplianceAtomicIsSkip([record._id], false).then(() => {
                      message.success('取消忽略成功');
                      actionRef.current?.reload();
                    });
                  }}
                >
                  取消忽略
                </Button>
              ) : (
                <Popconfirm
                  key="delete"
                  placement="topLeft"
                  title="确认忽略吗？"
                  description="忽略后，代码扫描到这处内容将不会记录和更新，请确认操作"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => {
                    updateComplianceAtomicIsSkip([record._id], true).then(() => {
                      message.success('忽略成功');
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <Button type="dashed" color="primary">
                    忽略
                  </Button>
                </Popconfirm>
              )}
              <UpdateComplianceAtomicModalWithButton
                id={record._id}
                values={record}
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
              <Popconfirm
                key="delete"
                placement="topLeft"
                title="确认删除吗？"
                description="扫描的结果将会被删除，请确认操作"
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                  deleteComplianceAtomic([record._id]).then(() => {
                    message.success('删除成功');
                    actionRef.current?.reload();
                  });
                }}
              >
                <Button type="primary" danger color="danger">
                  删除
                </Button>
              </Popconfirm>
            </Button.Group>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getReposOptions().then((res) => {
      setRepoOptions(res);
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
        rowKey="_id"
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        search={{
          defaultCollapsed: false,
        }}
        request={async (params) => {
          const res = await getComplianceAtomicList(params);
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

export default ComplianceAtomicList;
