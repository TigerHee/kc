import React from 'react';
// import { useUserStore } from '@/store/user';
import styles from './styles.module.scss';

export default function HomePage() {
  // const isLogin = useUserStore(state => state.isLogin);
  // const user = useUserStore(state => state.user);

  // const loginStatus = useMemo(() => {
  //   if (isLogin === void 0) {
  //     return '检测登录中...';
  //   }
  //   return isLogin ? `已登录, uid: ${user!.uid}` : '未登录';
  // }, [isLogin, user]);

  return (
    <div className={styles.page}>
      <p>Hello, KuCoin!</p>
      <p>目前登录状态 </p>
    </div>
  );
}
