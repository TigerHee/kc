import { getUserMustReadWikisStatusList } from '@/services/wikis';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Alert, Badge, Button, Card, Col, Popover, Row, message } from 'antd';
import React, { useEffect } from 'react';
import { API } from 'types';

const WikiCard: React.FC<{ wiki: API.MustReadWikisUserStatusItem }> = ({ wiki }) => {
  return (
    <Col className="gutter-row" span={8}>
      <Badge.Ribbon
        text={
          wiki.readStatus === 'success' ? (
            '已阅读'
          ) : wiki.readStatus === 'warning' ? (
            <Popover
              content={
                <>
                  <div>当前阅读的版本: {wiki.viewers?.lastVersionViewedNumber}</div>
                  <div>文档最新更新至: {wiki.lastVersion}</div>
                  <div style={{ color: 'red' }}>请尽快阅读最新版本</div>
                </>
              }
              title={'存在更新的版本未阅读'}
            >
              存在新版本
            </Popover>
          ) : (
            '未阅读'
          )
        }
        color={
          wiki.readStatus === 'success'
            ? 'green'
            : wiki.readStatus === 'warning'
              ? 'orange'
              : 'volcano'
        }
      >
        <Card
          style={{
            marginBottom: 10,
          }}
          title={
            <>
              <a href={wiki.url} target="_blank" rel="noreferrer">
                {wiki.title}
              </a>
              <span style={{ margin: '0 8px', display: 'inline-block' }}>|</span>
              <span style={{ color: 'gray', fontSize: 10 }}>
                数据时间:{' '}
                {wiki?.updatedAt !== undefined && wiki.updatedAt !== null && wiki.updatedAt !== ''
                  ? formatDateToYYYYMMDDHHmmss(wiki.updatedAt)
                  : '-'}
              </span>
            </>
          }
          size="small"
        >
          <span style={{ color: 'gray' }}>最新版本: {wiki.lastVersion}</span>
          <span style={{ margin: '0 8px', display: 'inline-block' }}>|</span>
          <span style={{ color: 'gray' }}>
            阅读数据:{' '}
            {wiki.viewers ? (
              <>
                最后查看时间: {formatDateToYYYYMMDDHHmmss(wiki.viewers?.lastViewedAt)}
                <span style={{ margin: '0 8px', display: 'inline-block' }}>|</span>
                最后查看版本: {wiki.viewers?.lastVersionViewedNumber}
                <span style={{ margin: '0 8px', display: 'inline-block' }}>|</span>
                查看总次数：{wiki.viewers?.views}
              </>
            ) : (
              '-'
            )}
          </span>
        </Card>
      </Badge.Ribbon>
    </Col>
  );
};

interface UserMustReadWikiListProps {
  userId: string | undefined;
}
const UserMustReadWikiList: React.FC<UserMustReadWikiListProps> = ({ userId }) => {
  const [mustReadList, setMustReadList] = React.useState<API.MustReadWikisUserStatusItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserMustReadWikisStatusList(userId)
        .then((res) => {
          setMustReadList(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const handleRefresh = () => {
    if (userId) {
      setLoading(true);
      getUserMustReadWikisStatusList(userId)
        .then((res) => {
          setMustReadList(res);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      message.error('用户信息异常，请重新登录');
    }
  };

  return (
    <PageContainer
      header={{
        title: null,
      }}
    >
      <Alert message="每天定时更新阅读状态，请勿重复刷新" type="info" showIcon />
      <Card
        title={`${username ? `[${username}] ` + '的' : ''}必读文档`}
        loading={loading}
        bordered={false}
        extra={<Button onClick={handleRefresh}>刷新</Button>}
      >
        <Row gutter={16}>
          {mustReadList.map((wiki) => (
            <WikiCard key={wiki._id} wiki={wiki} />
          ))}
        </Row>
      </Card>
    </PageContainer>
  );
};

export default UserMustReadWikiList;
