import { deleteWorkflow, getWorkflowList } from '@/services/workflow';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Empty, Pagination, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
import { CreateWorkflowWithButton } from './components/CreateWorkflowWithButton';
import { getJobDefine } from '@/services/jobs';
import WorkflowItemCard from './components/WorkflowItemCard';
import RcResizeObserver from 'rc-resize-observer';
import { ReloadOutlined } from '@ant-design/icons';

const WorkflowList: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.WorkflowItem[]>([]);
  const [jobDefine, setJobDefine] = useState<API.DefineItem[]>([]);
  const [responsive, setResponsive] = useState(false);

  const fetchData = async (query: any) => {
    setLoading(true);
    getWorkflowList(query)
      .then((res) => {
        setList(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    deleteWorkflow(id).then(() => {
      message.success('删除成功');
      fetchData({ ...pagination });
    });
  };

  const handleRefresh = () => {
    fetchData({ ...pagination });
  };

  useEffect(() => {
    fetchData({ ...pagination });
    getJobDefine().then((res) => {
      setJobDefine(res);
    });
  }, []);

  return (
    <PageContainer
      fixedHeader
      loading={loading}
      extra={[
        <Button key="refresh" onClick={() => handleRefresh()} icon={<ReloadOutlined />}>
          刷新列表
        </Button>,
        <CreateWorkflowWithButton
          key="create"
          // TODO: 临时过滤只支持「PROJECT:」的任务，后续通过对工作流进行设置来支持更多类型的流水线
          jobDefine={jobDefine.filter((item) => item.name.startsWith('PROJECT:'))}
          onSuccess={() => {
            fetchData({ ...pagination });
          }}
        />,
      ]}
    >
      <Card loading={loading} bordered={false}>
        <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 1240);
          }}
        >
          <Row gutter={[16, 16]}>
            {list.map((item) => (
              <Col span={responsive ? 24 : 12} key={item._id}>
                <WorkflowItemCard
                  item={item}
                  jobDefine={jobDefine}
                  handleCreateSuccess={() => {
                    fetchData({ ...pagination });
                  }}
                  handleDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        </RcResizeObserver>
        <Pagination
          key="pagination"
          size="small"
          style={{ padding: '16px 0', justifyContent: 'flex-end' }}
          {...pagination}
          total={total}
          showSizeChanger
          showTotal={(total) => `总共 ${total} 工作流`}
          onShowSizeChange={(current, pageSize) => {
            fetchData({
              current,
              pageSize,
            });
          }}
          onChange={(page, pageSize) => {
            setPagination({
              current: page,
              pageSize,
            });
            fetchData({
              current: page,
              pageSize,
            });
          }}
        />
      </Card>
      {!loading && list.length === 0 && (
        <Card style={{ marginTop: 16 }}>
          <Empty />
        </Card>
      )}
    </PageContainer>
  );
};
export default WorkflowList;
