import { CheckCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Space, Steps, Tag } from 'antd';
import { API } from 'types';

interface WorkflowStepProps {
  name: string;
  nodes: API.WorkflowItemNode[] | API.ProjectWorkflowRecordNodeItem[];
}
export const WorkflowStep: React.FC<WorkflowStepProps> = ({ nodes, name }) => {
  if (!nodes) return null;
  return (
    <Space>
      <Tag color="gold">{name}</Tag>
      <Steps
        current={(nodes || [])?.length + 2}
        responsive
        type="inline"
        items={[
          {
            title: '开始',
            icon: <RightCircleOutlined />,
            status: 'finish',
          },
          ...(nodes || []).map((node) => ({
            title: node.desc,
            description: node.name,
          })),
          {
            title: '结束',
            icon: <CheckCircleOutlined />,
          },
        ]}
      />
    </Space>
  );
};
