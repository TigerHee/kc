import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

const ProjectDashboard: React.FC = () => {
  return (
    <div>
      <PageContainer>
        <Empty description="待上线，敬请期待"></Empty>
      </PageContainer>
    </div>
  );
};
export default ProjectDashboard;
