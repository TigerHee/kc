import { getProjectDetailByNameDeps } from '@/services/projects';
import { ProDescriptions } from '@ant-design/pro-components';
import { Badge, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';

interface DepsPageDetailProps {
  name: string;
}
const DepsPageDetail: React.FC<DepsPageDetailProps> = (props) => {
  const { name } = props;

  const [data, setData] = useState<API.ProjectDetailDepsInfo>();
  const [loading, setLoading] = useState(false);
  const columns: TableProps<API.PackageJsReportItemDeps>['columns'] = [
    {
      title: '依赖包',
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 200,
    },
    {
      title: '锁定版本',
      dataIndex: 'isLock',
      align: 'center',
      render: (text) => {
        return text ? '是' : '否';
      },
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 200,
    },
  ];

  useEffect(() => {
    setLoading(true);
    getProjectDetailByNameDeps(name)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // if (data?.meta?.status === false && loading === false) {
  //   return <Empty />;
  // }

  return (
    <>
      <ProDescriptions bordered column={2}>
        <ProDescriptions.Item label="状态">
          {data?.meta.status ? (
            <Badge status="success" text="开启" />
          ) : (
            <Badge status="default" text="未使用" />
          )}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime">
          {data?.meta.updatedAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="未锁版本依赖数量">
          <Badge
            className="site-badge-count-109"
            count={data?.meta?.unLockTotal ?? 0}
            style={{ backgroundColor: 'red', marginLeft: 10 }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="锁定版本锁依赖数量">
          <Badge
            className="site-badge-count-109"
            count={data?.meta?.lockTotal ?? 0}
            style={{ backgroundColor: '#01bc8d', marginLeft: 10 }}
          />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="报告ID" copyable>
          {data?.report?._id}
        </ProDescriptions.Item>
      </ProDescriptions>

      <Table<API.PackageJsReportItemDeps>
        columns={columns}
        dataSource={data?.report?.deps}
        pagination={{
          pageSize: 20,
        }}
        loading={loading}
        expandable={{
          fixed: 'left',
        }}
      />
    </>
  );
};

export default DepsPageDetail;
