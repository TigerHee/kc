import CreateJobModal, { CreateModalFieldType } from '@/pages/job/components/CreateJobModal';
import JobLogDrawer from '@/components/JobLogDrawer';
import {
  deleteJob,
  getJobDefine,
  getJobList,
  manualCompleteJob,
  // purgeJob
} from '@/services/jobs';
import { WsMessageTypeEnum, websocketManager } from '@/services/websocket';
import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  ColumnsState,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useMemoizedFn } from 'ahooks';
import {
  TablePaginationConfig,
  Button,
  FormInstance,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  message,
  // notification,
  Collapse,
} from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { API } from 'types';
import { KeepAliveTabContext } from '@/layouts/context';
// import useNotification from '@/hooks/useNotification';

type WsJobStatusUpdatePayload = {
  type: 'progress-update' | 'new-job';
  data: API.JobItem;
};

const JobList: React.FC = () => {
  const { onShow, onHidden } = useContext(KeepAliveTabContext);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [logerState, setLogerState] = useState<{
    jobId: string | null;
    visible: boolean;
  }>({
    jobId: null,
    visible: false,
  });
  const [jobDefine, setJobDefine] = useState<API.DefineItem[]>([]);
  const [data, setData] = useState<API.JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<CreateModalFieldType>();
  const formRef = useRef<FormInstance>();
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>({
    data: {
      show: false,
    },
    failReason: {
      show: false,
    },
  });
  // const { send } = useNotification();

  const fetchDataByParams = useMemoizedFn(() => {
    setLoading(true);
    const params = formRef.current?.getFieldsValue();
    getJobList({
      pageSize: pagination.pageSize,
      current: pagination.current,
      ...params,
    })
      .then((res) => {
        setData(res.list);
        setPagination((p) => {
          return {
            ...p,
            total: res.total,
          };
        });
      })
      .finally(() => {
        setLoading(false);
      });
  });

  /**
   * 处理websocket消息
   */
  const handleWsMessage = useMemoizedFn(() => {
    websocketManager.on(
      WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE,
      (payload: WsJobStatusUpdatePayload) => {
        console.log('AGENDA_JOBS_STATUS_UPDATE', payload);
        if (payload.type === 'progress-update') {
          // send();
          setData((data) => {
            const _data = data.map((item) => {
              if (item._id === payload.data._id) {
                return {
                  ...item,
                  ...payload.data,
                };
              }
              return item;
            });
            return _data;
          });
        } else if (payload.type === 'new-job') {
          fetchDataByParams();
        } else {
          console.log('未知消息类型', payload);
        }
      },
    );
  });

  useEffect(() => {
    handleWsMessage();
    fetchDataByParams();
    getJobDefine().then((res) => {
      setJobDefine(res);
    });
    onShow(() => {
      handleWsMessage();
      fetchDataByParams();
    });
    onHidden(() => {
      websocketManager.off(WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE);
    });
    return () => {
      websocketManager.off(WsMessageTypeEnum.AGENDA_JOBS_STATUS_UPDATE);
    };
  }, []);

  const JobDefineEnum = jobDefine.reduce(
    (acc, cur) => {
      const res = {
        ...acc,
        [cur.name]: {
          text: cur.desc,
          status: cur.name.split(':')?.[0] === 'SYSTEM' ? 'warning' : 'processing',
        },
      };
      return res;
    },
    {} as { [key: string]: { text: string } },
  );

  /**
   * 清洗任务
   */
  // const handlePurgeJob = async () => {
  //   await purgeJob().then((data) => {
  //     fetchDataByParams();
  //     console.log('purgeJob', data);
  //     notification.success({
  //       message: '清洗任务成功',
  //       description: `清洗了 ${data.number} 条任务`,
  //     });
  //   });
  // };

  /**
   * 手动完成任务
   * @param jobId
   */
  const handleManualComplete = async (jobId: string) => {
    manualCompleteJob(jobId).then(() => {
      fetchDataByParams();
      message.success('手动完成任务成功');
    });
  };

  /**
   * 删除任务
   * @param jobId
   */
  const handleDeleteJob = async (jobId: string) => {
    deleteJob(jobId).then(() => {
      fetchDataByParams();
      message.success('删除任务成功');
    });
  };

  /**
   * 重建任务
   * @param job
   */
  const handleReCreateJob = async (job: API.JobItem) => {
    setInitialValues({
      job: job.name,
      type: job.data?.scheduleType,
      payload: JSON.stringify(job?.data?.payload ?? {}, null, 2),
      interval: job?.data?.interval,
      cron: job.data?.cron,
    });
    setCreateModalVisible(true);
  };

  /**
   * 打开创建任务弹窗
   */
  const handleOpenCreateModal = () => {
    setCreateModalVisible(true);
  };

  const columns: ProColumns<API.JobItem>[] = [
    {
      title: '时间排序',
      dataIndex: 'orderField',
      hideInDescriptions: true,
      hideInForm: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        nextRunAt: { text: '下次运行时间', status: 'Processing' },
        lastRunAt: { text: '最后运行时间', status: 'Processing' },
        lastFinishedAt: { text: '最后完成时间', status: 'Processing' },
        lockedAt: { text: '锁定时间', status: 'Processing' },
      },
    },
    {
      title: '调度ID',
      dataIndex: '_id',
      valueType: 'text',
      width: 260,
      copyable: true,
      // ellipsis: true,
      fixed: 'left',
    },
    {
      title: '任务',
      dataIndex: 'name',
      valueType: 'text',
      width: 300,
      valueEnum: JobDefineEnum,
      renderText: (text, record) => {
        if (record.name.startsWith('DYNAMIC_PROJECT:')) {
          return (
            <>
              <Tooltip placement="topLeft" title={record.name}>
                <Tag color="purple">项目动态任务</Tag>
              </Tooltip>
            </>
          );
        }
        return (
          <Tooltip placement="topLeft" title={record.name}>
            <Tag>
              {JobDefineEnum[record.name] ? <>{JobDefineEnum[record.name].text}</> : record.name}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'text',
      align: 'center',
      width: 120,
      valueEnum: {
        immediate: { text: '立即任务', status: 'gold' },
        interval: { text: '周期任务', status: 'blue' },
        schedule: { text: '计划任务', status: 'green' },
      },
      render: (type, record) => {
        if (type === 'single' || record.data.scheduleType === 'interval') {
          return (
            <Tooltip placement="topLeft" title={record.repeatInterval}>
              <Tag color="#87d068">周期任务</Tag>
            </Tooltip>
          );
        }
        if (record.data.scheduleType === 'schedule') {
          return <Tag color="#108ee9">计划任务</Tag>;
        }
        if (record.data.scheduleType === 'immediate') {
          return <Tag color="gold">立即任务</Tag>;
        }
        return <Tag color="#ff5500">未知任务</Tag>;
      },
    },
    {
      title: '执行数据',
      hideInSearch: true,
      hideInForm: true,
      dataIndex: ['data'],
      align: 'left',
      width: 320,
      render: (data) => {
        return (
          <Collapse
            items={[
              {
                key: '1',
                label: '结果详情',
                children: (
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item valueType="jsonCode">
                      {JSON.stringify(data, null, 2)}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                ),
              },
            ]}
          />
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      align: 'center',
      valueType: 'select',
      width: 100,
      valueEnum: {
        [-20]: { text: '最低', status: 'Error' },
        [-10]: { text: '低', status: 'Warning' },
        0: { text: '普通', status: 'Processing' },
        10: { text: '高', status: 'Success' },
        20: { text: '最高', status: 'Success' },
      },
    },
    {
      title: '下次运行时间',
      dataIndex: 'nextRunAt',
      hideInSearch: true,
      align: 'center',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '最后运行时间',
      dataIndex: 'lastRunAt',
      hideInSearch: true,
      align: 'center',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '最后完成时间',
      dataIndex: 'lastFinishedAt',
      hideInSearch: true,
      align: 'center',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '锁定时间',
      dataIndex: 'lockedAt',
      hideInSearch: true,
      align: 'center',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      align: 'center',
      hideInSearch: true,
      valueType: 'textarea',
      width: 150,
    },
    {
      title: '重试次数',
      dataIndex: 'failCount',
      hideInSearch: true,
      align: 'center',
      valueType: 'text',
      width: 100,
    },
    {
      title: '进度',
      hideInSearch: true,
      align: 'center',
      dataIndex: 'progress',
      valueType: 'progress',
      width: 140,
      fixed: 'right',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 220,
      fixed: 'right',
      renderText: (_, job) => {
        return (
          <div>
            <Space.Compact
              block
              style={{
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tooltip title="日志">
                <Button
                  icon={<ClockCircleOutlined style={{ color: 'blue' }} />}
                  onClick={() => {
                    setLogerState({
                      jobId: job._id,
                      visible: true,
                    });
                  }}
                />
              </Tooltip>
              <Tooltip title="重建任务">
                <Button
                  icon={<ReloadOutlined style={{ color: 'gold' }} />}
                  onClick={() => handleReCreateJob(job)}
                />
              </Tooltip>
              <Tooltip title="手动完成">
                <Popconfirm
                  key="purge"
                  placement="topLeft"
                  title={'确认完成'}
                  description={'将会手动设置任务为完成状态'}
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleManualComplete(job._id)}
                >
                  <Button icon={<CheckOutlined style={{ color: 'green' }} />} />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="编辑">
                <Button icon={<EditOutlined />} disabled />
              </Tooltip>
              <Tooltip title="删除">
                <Popconfirm
                  key="purge"
                  placement="topLeft"
                  title={'删除任务'}
                  description={'删除任务将会删除任务的所有信息，是否继续？'}
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleDeleteJob(job._id)}
                >
                  <Button icon={<DeleteOutlined style={{ color: 'red' }} />} />
                </Popconfirm>
              </Tooltip>
            </Space.Compact>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer
        header={{
          title: null,
        }}
      >
        <ProTable
          rowKey="_id"
          defaultSize="large"
          expandable={{
            fixed: 'left',
          }}
          search={{
            defaultCollapsed: false,
          }}
          loading={loading}
          pagination={pagination}
          columns={columns}
          formRef={formRef}
          dataSource={data}
          toolBarRender={() => [
            // <Popconfirm
            //   key="purge"
            //   placement="topLeft"
            //   title={'确定要清洗任务吗？'}
            //   description={'清洗任务将会删除所有「无定义」的任务，是否继续？'}
            //   okText="确定"
            //   cancelText="取消"
            //   onConfirm={handlePurgeJob}
            // >
            //   <Button key="purge" type="default" icon={<ClearOutlined />}>
            //     清洗调度
            //   </Button>
            // </Popconfirm>,
            <Button
              key="add"
              type="primary"
              onClick={handleOpenCreateModal}
              icon={<PlusOutlined />}
            >
              创建调度
            </Button>,
          ]}
          onChange={async (pagination, filters, sorter, extra) => {
            console.log('change', pagination, filters, sorter, extra);
            setPagination(pagination);
            setTimeout(fetchDataByParams, 0);
          }}
          onSubmit={() => {
            fetchDataByParams();
          }}
          onReset={() => {
            fetchDataByParams();
          }}
          columnsState={{
            value: columnsState,
            onChange: setColumnsState,
          }}
          options={{
            reload: () => {
              fetchDataByParams();
            },
          }}
        />
      </PageContainer>
      <JobLogDrawer
        {...logerState}
        onClose={() => {
          setLogerState({
            jobId: null,
            visible: false,
          });
        }}
      />
      {createModalVisible && (
        <CreateJobModal
          visible={createModalVisible}
          onClose={() => {
            setInitialValues(undefined);
            setCreateModalVisible(false);
          }}
          onSucceed={() => {
            fetchDataByParams();
          }}
          initialValues={initialValues}
          jobDefine={jobDefine}
        />
      )}
    </div>
  );
};
export default JobList;
