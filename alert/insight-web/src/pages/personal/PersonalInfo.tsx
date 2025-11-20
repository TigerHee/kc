import { PageContainer } from '@ant-design/pro-components';
import { Empty, Tabs, TabsProps } from 'antd';
import BasicInfoForm from './components/BasicInfoForm';

const PersonalInfo: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      label: '基本信息',
      key: '1',
      children: <BasicInfoForm />,
    },
    {
      label: '系统设置',
      key: '2',
      children: (
        <div>
          <Empty description="待上线，敬请期待" style={{ height: 500 }}></Empty>
        </div>
      ),
    },
  ];
  return (
    <div>
      <PageContainer style={{ backgroundColor: 'white', height: '100%' }} title={null}>
        <Tabs defaultActiveKey="1" items={items} tabPosition="left" />
      </PageContainer>
    </div>
  );
};

export default PersonalInfo;
