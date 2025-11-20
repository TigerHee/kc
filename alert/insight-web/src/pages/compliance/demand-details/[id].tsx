import { CodeBlock } from '@/components/CodeBlock';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getComplianceAtomicOptions, getComplianceDemandDetail } from '@/services/compliance';
import { getFileLink } from '@/utils/bitbucket';
import { LeftOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { Button, Table, TableColumnsType } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { ComplianceAPI } from 'types/compliance';
import EditCodeScanTransferModalWithButton from '../components/EditCodeScanTransferModalWithButton';
import UpdateComplianceDemandModalWithButton from '../components/UpdateComplianceDemandModalWithButton';
import { getUserListOptions } from '@/services/user';
import { Common } from 'types/common';
import { KeepAliveTabContext } from '@/layouts/context';

const ComplianceDemandDetails: React.FC = () => {
  const { onShow } = useContext(KeepAliveTabContext);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ComplianceAPI.ComplianceDemandItem>();
  const [atomicOptions, setAtomicOptions] = useState<ComplianceAPI.ComplianceAtomicItem[]>([]);
  const [userOptions, setUserOptions] = useState<Common.UserSelectOptionItem[]>([]);

  const columns: TableColumnsType<ComplianceAPI.ComplianceAtomicItem> = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 200,
      fixed: 'left',
    },
    {
      title: '代码片段',
      dataIndex: 'code',
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
      align: 'center',
      width: 140,
    },
    {
      title: '文件',
      dataIndex: 'path',
      width: 260,
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
    {
      title: '代码链接',
      width: 100,
      align: 'center',
      fixed: 'right',
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
  ];

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    Promise.all([
      getComplianceAtomicOptions().then((res) => {
        setAtomicOptions(res);
      }),
      getUserListOptions().then((res) => {
        setUserOptions(res);
      }),
      getComplianceDemandDetail(id).then((res) => {
        setData(res);
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }, [id]);

  function handleUpdateData() {
    setLoading(true);
    getComplianceDemandDetail(id as string)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    onShow(() => {
      handleUpdateData();
      getComplianceAtomicOptions().then((res) => {
        setAtomicOptions(res);
      });
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer
      header={{
        title: (
          <Button
            size="small"
            icon={<LeftOutlined />}
            type="link"
            onClick={() => {
              history.push('/compliance/demand');
            }}
          >
            返回合规需求列表
          </Button>
        ),
      }}
      extra={
        <UpdateComplianceDemandModalWithButton
          id={id as string}
          data={data}
          userOptions={userOptions}
          onSuccess={() => {
            handleUpdateData();
          }}
        />
      }
    >
      <ProDescriptions bordered column={2} labelStyle={{ width: 200 }} loading={loading}>
        <ProDescriptions.Item label="需求标题" span={1}>
          {data.title}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="负责人" span={1}>
          <UserAvatarWithName user={data.owner} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="方案地址" span={1}>
          <a target="_blank" href={data.schemeUrl} rel="noreferrer">
            {data.schemeUrl}
          </a>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="PRD地址" span={1}>
          <a target="_blank" href={data.prdUrl} rel="noreferrer">
            {data.prdUrl}
          </a>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="巡检说明" span={1}>
          {data.patrol}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="需求备注" span={1}>
          {data.remark}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="上线时间" span={1} valueType="dateTime">
          {data.publicAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建时间" span={1} valueType="dateTime">
          {data.createdAt}
        </ProDescriptions.Item>
      </ProDescriptions>
      <EditCodeScanTransferModalWithButton
        id={id as string}
        values={data.codeScan ?? []}
        atomicOptions={atomicOptions}
        onSuccess={() => {
          handleUpdateData();
        }}
      />
      <Table<ComplianceAPI.ComplianceAtomicItem>
        loading={loading}
        columns={columns}
        dataSource={data?.codeScan ?? []}
        pagination={false}
        expandable={{
          fixed: 'left',
        }}
        scroll={{ x: 'max-content' }}
      />
    </PageContainer>
  );
};

export default ComplianceDemandDetails;
