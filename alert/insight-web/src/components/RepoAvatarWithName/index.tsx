import { ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Popover } from 'antd';
import { BoringAvatar } from '../BoringAvatar';

interface RepoAvatarWithNameProps {
  repo: {
    name: string;
    group: string;
    description: string;
  };
  simplify?: boolean;
  style?: React.CSSProperties;
}
const RepoAvatarWithName: React.FC<RepoAvatarWithNameProps> = ({
  repo,
  simplify = false,
  style,
}) => {
  if (!repo) {
    return <div style={style}>-</div>;
  }
  return (
    <Popover
      content={
        <ProDescriptions style={{ width: 300 }} column={1} size="small">
          <ProDescriptions.Item label="名称" span={1}>
            <a
              target="_blank"
              href={`https://bitbucket.kucoin.net/projects/${repo.group}/repos/${repo.name}/browse`}
              rel="noreferrer"
            >
              {repo.name}
            </a>
          </ProDescriptions.Item>
          <ProDescriptions.Item label="描述" span={1}>
            {repo.description}
          </ProDescriptions.Item>
        </ProDescriptions>
      }
      title="仓库信息"
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
            src={<BoringAvatar name={repo.name} />}
            alt={repo.description}
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
              alt={repo.name}
              src={<BoringAvatar name={repo.name} variant="pixel" colors="light" />}
            ></Avatar>
            <span style={{ marginLeft: 8, color: '#fc8d4d', fontSize: 16 }}>{repo.name}</span>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default RepoAvatarWithName;
