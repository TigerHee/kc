import { generateAvatarEnglishNameString, generateEnglishNameColor } from '@/utils/string';
import { ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Popover } from 'antd';
import { API } from 'types';

interface UserGroupAvatarProps {
  data: API.UserItem[];
  max?: number;
  styles?: React.CSSProperties;
}
const UserGroupAvatar: React.FC<UserGroupAvatarProps> = ({ data, max = 100, styles }) => {
  if (data.length === 0) {
    return <div style={styles}>-</div>;
  }
  return (
    <Avatar.Group
      max={{
        count: max,
        style: { color: '#f56a00', backgroundColor: '#fde3cf', ...styles },
      }}
    >
      {data.map((item) => (
        <Popover
          content={
            <ProDescriptions style={{ width: 240 }} column={1} size="small">
              <ProDescriptions.Item label="名称" span={1}>
                {item.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="邮箱" span={1}>
                {/* 邮箱打开 */}
                <a href={`mailto:${item.email}`}>{item.email}</a>
              </ProDescriptions.Item>
            </ProDescriptions>
          }
          title="人员信息"
          trigger="hover"
          key={item._id}
        >
          <Avatar
            size="default"
            // shape="square"
            style={{ backgroundColor: generateEnglishNameColor(item.name).color, fontSize: 14 }}
            alt={item.email}
          >
            {generateAvatarEnglishNameString(item.name)}
          </Avatar>
        </Popover>
      ))}
    </Avatar.Group>
  );
};

export default UserGroupAvatar;
