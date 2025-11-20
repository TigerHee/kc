import { useEffect } from 'react';
import Flow from './components/Flow';
import WhiteGreenLogo from './white-green-logo.svg';
import Particle from './Particle';
import { Button } from 'antd';
import MicrosoftIcon from '../../../public/images/microsoft.png';
import { getUserInfo } from '@/services/user';

const Login: React.FC = () => {
  useEffect(() => {
    document.body.style.margin = '0px';

    getUserInfo().then((res) => {
      if (res) {
        window.location.href = '/';
      }
    });
    const particleAnimation = new Particle('satellite');
    particleAnimation.start();
    return () => {
      particleAnimation.destroy();
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0C0019',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <img src={WhiteGreenLogo} alt="logo" style={{ width: 38 }} />
        <span style={{ fontSize: 24, fontWeight: 500, color: 'white' }}>INSIGHT</span>
      </div>
      <div
        id="satellite"
        style={{
          position: 'relative',
          // 使用计算属性，不同的屏幕大小，始终在最顶部
          top: 'calc(-50% + 100px)',
          left: 'calc(50% - 150px)',
          pointerEvents: 'none',
        }}
      ></div>
      <Flow
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          top: 100,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 30,
        }}
      >
        <div>
          <h1
            style={{
              color: '#fff',
              fontSize: 36,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            登录
          </h1>
          <p
            style={{
              color: '#fff',
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            登录以开始使用
          </p>
        </div>
        <Button
          style={{
            color: '#01bc8d',
          }}
          icon={<img src={MicrosoftIcon} style={{ height: 20, width: 20 }} />}
          onClick={() => {
            // 获取url的query参数，redirect
            // 如果有redirect参数，跳转到redirect的地址
            // 如果没有redirect参数，跳转到首页
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            const query = redirect ? redirect : '/welcome';
            // 跳转登录
            window.location.href = LOGIN_URL + `?redirect=${encodeURIComponent(query)}`;
          }}
        >
          Microsoft
        </Button>
      </div>
    </div>
  );
};

export default Login;
