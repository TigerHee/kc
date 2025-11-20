import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

const ProjectFullDashboard: React.FC = () => {
  return (
    <div>
      <PageContainer
        header={{
          title: null,
        }}
      >
        <Empty description="待上线，敬请期待" style={{ height: 500 }}></Empty>
      </PageContainer>
    </div>
  );
};
export default ProjectFullDashboard;
