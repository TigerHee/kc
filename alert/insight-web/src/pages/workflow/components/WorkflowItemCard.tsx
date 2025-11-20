import { DeleteOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Card, Divider, Popconfirm, Steps, Tooltip } from 'antd';
import { API } from 'types';
import { UpdateWorkflowWithButton } from './UpdateWorkflowWithButton';
import UserAvatarWithName from '@/components/UserAvatarWithName';
import SettingWorkflowWithButton from './SettingWorkflowWithButton';

interface WorkflowItemCardProps {
  item: API.WorkflowItem;
  jobDefine: API.DefineItem[];
  handleDelete: (id: string) => void;
  handleCreateSuccess: () => void;
}

const WorkflowItemCard: React.FC<WorkflowItemCardProps> = (props) => {
  const { item, jobDefine, handleCreateSuccess, handleDelete } = props;
  return (
    <Card
      key={item._id}
      type="inner"
      bordered
      hoverable
      style={{ border: '1px solid #ddd' }}
      actions={[
        <Popconfirm
          key="delete"
          title="删除工作流"
          description="工作流将会删除，可能会影响调用"
          onConfirm={() => handleDelete(item._id)}
          okText="确认"
          cancelText="取消"
        >
          <Button key="delete" danger icon={<DeleteOutlined />} style={{ marginRight: 8 }}>
            删除
          </Button>
        </Popconfirm>,
        <SettingWorkflowWithButton key="setting" data={item} />,
        <UpdateWorkflowWithButton
          key="edit"
          // TODO: 临时过滤只支持「PROJECT:」的任务，后续通过对工作流进行设置来支持更多类型的流水线
          jobDefine={jobDefine.filter((item) => item.name.startsWith('PROJECT:'))}
          data={item}
          onSuccess={handleCreateSuccess}
        />,
      ]}
    >
      <ProDescriptions column={2} title={item?.name}>
        <ProDescriptions.Item label="描述" span={2}>
          {item?.desc}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="创建人">
          <UserAvatarWithName user={item.createdBy} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="关联项目">
          <a>{item?.relateProjects ?? 0}</a>
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="创建时间"
          fieldProps={{
            format: 'YYYY年MM月DD日 HH:mm:ss',
          }}
          valueType="dateTime"
        >
          {item?.createdAt}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="更新时间"
          valueType="dateTime"
          fieldProps={{
            format: 'YYYY年MM月DD日 HH:mm:ss',
          }}
        >
          {item?.updatedAt}
        </ProDescriptions.Item>
      </ProDescriptions>
      <Divider />
      <Steps
        style={{ width: '100%', overflowY: 'auto' }}
        current={(item.node || [])?.length + 2}
        responsive
        progressDot
        items={[
          {
            title: '开始',
          },
          ...(item.node || []).map((node) => ({
            title: (
              <Tooltip placement="top" title={<span>{node.name}</span>}>
                {node.desc}
              </Tooltip>
            ),
          })),
          {
            title: '结束',
          },
        ]}
      />
    </Card>
  );
};

export default WorkflowItemCard;
