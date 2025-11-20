import { Avatar } from 'antd';
import { API } from 'types';

interface RepoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  repo: API.ReposItem;
  size?: 'default' | 'small' | 'large';
}

export const RepoItem: React.FC<RepoItemProps> = ({ repo, size = 'default' }) => {
  if (!repo) {
    return null;
  }
  return (
    <span>
      <Avatar style={{ backgroundColor: 'orange' }} size={size}>
        {repo.name.slice(0, 1).toLocaleUpperCase()}
        {repo.name.split('-')?.[1] ? repo.name.split('-')[1].slice(0, 1).toLocaleUpperCase() : null}
      </Avatar>
      <span style={{ marginLeft: 10, fontSize: size === 'large' ? 22 : 14 }}>{repo.name}</span>
    </span>
  );
};
