import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Badge, Button, Card, Divider, Statistic, Tag } from 'antd';
import { API } from 'types';
import PriorityRender from '../PriorityRender';
import { ReloadOutlined } from '@ant-design/icons';

interface JobDefineItemCardProps {
  item: API.DefineItem;
  current: string;
  loading: boolean;
  handleRefresh: (item: API.DefineItem) => void;
}

const JobDefineItemCard: React.FC<JobDefineItemCardProps> = (props) => {
  const { item, current, loading, handleRefresh } = props;
  return (
    <Card
      key={item.name}
      bordered
      hoverable
      loading={loading && current === item.name}
      style={{
        border: '1px solid #ddd',
      }}
    >
      <ProDescriptions
        title={<Badge status="processing" style={{ fontSize: 16 }} text={item.desc} />}
        column={2}
        dataSource={item}
      >
        <ProDescriptions.Item label="模块/版本">
          <Tag color="blue">{item.name.split(':')?.[0]}</Tag>
          <Tag color="green">{item.name.split(':')?.[2]}</Tag>
        </ProDescriptions.Item>
        <ProDescriptions.Item label="任务KEY" dataIndex={['name']} />
        {/* <ProDescriptions.Item label="执行函数" valueType="jsonCode">
          {item.meta.fn}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="文件位置" valueType="jsonCode">
          {item.meta.filePath}
        </ProDescriptions.Item> */}
        <ProDescriptions.Item label="文本" valueType="option">
          <Button
            type="dashed"
            key="reload"
            icon={<ReloadOutlined />}
            onClick={() => {
              handleRefresh(item);
            }}
          >
            刷新
          </Button>
        </ProDescriptions.Item>
      </ProDescriptions>
      <Divider></Divider>
      <ProCard.Group direction="row">
        <ProCard>
          <Statistic title="最大任务并发数量" value={item.meta.concurrency} precision={0} />
        </ProCard>
        <ProCard>
          <Statistic title="最大锁定任务数量" value={item.meta.lockLimit} precision={0} />
        </ProCard>
        <ProCard>
          <Statistic
            title="任务优先级别"
            valueRender={() => {
              return <PriorityRender value={item.meta.priority} />;
            }}
          />
        </ProCard>
        <ProCard>
          <Statistic title="任务最大锁定时间" value={item.meta.lockLifetime} suffix="ms" />
        </ProCard>
      </ProCard.Group>
    </Card>
  );
};

export default JobDefineItemCard;
