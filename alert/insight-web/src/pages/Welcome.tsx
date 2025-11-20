import { useModel } from '@umijs/max';
import { Button, Card } from 'antd';
import React from 'react';
import MicrosoftIcon from '../../public/images/microsoft.png';
import UserMustReadWikiList from './wiki/components/UserMustReadWikiList';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <div>
      {!initialState?.currentUser && (
        <Card style={{ textAlign: 'center', marginTop: 10 }}>
          <Button
            color="primary"
            icon={<img src={MicrosoftIcon} style={{ height: 20, width: 20 }} />}
            onClick={() => {
              // 跳转登录
              window.location.href = LOGIN_URL;
            }}
          >
            Log In with Microsoft
          </Button>
        </Card>
      )}
      <UserMustReadWikiList userId={initialState?.currentUser?._id} />
    </div>
  );
};

export default Welcome;
