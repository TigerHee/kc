import UserAvatarWithName from '@/components/UserAvatarWithName';
import { getUserActionLogs } from '@/services/user';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { Drawer, Empty, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';

interface ActionLogsDrawerProps {
  id: string;
  visible: boolean;
  onClose: () => void;
}

const fieldsMap = {
  'prAuth.status': 'PR权限状态',
  'prAuth.rejectReason': 'PR拒绝原因',
  role: '角色权限',
};

const ActionLogsDrawer: React.FC<ActionLogsDrawerProps> = (props) => {
  const { id, visible, onClose } = props;
  const [list, setList] = useState<API.UserActionLogItem[]>([]);

  useEffect(() => {
    if (visible && id) {
      getUserActionLogs(id).then((res) => {
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
      title="操作日志"
    >
      <Timeline
        mode="left"
        // mode="alternate"
        items={list.map((item) => ({
          key: item._id,
          children: (
            <>
              <div>
                <div style={{ color: 'green', fontWeight: 500 }}>
                  {item.action in fieldsMap
                    ? fieldsMap[item.action as keyof typeof fieldsMap]
                    : item.action}
                </div>
                <div
                  style={{ fontSize: 14, marginBottom: 4 }}
                >{`从 [${item.prev}] 改成 [${item.current}]`}</div>
              </div>
              <div style={{ transform: 'scale(0.7)', transformOrigin: '0 10px' }}>
                <UserAvatarWithName user={item.actionBy} />
              </div>
              <div style={{ color: 'gray', fontSize: 12 }}>
                操作时间：{formatDateToYYYYMMDDHHmmss(item.createdAt)}
              </div>
            </>
          ),
          // label: formatDateToYYYYMMDDHHmmss(item.createdAt),
        }))}
      />
      {list.length === 0 && <Empty description="暂无操作日志" />}
    </Drawer>
  );
};

export default ActionLogsDrawer;
