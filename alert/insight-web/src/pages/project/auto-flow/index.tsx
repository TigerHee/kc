import { ProCard } from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useState } from 'react';
import AutoFlowWorkflow from './Workflow';
import AutoFlowRecords from './Records';
import AutoFlowLogs from './Logs';

interface AutoFlowProps {
  project: string;
}
const AutoFlow: React.FC<AutoFlowProps> = ({ project }) => {
  const [radioTab, setRadioTab] = useState<'workflow' | 'job' | 'log'>('workflow');
  return (
    <ProCard gutter={24} ghost>
      <ProCard colSpan={24} title="自动工作流">
        <Radio.Group
          value={radioTab}
          onChange={(v) => setRadioTab(v.target.value)}
          style={{ marginBottom: 16 }}
        >
          <Radio.Button value="workflow">流水线</Radio.Button>
          <Radio.Button value="job">调度记录</Radio.Button>
          <Radio.Button value="log">调度日志</Radio.Button>
        </Radio.Group>
        {radioTab === 'workflow' && (
          <div>
            <AutoFlowWorkflow project={project} />
          </div>
        )}
        {radioTab === 'job' && (
          <div>
            <AutoFlowRecords project={project} />
          </div>
        )}
        {radioTab === 'log' && (
          <div>
            <AutoFlowLogs project={project} />
          </div>
        )}
      </ProCard>
    </ProCard>
  );
};

export default AutoFlow;
