import { KeepAliveTabContext } from '@/layouts/context';
import { getAgendaDashboardInfo } from '@/services/jobs';
import { WsMessageTypeEnum, websocketManager } from '@/services/websocket';
import {
  DatabaseTwoTone,
  ReconciliationTwoTone,
  TagsTwoTone,
  ThunderboltTwoTone,
} from '@ant-design/icons';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Tag } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useContext, useEffect, useState } from 'react';
import { API } from 'types';

const JobDashboard: React.FC = () => {
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState<API.getAgendaDashboardInfo>();
  const [updateTime, setUpdateTime] = useState<Date>();
  const { onShow, onHidden } = useContext(KeepAliveTabContext);

  useEffect(() => {
    websocketManager.on(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, (data) => {
      console.log('AGENDA_DASHBOARD_UPDATE', data);
      setData(data);
      setUpdateTime(new Date());
    });
    websocketManager.send(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, {
      type: 'start-listening',
    });
    onShow(() => {
      websocketManager.send(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, {
        type: 'start-listening',
      });
    });
    onHidden(() => {
      websocketManager.send(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, {
        type: 'stop-listening',
      });
    });
    return () => {
      websocketManager.send(WsMessageTypeEnum.AGENDA_DASHBOARD_UPDATE, {
        type: 'stop-listening',
      });
    };
  }, []);

  const fetchData = () => {
    getAgendaDashboardInfo().then((data) => {
      setData(data);
      setUpdateTime(new Date());
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
          setResponsive(offset.width < 1280);
        }}
      >
        <ProCard
          title="数据概览"
          extra={<div>更新时间：{updateTime?.toLocaleString()}</div>}
          split={responsive ? 'horizontal' : 'vertical'}
          headerBordered
          bordered
          style={{ gap: 16, padding: 16 }}
        >
          <StatisticCard.Group
            bordered
            direction={responsive ? 'column' : 'row'}
            title="任务队列"
            style={{
              marginBottom: 16,
            }}
          >
            <StatisticCard
              statistic={{
                title: '队列中任务',
                value: data?.queuedJobs,
                status: 'processing',
                icon: <ReconciliationTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '运行中任务',
                status: 'success',
                value: data?.runningJobs,
                icon: <ReconciliationTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '锁定任务',
                value: data?.lockedJobs,
                status: 'warning',
                icon: <ReconciliationTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '等待锁任务',
                status: 'error',
                value: data?.jobsToLock,
                icon: <ReconciliationTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
          </StatisticCard.Group>
          <StatisticCard.Group
            bordered
            direction={responsive ? 'column' : 'row'}
            title="服务配置"
            style={{
              marginBottom: 16,
            }}
          >
            <StatisticCard
              statistic={{
                title: '处理器执行间隔',
                value: data?.config.processEvery,
                icon: <ThunderboltTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
                suffix: 'ms',
                tip: '每隔多少毫秒检查一次任务队列，并执行。所以定时任务最小的时间间隔为「处理器执行间隔」，设置任务周期时，低过这个时间将会无效',
              }}
            />
            <StatisticCard
              statistic={{
                title: '最大锁定任务数量',
                value: data?.config.totalLockLimit,
                icon: <ThunderboltTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '最大并发数量',
                value: data?.config.maxConcurrency,
                icon: <ThunderboltTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
          </StatisticCard.Group>
          <StatisticCard.Group
            bordered
            direction={responsive ? 'column' : 'row'}
            title="任务信息"
            style={{
              marginBottom: 16,
            }}
          >
            <StatisticCard
              statistic={{
                title: '定义任务数量',
                value: Object.keys(data?.jobStatus || {}).length,
                icon: <TagsTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '持久化任务',
                value: data?.totalQueueSizeDB,
                icon: <TagsTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
                tip: '数据库中持久化，且「进行中」的任务数量',
              }}
            />
          </StatisticCard.Group>
          <StatisticCard.Group
            bordered
            direction={responsive ? 'column' : 'row'}
            title="执行锁信息"
            style={{
              marginBottom: 16,
            }}
          >
            <StatisticCard
              statistic={{
                title: '本地处理中队列数量',
                value: data?.internal.localQueueProcessing,
                icon: <DatabaseTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
                tip: '在服务内部，定义的本地队列中正在处理的任务数量，进程锁，用于限制任务的并发执行数量',
              }}
            />
            <StatisticCard
              statistic={{
                title: '本地任务锁限制数量',
                value: data?.internal.localLockLimitReached,
                icon: <DatabaseTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: '存在任务丢失',
                icon: <DatabaseTwoTone style={{ color: '#FAAD14', fontSize: 36 }} />,
                valueRender: () => {
                  return data?.isLockingOnTheFly ? (
                    <Tag color="#f50">是</Tag>
                  ) : (
                    <Tag color="#87d068">否</Tag>
                  );
                },
              }}
            ></StatisticCard>
          </StatisticCard.Group>
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};
export default JobDashboard;
