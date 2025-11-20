import { BoringAvatar } from '@/components/BoringAvatar';
import RepoAvatarWithName from '@/components/RepoAvatarWithName';
import { formatDateToYYYYMMDDHHmmss } from '@/utils/date';
import { InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Badge, Button, Empty, Popover } from 'antd';
import { API } from 'types';
import AutoFlow from '../auto-flow';

interface BasePageDetailProps {
  name: string;
  detail: API.ProjectsItemDetail;
}
const BasePageDetail: React.FC<BasePageDetailProps> = (props) => {
  const { name, detail } = props;

  return (
    <ProCard direction="column" ghost gutter={[0, 24]}>
      <ProCard gutter={24} ghost>
        <ProCard
          colSpan={16}
          title="指标信息"
          extra={
            <a target="_blank" href={detail.accessibleLink} rel="noreferrer">
              业务线上地址
              <RightOutlined style={{ marginLeft: 4 }} />
            </a>
          }
        >
          <ProDescriptions column={2} bordered labelStyle={{ width: 120 }}>
            <ProDescriptions.Item label="仓库" span={2}>
              <RepoAvatarWithName repo={detail.repos} />
            </ProDescriptions.Item>
            <ProDescriptions.Item label="状态" span={2}>
              {detail.status ? (
                <Badge status="success" text="开启" />
              ) : (
                <Badge status="default" text="未使用" />
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="创建时间" valueType="dateTime" span={2}>
              {detail.createdAt}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="更新时间" valueType="dateTime" span={2}>
              {detail.updatedAt}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="路由" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaRoutes.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaRoutes.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaRoutes.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>{formatDateToYYYYMMDDHHmmss(detail.metaRoutes.updatedAt)}</span>
                          </div>
                        )}
                        <div>
                          <span>总路由数量：</span>
                          {detail.metaRoutes.total && (
                            <Badge color="#01bc8d" count={detail.metaRoutes.total} />
                          )}
                        </div>
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="依赖" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaDeps.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaDeps.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaDeps.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>{formatDateToYYYYMMDDHHmmss(detail.metaDeps.updatedAt)}</span>
                          </div>
                        )}
                        <div>
                          <span>总依赖：</span>
                          <span>{detail.metaDeps.total}</span>
                        </div>
                        <div>
                          <span>没锁版本：</span>
                          <span>{detail.metaDeps.unLockTotal}</span>
                        </div>
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="离线包" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaOfflineAppV3.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaOfflineAppV3.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaOfflineAppV3.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>
                              {formatDateToYYYYMMDDHHmmss(detail.metaOfflineAppV3.updatedAt)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span>最大缓存大小：</span>
                          <span>{detail.metaOfflineAppV3.maximumFileSizeToCacheInBytes}</span>
                        </div>
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="路由加固" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaJscrambler.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaJscrambler.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaJscrambler.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>
                              {formatDateToYYYYMMDDHHmmss(detail.metaJscrambler.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="WebChecker" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaWebChecker.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaWebChecker.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaWebChecker.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>
                              {formatDateToYYYYMMDDHHmmss(detail.metaWebChecker.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="WebTest" span={2}>
              <ProDescriptions>
                <ProDescriptions.Item label="状态">
                  {detail.metaWebTest.status === true ? (
                    <Badge status="success" text="开启" />
                  ) : detail.metaWebTest.status === false ? (
                    <Badge status="default" text="未使用" />
                  ) : (
                    '-'
                  )}
                  <Popover
                    placement="topRight"
                    title={'简要信息'}
                    content={
                      <div>
                        {detail.metaWebTest.updatedAt && (
                          <div>
                            <span>更新时间：</span>
                            <span>{formatDateToYYYYMMDDHHmmss(detail.metaWebTest.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ color: '#ccc', position: 'relative', top: 3, left: 8 }}
                    />
                  </Popover>
                </ProDescriptions.Item>
              </ProDescriptions>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            paddingRight: 12,
          }}
        >
          <ProCard>
            <div
              style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ lineHeight: 1.5, fontWeight: 500, fontSize: 18 }}>所有者信息</div>
              <Avatar
                shape="square"
                src={<BoringAvatar name={detail?.owner?.name} size={64} />}
                size={64}
              />
              <div style={{ fontWeight: 500 }}>{detail?.owner?.name}</div>
              <div style={{ color: 'gray' }}>{detail?.owner?.email}</div>
              <div style={{ lineHeight: 1.5, fontWeight: 500, fontSize: 18 }}></div>
            </div>
          </ProCard>
          <div
            style={{
              flexGrow: 1,
              backgroundColor: 'white',
              borderRadius: 8,
              paddingInline: 24,
              paddingBlock: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ lineHeight: 1.5, fontWeight: 500, fontSize: 18 }}>相关项目</div>
              {detail?.userRelatedProjects
                .filter((proj) => proj.name !== name)
                .map((proj) => (
                  <div
                    key={proj._id}
                    onClick={() => {
                      window.location.href = `/project/detail/${proj.name}`;
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'start',
                      border: '1px solid #eee',
                      padding: 12,
                      borderRadius: 10,
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <div style={{ width: 42, height: 42 }}>
                      <BoringAvatar
                        name={proj.name}
                        size={42}
                        square={true}
                        variant="bauhaus"
                        colors="blue"
                      />
                    </div>
                    <div style={{ lineHeight: 1.4, marginLeft: 12, flexGrow: 1 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: 16,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {proj.name.toLocaleUpperCase()}
                      </div>
                      <div
                        style={{
                          color: 'gray',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}
                      >
                        {formatDateToYYYYMMDDHHmmss(proj.updatedAt)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', width: 42, height: 42 }}>
                      <Button
                        icon={<RightOutlined style={{ fontSize: 24 }} />}
                        shape="circle"
                        style={{ marginTop: 6, marginLeft: 4 }}
                        type="link"
                      ></Button>
                    </div>
                  </div>
                ))}
              {detail?.userRelatedProjects.filter((proj) => proj.name !== name).length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexGrow: 1,
                    height: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Empty description="暂无相关项目"></Empty>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProCard>
      {detail && <AutoFlow project={detail?._id} />}
    </ProCard>
  );
};

export default BasePageDetail;
