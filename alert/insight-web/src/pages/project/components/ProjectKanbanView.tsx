import { useState } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import { Col, Row } from 'antd';
import { API } from 'types';
import ProjectItemCard from './ProjectItemCard';
import { Common } from 'types/common';

const ProjectKanbanView: React.FC<{
  list: API.ProjectsItem[];
  repos: API.ReposItem[];
  workflowOptions: Common.WorkflowOptionItem[];
  userOptions: Common.UserSelectOptionItem[];
  handleDelete: (id: string) => void;
  handleGoDetail: (name: string) => void;
  handleUpdateSuccess: () => void;
}> = (props) => {
  const {
    list,
    repos,
    userOptions,
    handleDelete,
    handleGoDetail,
    handleUpdateSuccess,
    workflowOptions,
  } = props;
  const [responsive, setResponsive] = useState(false);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 1440);
      }}
    >
      <Row gutter={[16, 16]}>
        {list.map((project) => (
          <Col span={responsive ? 24 : 12} key={project._id}>
            <ProjectItemCard
              workflowOptions={workflowOptions}
              userOptions={userOptions}
              project={project}
              repos={repos}
              handleDelete={handleDelete}
              handleGoDetail={handleGoDetail}
              handleUpdateSuccess={handleUpdateSuccess}
            />
          </Col>
        ))}
      </Row>
    </RcResizeObserver>
  );
};

export default ProjectKanbanView;
