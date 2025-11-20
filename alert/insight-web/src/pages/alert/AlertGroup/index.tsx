import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Divider, Spin, Popconfirm } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getAlertGroupList, delAlertGroup } from '@/services/alert';
import './style.less';
import AddModal from './AddModal';

type AlertGroupItem = {
  _id: string;
  name: string;
};

const AlertGroupList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [curItem, setCurItem] = useState<AlertGroupItem | null>(null);

  const { data, loading, refresh: refreshList } = useRequest(getAlertGroupList);

  return (
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          setModalOpen(true);
          setCurItem(null);
        }}
      >
        新增告警组
      </Button>
      <Divider />
      <Spin spinning={loading}>
        <div className="groupBox">
          {data?.map((item: AlertGroupItem) => {
            const { _id, name } = item;
            return (
              <div className="groupItem" key={_id}>
                <span>{name}</span>
                <EditFilled
                  onClick={() => {
                    setModalOpen(true);
                    setCurItem(item);
                  }}
                  className="editIcon"
                />
                <Popconfirm
                  title="确定要删除该告警组吗？"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={async () => {
                    await delAlertGroup({ _id });
                    refreshList();
                  }}
                >
                  <DeleteFilled className="delIcon" />
                </Popconfirm>
              </div>
            );
          })}
        </div>
      </Spin>

      {isModalOpen && (
        <AddModal
          open={isModalOpen}
          refreshList={refreshList}
          onCancel={() => setModalOpen(false)}
          curItem={curItem}
        />
      )}
    </PageContainer>
  );
};

export default AlertGroupList;
