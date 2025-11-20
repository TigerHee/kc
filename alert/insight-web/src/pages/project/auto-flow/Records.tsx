import { getProjectDetailRecords } from '@/services/projects';
// import { CheckCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Steps, Tag } from 'antd';
import { API } from 'types';

interface AutoFlowRecordsProps {
  project: string;
}
const AutoFlowRecords: React.FC<AutoFlowRecordsProps> = ({ project }) => {
  // const [data, setData] = useState<API.ProjectWorkflowRecordItem[]>([]);
  // const [total, setTotal] = useState(0);

  const columns: ProColumns<API.ProjectWorkflowRecordItem>[] = [
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 140,
      fixed: 'left',
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 140,
      renderText: (text) => {
        return <Tag color="gold">{text}</Tag>;
      },
    },
    {
      title: '流水线',
      width: 520,
      align: 'center',
      renderText: (_, record) => {
        return (
          <Steps
            current={record.currentStep}
            items={[
              // {
              //   title: '开始',
              //   icon: <RightCircleOutlined />,
              //   status: 'finish',
              // },
              ...(record.nodes || []).map((node) => ({
                title: node.desc,
                description: node.name,
              })),
              // {
              //   title: '结束',
              //   icon: <CheckCircleOutlined />,
              // },
            ]}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      align: 'center',
      fixed: 'right',
      width: 100,
      renderText: (status) => {
        if (status) {
          return <Tag color="green">完成</Tag>;
        }
        return <Tag color="red">未完成</Tag>;
      },
    },
  ];

  return (
    <ProTable
      rowKey="_id"
      columns={columns}
      expandable={{
        fixed: 'left',
      }}
      // search={{
      //   defaultCollapsed: false,
      // }}
      headerTitle={false}
      search={false}
      request={async (params) => {
        const res = await getProjectDetailRecords(project, params);
        return {
          data: res.list,
          total: res.total,
          success: true,
        };
      }}
    />
  );
};

export default AutoFlowRecords;
