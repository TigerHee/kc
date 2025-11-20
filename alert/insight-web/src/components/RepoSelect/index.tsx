import { Select, SelectProps, Tag } from 'antd';
import { API } from 'types';
import { RepoItem } from '../RepoItem';

export const RepoSelect: React.FC<
  SelectProps & {
    repos: API.ReposItem[];
  }
> = (props) => {
  const { repos, mode, maxCount, ...restProps } = props;

  if (repos.length === 0) {
    return null;
  }

  const tagRender: SelectProps['tagRender'] = (props) => {
    const { value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
        <RepoItem
          repo={repos.find((item) => item._id === value) as API.ReposItem}
          size="small"
          onMouseDown={onPreventMouseDown}
        />
      </Tag>
    );
  };

  return (
    <Select
      {...restProps}
      tagRender={tagRender}
      options={repos.map((repo) => ({ label: repo.name, value: repo._id }))}
      mode="multiple"
      maxCount={mode === 'multiple' ? maxCount : 1}
    />
  );
};
