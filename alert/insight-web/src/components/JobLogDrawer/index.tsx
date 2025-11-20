import { getJobListByJobId } from '@/services/jobs';
import { Drawer, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ProDescriptions } from '@ant-design/pro-components';

interface JobLogDrawerProps {
  visible: boolean;
  jobId: string | null;
  onClose?: () => void;
}

const getColor = (key: string) => {
  const map = {
    create: 'blue',
    start: 'blue',
    complete: 'green',
    fail: 'red',
    error: 'red',
    success: 'green',
    ['manual-complete']: 'orange',
  };
  if (key in map) {
    return map[key as keyof typeof map];
  }
  return 'gray';
};
const getAction = (key: string) => {
  const map = {
    create: '创建',
    start: '开始',
    complete: '完成',
    fail: '失败',
    error: '错误',
    success: '成功',
    ['manual-complete']: '手动完成',
  };
  if (key in map) {
    return map[key as keyof typeof map];
  }
  return '未知';
};
const JobLogDrawer: React.FC<JobLogDrawerProps> = ({ visible, jobId, onClose }) => {
  const [list, setList] = useState<API.LogItem[]>([]);

  useEffect(() => {
    if (visible && jobId) {
      getJobListByJobId(jobId, { limit: 100 }).then((res) => {
        setList(res);
      });
    }
    if (!visible) {
      setList([]);
    }
  }, [visible]);

  return (
    <Drawer
      open={visible}
      width={480}
      placement="right"
      closable={false}
      onClose={onClose}
      title="任务日志"
    >
      <Timeline
        mode="left"
        items={list.map((item) => {
          dayjs.extend(utc);
          dayjs.extend(timezone);
          const now = dayjs(item.createdAt);
          const date = now.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
          return {
            key: item._id,
            color: getColor(item.status),
            children: (
              <div>
                <div>{getAction(item.status)}</div>
                <div>
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item valueType="jsonCode">
                      {JSON.stringify(item.data, null, 2)}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </div>
                <div>{item.error}</div>
              </div>
            ),
            label: date,
          };
        })}
      />
      {list.length === 100 ? <div>只显示最近100条日志</div> : null}
    </Drawer>
  );
};

export default JobLogDrawer;
