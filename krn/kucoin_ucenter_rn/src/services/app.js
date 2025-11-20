import {pull} from 'utils/request';

//获取用户信息
export const queryUserInfo = () => pull('/ucenter/user-info');
