import { getSpecificUser } from '@/services/user';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { Common } from 'types/common';

interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Common.SelectOptionItem;
  size?: 'default' | 'small' | 'large';
}

export const UserItem: React.FC<UserItemProps> = (props) => {
  const { user, size = 'default' } = props;

  const [userInfo, setUserInfo] = useState<Common.SelectOptionItem>();

  useEffect(() => {
    if (typeof user === 'string' && user) {
      getSpecificUser(user).then((res) => {
        setUserInfo({
          label: res.name,
          value: res._id,
        });
      });
    } else if (typeof user === 'object') {
      setUserInfo(user as Common.SelectOptionItem);
    }
  }, [user]);

  if (!userInfo || !userInfo.label) {
    return '-';
  }

  return (
    <span style={{ alignItems: 'center' }}>
      <Avatar style={{ backgroundColor: '#f56a00' }} size={size}>
        {userInfo?.label.slice(0, 1).toLocaleUpperCase()}
        {userInfo?.label.split('.')?.[1]
          ? userInfo?.label.split('.')?.[1].slice(0, 1).toLocaleUpperCase()
          : ''}
      </Avatar>
      <span
        style={{
          marginLeft: 5,
          fontSize: size === 'large' ? 22 : 14,
        }}
      >
        {userInfo?.label}
      </span>
    </span>
  );
};
