import { parserSourceMap } from '@/services/sourceMap';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Button, Card, Empty, Form, Input, Space, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { API } from 'types';
import { history } from '@umijs/max';
import { DeleteOutlined, FileAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CodeBlock } from '@/components/CodeBlock';

type ExtraData = {
  params: { url?: string; line?: number; column?: number };
  loading: boolean;
  data: API.parserSourceMapData | null;
};

const SourceMap = () => {
  const [data, setData] = useState<API.parserSourceMapData | null>(null);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [extraData, setExtraData] = useState<ExtraData[]>([]);

  const handleAddItem = () => {
    setExtraData([
      ...extraData,
      {
        loading: false,
        params: { url: undefined, line: undefined, column: undefined },
        data: null,
      },
    ]);
  };
  const initialValues = {
    url: searchParams.get('url') || searchParams.get('file') || '',
    line: searchParams.get('line') || searchParams.get('row') || '',
    column: searchParams.get('column') || '',
  };

  const handleDeleteItem = (index: number) => {
    setExtraData((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  useEffect(() => {
    if (initialValues.url && initialValues.line && initialValues.column) {
      setLoading(true);
      parserSourceMap({
        url: initialValues.url,
        line: Number(initialValues.line),
        column: Number(initialValues.column),
      })
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          message.error(err.message);
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <PageContainer
      subTitle={
        <Button
          type="dashed"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            history.push(
              '/tool/sourcemap?file=https%3A%2F%2Fassets.staticimg.com%2Fnatasha%2Fnpm%2Fsystemjs%406.12.1%2Fdist%2Fsystem.min.js&row=4&column=6824',
              { replace: true },
            );
            window.location.reload();
          }}
        >
          示例
        </Button>
      }
    >
      <Space size={10} direction="vertical" style={{ display: 'flex' }}>
        <Space size={10} direction="vertical" style={{ display: 'flex' }}>
          <Card>
            <Form
              initialValues={initialValues}
              layout="inline"
              onFinish={(values) => {
                console.log('onFinish', values);
                setLoading(true);
                parserSourceMap(values)
                  .then((res) => {
                    setData(res);
                  })
                  .catch((err) => {
                    message.error(err.message);
                    setData(null);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              <Form.Item
                label="文件地址"
                tooltip={'示例: https://assets.staticimg.com/natasha/npm/systemjs@6.12.1'}
                name="url"
                required
                rules={[{ required: true, message: '请输入文件地址' }]}
              >
                <Input placeholder="请输入文件地址" />
              </Form.Item>
              <Form.Item
                label="行"
                name="line"
                required
                tooltip="原始文件行"
                rules={[{ required: true, message: '请输入文件行' }]}
              >
                <Input type="number" placeholder="文件行" />
              </Form.Item>
              <Form.Item
                label="列"
                name="column"
                required
                tooltip="原始文件列"
                rules={[{ required: true, message: '请输入文件列' }]}
              >
                <Input type="number" placeholder="文件列" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card loading={loading}>
            {!data ? (
              <Empty />
            ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <Tag color="black">文件位置：{data.originalPosition?.source}</Tag>
                </div>
                <CodeBlock data={data.originalCode} highlineRow={data.originalPosition.line} />
              </>
            )}
          </Card>
        </Space>

        <Space size={10} direction="vertical" style={{ display: 'flex' }}>
          {extraData.map((item, index) => (
            <Space size={10} direction="vertical" style={{ display: 'flex' }} key={index}>
              <Card
                extra={
                  <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteItem(index)}>
                    移除文件
                  </Button>
                }
              >
                <Form
                  initialValues={item.params}
                  layout="inline"
                  onFinish={(values) => {
                    console.log('onFinish', values);
                    setExtraData((prev) => {
                      const next = [...prev];
                      next[index].loading = true;
                      return next;
                    });
                    parserSourceMap(values)
                      .then((res) => {
                        setExtraData((prev) => {
                          const next = [...prev];
                          next[index].data = res;
                          return next;
                        });
                      })
                      .catch((err) => {
                        message.error(err.message);
                        setData(null);
                      })
                      .finally(() => {
                        setExtraData((prev) => {
                          const next = [...prev];
                          next[index].loading = false;
                          return next;
                        });
                      });
                  }}
                >
                  <Form.Item
                    label="文件地址"
                    name="url"
                    required
                    rules={[{ required: true, message: '请输入文件地址' }]}
                  >
                    <Input placeholder="请输入文件地址" />
                  </Form.Item>
                  <Form.Item
                    label="行"
                    name="line"
                    required
                    rules={[{ required: true, message: '请输入文件行' }]}
                  >
                    <Input type="number" placeholder="文件行" />
                  </Form.Item>
                  <Form.Item
                    label="列"
                    name="column"
                    required
                    rules={[{ required: true, message: '请输入文件列' }]}
                  >
                    <Input type="number" placeholder="文件列" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card loading={item.loading}>
                {extraData[index].data === null ? (
                  <Empty />
                ) : (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <Tag color="black">
                        文件位置：{extraData[index].data?.originalPosition?.source}
                      </Tag>
                    </div>
                    <CodeBlock
                      data={extraData[index].data?.originalCode || []}
                      highlineRow={extraData[index].data?.originalPosition.line || 0}
                    />
                  </>
                )}
              </Card>
            </Space>
          ))}
        </Space>
        <Button
          block
          type="dashed"
          color="primary"
          icon={<FileAddOutlined />}
          onClick={() => handleAddItem()}
        >
          添加文件
        </Button>
      </Space>
    </PageContainer>
  );
};

export default SourceMap;
