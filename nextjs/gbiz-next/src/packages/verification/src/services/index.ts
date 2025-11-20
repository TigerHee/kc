import { post } from 'tools/request';

/**
 * 通过账号获取 token
 * @param {*} userAccount 用户邮箱或手机
 */
export const getToken = ({ userAccount }) => {
  return post('/ucenter/user/rebind/token', { userAccount }, false, false, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });
};
