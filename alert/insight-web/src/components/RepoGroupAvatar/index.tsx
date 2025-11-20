import { generateAvatarEnglishNameString, generateEnglishNameColor } from '@/utils/string';
import { ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Popover } from 'antd';
import { API } from 'types';

interface RepoGroupAvatarProps {
  data: API.ReposItem[];
}
const RepoGroupAvatar: React.FC<RepoGroupAvatarProps> = ({ data }) => {
  if (data.length === 0) {
    return <>-</>;
  }
  return (
    <Avatar.Group>
      {data.map((item) => (
        <Popover
          content={
            <ProDescriptions style={{ width: 300 }} column={1} size="small">
              <ProDescriptions.Item label="名称" span={1}>
                <a
                  target="_blank"
                  href={`https://bitbucket.kucoin.net/projects/${item.group}/repos/${item.name}/browse`}
                  rel="noreferrer"
                >
                  {item.name}
                </a>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="描述" span={1}>
                {item.description}
              </ProDescriptions.Item>
            </ProDescriptions>
          }
          title="仓库信息"
          trigger="hover"
          key={item._id}
        >
          <Avatar
            size="default"
            shape="square"
            style={{ backgroundColor: generateEnglishNameColor(item.name).color, fontSize: 14 }}
            alt={item.description}
          >
            {generateAvatarEnglishNameString(item.name)}
          </Avatar>
        </Popover>
      ))}
    </Avatar.Group>
  );
};

export default RepoGroupAvatar;
