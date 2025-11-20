import { generateEnglishNameColor } from '@/utils/string';
import { ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Popover } from 'antd';
import { API } from 'types';
import { BoringAvatar } from '../BoringAvatar';

interface UserAvatarWithNameProps {
  user: API.UserItem;
  simplify?: boolean;
  style?: React.CSSProperties;
}
const UserAvatarWithName: React.FC<UserAvatarWithNameProps> = ({
  user,
  simplify = false,
  style,
}) => {
  if (!user || !user?.name) {
    return <div style={style}>-</div>;
  }
  return (
    <Popover
      content={
        <ProDescriptions style={{ width: 240 }} column={1} size="small">
          <ProDescriptions.Item label="名称" span={1}>
            {user.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="邮箱" span={1}>
            {/* 邮箱打开 */}
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </ProDescriptions.Item>
        </ProDescriptions>
      }
      title="人员信息"
      trigger="hover"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyItems: 'center',
          ...style,
        }}
      >
        {simplify && (
          <Avatar
            size="default"
            shape="square"
            style={{
              backgroundColor: generateEnglishNameColor(user.name).color,
            }}
            alt={user.name}
            src={<BoringAvatar name={user.name} />}
          ></Avatar>
        )}
        {!simplify && (
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              alignItems: 'center',
            }}
          >
            <Avatar
              size="default"
              shape="square"
              alt={user.name}
              src={<BoringAvatar name={user.name} />}
            ></Avatar>
            <span style={{ marginLeft: 8, color: '#53ac59', fontSize: 16 }}>{user.name}</span>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default UserAvatarWithName;
