import { Avatar } from 'antd';
import { BoringAvatar } from '../BoringAvatar';
import { history } from '@umijs/max';

interface ProjectAvatarWithNameProps {
  project: {
    name: string;
  };
  style?: React.CSSProperties;
}
const ProjectAvatarWithName: React.FC<ProjectAvatarWithNameProps> = ({ project, style }) => {
  if (!project) {
    return <div style={style}>-</div>;
  }
  return (
    // <Popover
    //   content={
    //     <ProDescriptions style={{ width: 300 }} column={1} size="small">
    //       <ProDescriptions.Item label="名称" span={1}>
    //         <a
    //           target="_blank"
    //           href={`https://bitbucket.kucoin.net/projects/${repo.group}/repos/${repo.name}/browse`}
    //           rel="noreferrer"
    //         >
    //           {repo.name}
    //         </a>
    //       </ProDescriptions.Item>
    //       <ProDescriptions.Item label="描述" span={1}>
    //         {repo.description}
    //       </ProDescriptions.Item>
    //     </ProDescriptions>
    //   }
    //   title="仓库信息"
    //   trigger="hover"
    // >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyItems: 'center',
        ...style,
      }}
      onClick={() => {
        history.push(`/project/detail/${project?.name}`);
      }}
    >
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
          alt={project.name}
          src={<BoringAvatar name={project.name} variant="ring" colors="blue" />}
        ></Avatar>
        <span
          style={{
            marginLeft: 8,
            // 链接颜色
            color: '#1890ff',
            fontSize: 16,
          }}
        >
          {project.name}
        </span>
      </div>
    </div>
    // </Popover>
  );
};

export default ProjectAvatarWithName;
