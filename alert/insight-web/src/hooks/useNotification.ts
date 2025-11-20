import { useEffect } from 'react';

const useNotification = () => {
  useEffect(() => {
    // 请求通知权限
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Hello!', {
        body: 'This is a system notification from your React app.',
      });
    }
  };

  return {
    send: sendNotification,
  };
};

export default useNotification;
