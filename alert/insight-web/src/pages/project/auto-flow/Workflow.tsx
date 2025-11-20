import { WorkflowStep } from '@/components/WorkflowStep';
import { getProjectDetailWorkflows } from '@/services/projects';
import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';

interface AutoFlowWorkflowProps {
  project: string;
}
const AutoFlowWorkflow: React.FC<AutoFlowWorkflowProps> = ({ project }) => {
  const [data, setData] = useState<API.ProjectWorkflowScheduleItem[]>([]);

  useEffect(() => {
    getProjectDetailWorkflows(project).then((res) => {
      setData(res);
    });
  }, []);

  return (
    <>
      {(data || []).map((schedule) => (
        <ProDescriptions key={schedule._id} bordered column={2} style={{ marginBottom: 10 }}>
          <ProDescriptions.Item label="流水线" valueType="text" span={1}>
            {schedule.workflow.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="定时" valueType="text" span={1}>
            {schedule.interval}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="执行记录数" span={1}>
            <Button type="link">{(schedule.workflowRecord ?? []).length}</Button>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="调度任务" span={1}>
            <Button type="link">{schedule.job}</Button>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="流水线" span={2}>
            <WorkflowStep
              name={schedule.workflow.name}
              nodes={schedule.workflow.node}
            ></WorkflowStep>
          </ProDescriptions.Item>
        </ProDescriptions>
      ))}
      {data.length === 0 && <Empty description="暂无流水线"></Empty>}
    </>
  );
};

export default AutoFlowWorkflow;
