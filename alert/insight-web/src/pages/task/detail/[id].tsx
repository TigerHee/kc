import { getTaskDetail } from '@/services/tasks';
import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';
import { API } from 'types';

const TaskDetail: React.FC = () => {
  const [details, setDetails] = useState<API.TaskItem>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      getTaskDetail(id).then((res) => {
        setDetails(res);
      });
    }
  }, []);

  console.log('details', details);
  return <PageContainer>TaskDetail: {id}</PageContainer>;
};

export default TaskDetail;
