import { PageContainer } from '@ant-design/pro-components';

import type { TabsProps } from 'antd';
import { Badge, Tabs } from 'antd';
import StickyBox from 'react-sticky-box';
import AlarmNotification from './components/AlarmNotification';
import SystemNotification from './components/SystemNotification';
import { useModel } from '@umijs/max';

const PersonalNotice: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const items: TabsProps['items'] = [
    {
      label: (
        <Badge count={initialState?.unReadAlarmCount} offset={[7, -2]}>
          告警通知
        </Badge>
      ),
      key: '1',
      children: <AlarmNotification />,
    },
    {
      label: (
        <Badge count={initialState?.unReadMessageCount} offset={[7, -2]}>
          系统消息
        </Badge>
      ),
      key: '2',
      children: <SystemNotification />,
    },
  ];

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={56} offsetBottom={20} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: 'white', padding: '6px 12px' }} />
    </StickyBox>
  );
  return (
    <div>
      <PageContainer>
        <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} items={items} />
      </PageContainer>
    </div>
  );
};

export default PersonalNotice;
