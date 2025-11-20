import { LogoutOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, history } from '@umijs/max';
import { Avatar, Badge, Spin, notification } from 'antd';
import type { MenuProps } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { logout } from '@/services/user';
import { WsMessageTypeEnum, websocketManager } from '@/services/websocket';
import { API } from 'types';
import { BoringAvatar } from '../BoringAvatar';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser, unReadMessageCount, unReadAlarmCount } = initialState || {};
  return (
    <span className="icon" style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ fontSize: 16 }}> {currentUser?.name}</span>
      <Badge
        count={(unReadMessageCount || 0) + (unReadAlarmCount || 0)}
        size="small"
        overflowCount={99}
      >
        <Avatar
          shape="circle"
          style={{
            marginLeft: 5,
            // backgroundColor: '#01bc8d',
          }}
          src={<BoringAvatar name={currentUser?.name || ''} size={24} />}
        ></Avatar>
      </Badge>
    </span>
  );
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    websocketManager.on(WsMessageTypeEnum.SYSTEM_NOTIFICATION, (data: API.SystemMessageItem) => {
      setInitialState((s) => ({
        ...s,
        unReadMessageCount: s?.unReadMessageCount ? s?.unReadMessageCount + 1 : 0,
      }));
      notification.success({
        message: data.title,
        description: data.content,
        duration: 0,
      });
    });
    websocketManager.on(WsMessageTypeEnum.ALARM_NOTIFICATION, (data: API.AlarmItem) => {
      setInitialState((s) => ({
        ...s,
        unReadAlarmCount: s?.unReadAlarmCount ? s?.unReadAlarmCount + 1 : 0,
      }));
      notification.error({
        message: data.warnText,
        description: data.message,
        duration: 0,
      });
    });

    return () => {
      websocketManager.off(WsMessageTypeEnum.SYSTEM_NOTIFICATION);
      websocketManager.off(WsMessageTypeEnum.ALARM_NOTIFICATION);
    };
  }, []);

  const onMenuClick: MenuProps['onClick'] = async (event) => {
    const { key } = event;
    if (key === 'logout') {
      const redirect = window.location.pathname;
      logout().then(() => {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        history.push(`/login?redirect=` + encodeURIComponent(redirect));
      });
    }
    if (key === 'personal') {
      history.push('/personal/info');
    }
    if (key === 'notice') {
      history.push('/personal/notice');
    }
  };

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'notice',
            icon: <NotificationOutlined />,
            label: '消息通知',
          },
          {
            key: 'personal',
            icon: <UserOutlined />,
            label: '个人信息',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
