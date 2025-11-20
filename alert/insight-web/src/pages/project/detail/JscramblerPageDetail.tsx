import { getProjectDetailByNameJscrambler } from '@/services/projects';
import { ProDescriptions } from '@ant-design/pro-components';
import { Badge, Table } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';

interface JscramblerPageDetailProps {
  name: string;
}
const JscramblerPageDetail: React.FC<JscramblerPageDetailProps> = (props) => {
  const { name } = props;
  const [data, setData] = useState<API.ProjectDetailJscramblerInfo>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProjectDetailByNameJscrambler(name)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ProDescriptions bordered column={2} loading={loading}>
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
        <ProDescriptions.Item label="报告ID" copyable>
          {data?.report?._id}
        </ProDescriptions.Item>
      </ProDescriptions>
      <Table<string>
        columns={[
          {
            title: '配置',
            fixed: 'left',
            width: 200,
            render: (_, record) => {
              return <>{record}</>;
            },
          },
        ]}
        dataSource={data?.report?.config}
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

export default JscramblerPageDetail;
