import { getAlertAnalyze, getConfigStatus } from '@/services/alert';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import { API } from 'types';
import { getAverageMinutes, getP90AverageMinutes, getPercent } from '../utils';

const INIT_STATUS = '1';

const AlertAnalyze: React.FC = () => {
  const { data: statusData } = useRequest(getConfigStatus);

  const columns: ProColumns<API.AlertAnalyzeItem>[] = [
    {
      title: '告警组',
      hideInSearch: true,
      dataIndex: 'alarmGroup',
      valueType: 'text',
      align: 'left',
    },
    {
      title: '状态分布',
      hideInSearch: true,
      dataIndex: 'statusCounts',
      valueType: 'text',
      align: 'right',
      render: (val, item) => {
        const { statusCounts, total } = item;
        return statusData?.map(({ label, value }) => {
          return (
            <div key={value}>
              <span>{label}: </span>
              <span
                style={value === INIT_STATUS && statusCounts[value] > 0 ? { color: '#ff4d4f' } : {}}
              >
                {`${statusCounts[value]} (${getPercent(statusCounts[value], total)})`}
              </span>
            </div>
          );
        });
      },
    },
    {
      title: '告警总数',
      hideInSearch: true,
      dataIndex: 'total',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: '告警有效率',
      tooltip:
        '(是问题_紧急_立即修复 + 是问题_不紧急_下个迭代修复 + 是问题_上下游问题 + 持续观察) / 确认状态告警数',
      hideInSearch: true,
      dataIndex: 'total',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) =>
        a.validTotal / (a.total - a.statusCounts[INIT_STATUS]) -
        b.validTotal / (b.total - b.statusCounts[INIT_STATUS]),
      render: (val, item) => {
        const { total, validTotal, statusCounts } = item;
        const percent = getPercent(validTotal, total - statusCounts[INIT_STATUS]);
        return `${validTotal} (${percent})`;
      },
    },
    {
      title: '响应率',
      tooltip: '响应数 / 告警数总数',
      hideInSearch: true,
      dataIndex: 'viewTotal',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) => a.viewTotal / a.total - b.viewTotal / b.total,
      render: (val, item) => {
        const { total, viewTotal } = item;
        const percent = getPercent(viewTotal, total);
        return `${viewTotal} (${percent})`;
      },
    },
    {
      title: '完成率',
      tooltip: '处理完成数 / 告警数总数',
      hideInSearch: true,
      dataIndex: 'finishTotal',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) => a.finishTotal / a.total - b.finishTotal / b.total,
      render: (val, item) => {
        const { total, finishTotal } = item;
        const percent = getPercent(finishTotal, total);
        return `${finishTotal} (${percent})`;
      },
    },
    {
      title: '响应平均耗时',
      tooltip: (
        <div>
          <div>响应时间总和 / 响应次数</div>
          <div>全时间：统计所有时间点的数据</div>
          <div>工作时间：周一至周五 10:00-12:00 14:00-18:00</div>
          <div>排序按 工作时间 数据排</div>
        </div>
      ),
      hideInSearch: true,
      dataIndex: 'viewTimeList',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) =>
        getAverageMinutes(a.workViewTimeList).average -
        getAverageMinutes(b.workViewTimeList).average,
      render: (text, item) => {
        const { viewTimeList, workViewTimeList } = item;
        const { average } = getAverageMinutes(viewTimeList);
        const { average: workAverage } = getAverageMinutes(workViewTimeList);
        return (
          <>
            <div>工作时间：{workViewTimeList?.length > 0 ? `${workAverage} min` : '--'}</div>
            <div>全时间：{viewTimeList?.length > 0 ? `${average} min` : '--'}</div>
          </>
        );
      },
    },
    {
      title: '响应 P90 平均耗时',
      tooltip: (
        <div>
          <div>前90%响应时间总和 / 对应响应次数</div>
          <div>全时间：统计所有时间点的数据</div>
          <div>工作时间：周一至周五 10:00-12:00 14:00-18:00</div>
          <div>排序按 工作时间 数据排</div>
        </div>
      ),
      hideInSearch: true,
      dataIndex: 'viewTimeList2',
      valueType: 'text',
      align: 'left',
      sorter: (a, b) =>
        getP90AverageMinutes(a.workViewTimeList).average -
        getP90AverageMinutes(b.workViewTimeList).average,
      render: (text, item) => {
        const { viewTimeList, workViewTimeList } = item;
        const { average } = getP90AverageMinutes(viewTimeList);
        const { average: workAverage } = getP90AverageMinutes(workViewTimeList);
        return (
          <>
            <div>工作时间：{workViewTimeList?.length > 0 ? `${workAverage} min` : '--'}</div>
            <div>全时间：{viewTimeList?.length > 0 ? `${average} min` : '--'}</div>
          </>
        );
      },
    },
    {
      title: '处理完成平均耗时',
      tooltip: '只统计（是问题 - 紧急 - 立即修复）的数据',
      hideInSearch: true,
      dataIndex: 'finishTimeList',
      valueType: 'text',
      align: 'right',
      sorter: (a, b) =>
        getAverageMinutes(a.finishTimeList).average - getAverageMinutes(b.finishTimeList).average,
      render: (text, item) => {
        const { finishTimeList } = item;
        const { average } = getAverageMinutes(finishTimeList);
        return finishTimeList?.length > 0 ? `${average} min` : '--';
      },
    },
    // {
    //   title: '处理完成 P90 平均耗时',
    //   tooltip: '只统计（是问题 - 紧急 - 立即修复）的数据',
    //   hideInSearch: true,
    //   dataIndex: 'finishTimeList2',
    //   valueType: 'text',
    //   align: 'right',
    //   sorter: (a, b) =>
    //     getP90AverageMinutes(a.finishTimeList).average - getP90AverageMinutes(b.finishTimeList).average,
    //   render: (text, item) => {
    //     const { finishTimeList } = item;
    //     const { average } = getP90AverageMinutes(finishTimeList);
    //     return finishTimeList?.length > 0 ? `${average} min` : '--';
    //   },
    // },
    {
      title: '时间范围',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true, // 不在表格中展示，只在搜索栏中显示
      initialValue: [dayjs().startOf('week'), dayjs().endOf('week')], // 默认最近7天
      fieldProps: {
        ranges: {
          今天: [dayjs().startOf('day'), dayjs().endOf('day')],
          昨天: [
            dayjs().subtract(1, 'day').startOf('day'),
            dayjs().subtract(1, 'day').endOf('day'),
          ],
          过去7天: [dayjs().subtract(7, 'day'), dayjs()],
          过去14天: [dayjs().subtract(14, 'day'), dayjs()],
          本周: [dayjs().startOf('week'), dayjs().endOf('week')],
          上周: [
            dayjs().subtract(1, 'week').startOf('week'),
            dayjs().subtract(1, 'week').endOf('week'),
          ],
          本月: [dayjs().startOf('month'), dayjs().endOf('month')],
          上月: [
            dayjs().subtract(1, 'month').startOf('month'),
            dayjs().subtract(1, 'month').endOf('month'),
          ],
        },
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="_id"
        columns={columns}
        expandable={{
          fixed: 'left',
        }}
        search={{
          defaultCollapsed: false, // 👈 默认展开搜索栏
        }}
        pagination={false}
        request={async (params) => {
          const [start, end] = params.time || [];
          const startTime = start ? dayjs(start).startOf('day').valueOf() : 0;
          const endTime = end ? dayjs(end).endOf('day').valueOf() : Date.now();

          const res = await getAlertAnalyze({ startTime, endTime });

          return {
            data: res.list,
            success: true,
            total: res.list?.length,
          };
        }}
      />
    </PageContainer>
  );
};

export default AlertAnalyze;
