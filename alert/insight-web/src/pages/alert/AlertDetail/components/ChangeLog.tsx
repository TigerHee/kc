import { Card, Descriptions, Divider, Empty } from 'antd';
import { API } from 'types';
import { Fragment, useMemo } from 'react';
import dayjs from 'dayjs';

type Props = {
  data: API.AlertItem;
  statusData: API.AlertStatusList;
};

export default ({ data, statusData }: Props) => {
  const list = useMemo(() => {
    let arr = data?.operator || [];

    if (data?.viewData?.email) {
      arr = [{ ...data?.viewData, status: '响应' }, ...arr];
    }
    if (data?.finishData?.email) {
      arr = [...arr, { ...data?.finishData, status: '处理完成' }];
    }

    return arr;
  }, [data]);

  return (
    <Card title="修改记录" bordered={false}>
      {list.length > 0 ? (
        <Fragment>
          {list.map(({ _id, status, email, remark, time }) => {
            const list = [
              {
                label: '状态',
                children: statusData?.find((i) => i.value === status)?.label ?? status,
              },
              {
                label: '操作人',
                children: email,
              },
              {
                label: '备注',
                children: remark || '--',
              },
              {
                label: '时间',
                children: dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
              },
            ];
            return (
              <Fragment key={_id}>
                <Descriptions items={list} column={2} />
                <Divider />
              </Fragment>
            );
          })}
        </Fragment>
      ) : (
        <Empty />
      )}
    </Card>
  );
};
