import { getJobDefine } from '@/services/jobs';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { API } from 'types';
import JobDefineItemCard from './components/JobDefineItemCard';
import { Col, Row } from 'antd';
import RcResizeObserver from 'rc-resize-observer';

const JobDefine: React.FC = () => {
  const [list, setList] = useState<API.DefineItem[]>([]);
  const [current, setCurrent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responsive, setResponsive] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getJobDefine()
      .then((data) => {
        setList(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 1680);
        }}
      >
        <ProCard direction="column">
          <Row gutter={[16, 16]}>
            {list.map((item) => (
              <Col span={responsive ? 24 : 12} key={item.name}>
                <JobDefineItemCard
                  item={item}
                  loading={loading}
                  current={current}
                  handleRefresh={() => {
                    setCurrent(item.name);
                    fetchData();
                  }}
                />
              </Col>
            ))}
          </Row>
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};
export default JobDefine;
