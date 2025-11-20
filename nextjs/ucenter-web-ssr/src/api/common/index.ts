import { client } from '../client.gen';



// 退出登陆
export async function logout() {
  return client.post('/logout');
}
