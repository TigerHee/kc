import { useState } from 'react';
import { Card, Row, Col, Space, Button, Tag } from 'antd';
import { API } from 'types';
import dayjs from 'dayjs';
import { decodeHtml } from '../../utils';

type Props = {
  data: API.AlertItem;
  statusData: API.AlertStatusList;
};

const labelMap: Record<string, string> = {
  kunlunId: '聚合的kunlunId',
  teamsHrefData: '告警来源',
  status: '确认状态',
  appKey: '应用',
  alarmGroup: '告警组',
  createTime: '创建时间',
};

const getLabel = (key: string) => labelMap[key] || key;

const getItems = (data: Partial<API.AlertItem>, statusData: API.AlertStatusList) => {
  const stringData = Object.entries(data).filter(([key, v]) => {
    // 一些不需要展示的 key
    if (['updateTime', '__v', 'dataTime', 'receiveTime'].includes(key)) {
      return false;
    }
    // 一些需要展示的 key
    if (['teamsHrefData', 'kunlunId'].includes(key)) {
      return true;
    }
    return typeof v === 'string' || typeof v === 'number';
  }) as [string, string | number][];

  return stringData.map(([key, rawVal]) => {
    let val: React.ReactNode = rawVal;

    // 显示值需要特殊处理的 key
    if (key === 'status') {
      val = (
        <span style={{ color: '#faad14' }}>
          {String(statusData?.find((i) => i.value === rawVal)?.label ?? val)}
        </span>
      );
    }
    // 时间格式化
    if (key.includes('Time')) {
      val = dayjs(rawVal as string | number).format('YYYY-MM-DD HH:mm:ss');
    }
    // 消息标红
    if (['message', 'alertMsg'].includes(key)) {
      val = <span style={{ color: '#ff4d4f' }}>{decodeHtml(String(val))}</span>;
    }
    // 跳转链接
    if (key === 'teamsHrefData' && Array.isArray(rawVal)) {
      val = (
        <Space direction="vertical">
          {rawVal?.map(({ url, _id, name }) => (
            <Button
              href={url}
              type="link"
              key={_id}
              style={{
                color: '#01bc8d',
                wordBreak: 'break-all',
                fontSize: '16px',
                fontWeight: 500,
                padding: 0,
                whiteSpace: 'normal',
                textAlign: 'left',
                height: 'fit-content',
              }}
              target="_blank"
            >
              {`${name}: ${url}`}
            </Button>
          ))}
        </Space>
      );
    }
    if (key === 'kunlunId' && Array.isArray(rawVal)) {
      val = rawVal.map((i) => <Tag key={i}>{i}</Tag>);
    }

    return {
      label: key,
      value: val,
    };
  });
};

export default ({ data, statusData }: Props) => {
  const [isShowOther, setShowOther] = useState(false);

  const {
    alarmGroup,
    appKey,
    status,
    alertMsg,
    message,
    firstDirector,
    createTime,
    teamsHrefData,
    ...otherData
  } = data;

  const items = getItems(
    { alarmGroup, status, appKey, alertMsg, createTime, message, firstDirector, teamsHrefData },
    statusData,
  );
  const itemsOther = getItems(otherData, statusData);

  return (
    <Card title="明细" bordered={false}>
      <div>
        {items.map(({ label, value }) => (
          <Row key={label} style={{ marginBottom: 12 }}>
            <Col span={4}>{getLabel(label)}</Col>
            <Col span={16} style={{ wordBreak: 'break-all', fontSize: '16px', fontWeight: 500 }}>
              {value}
            </Col>
          </Row>
        ))}
      </div>

      <Button onClick={() => setShowOther((pre) => !pre)} type="dashed">
        {isShowOther ? '隐藏其他明细' : '显示其他明细'}
      </Button>

      {isShowOther && (
        <div style={{ marginTop: 12 }}>
          {itemsOther.map(({ label, value }) => (
            <Row key={label} style={{ marginBottom: 12 }}>
              <Col span={4}>{getLabel(label)}</Col>
              <Col span={16} style={{ wordBreak: 'break-all', fontSize: '16px', fontWeight: 500 }}>
                {value}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </Card>
  );
};
