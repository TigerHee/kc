import {
  AvatarDropdown,
  AvatarName,
  // Question
} from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { type RunTimeLayoutConfig } from '@umijs/max';
import React from 'react';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { getUserInfo } from './services/user';
import { API } from 'types';
import { websocketManager } from './services/websocket';
import { LinkOutlined } from '@ant-design/icons';
// import { getUnreadAlarmCount, getUnreadMessageCount } from './services/notification';
import { history } from '@umijs/max';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.getUserInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.getUserInfo | undefined>;
  unReadMessageCount?: number;
  unReadAlarmCount?: number;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await getUserInfo();
      return currentUser;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // history.push(loginPath);
    }
    return undefined;
  };
  const currentUserInfo = await fetchUserInfo();
  // const unReadMessageCount = await getUnreadMessageCount();
  // const unReadAlarmCount = await getUnreadAlarmCount();

  websocketManager.connect();
  // 排除登录页面，额外进行处理
  return {
    fetchUserInfo,
    currentUser: currentUserInfo,
    unReadMessageCount: 0,
    unReadAlarmCount: 0,
    // unReadMessageCount,
    // unReadAlarmCount,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

/**
 * ProLayout 支持的api https://procomponents.ant.design/components/layout
 */
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    /**
     * 默认的菜单的收起和展开
     */
    defaultCollapsed: false,
    /**
     * 控制菜单的收起和展开
     */
    // collapsed: true,
    actionsRender: () => [
      // <Question key="doc" />
    ],
    avatarProps: {
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return (
          <AvatarDropdown menu={Boolean(initialState?.currentUser?.name)}>
            {avatarChildren}
          </AvatarDropdown>
        );
      },
    },
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      if (initialState?.currentUser && location.pathname === loginPath) {
        history.push('/welcome');
      }
    },
    bgLayoutImgList: [],
    links: [
      <a
        key="kux-ui"
        href="https://kux.sit.kucoin.net/#/kux5.0/intro"
        target="_blank"
        rel="noreferrer"
      >
        <LinkOutlined />
        <span>KUX组件库</span>
      </a>,
      <a
        key="check-web-node"
        href="https://check-web-node.sit.kucoin.net/"
        target="_blank"
        rel="noreferrer"
      >
        <LinkOutlined />
        <span>单测看板</span>
      </a>,
      <a
        key="old"
        href="https://check-web-node.sit.kucoin.net/kuxold"
        target="_blank"
        rel="noreferrer"
      >
        <LinkOutlined />
        <span>旧组件看板</span>
      </a>,
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>无权限</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
