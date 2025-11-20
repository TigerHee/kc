import { API } from 'types';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.getUserInfo } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    withLogin: !!currentUser,
    withoutLogin: !currentUser,
    canAdmin: currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin'),
    canSuperAdmin: currentUser && currentUser.role === 'super_admin',
  };
}
