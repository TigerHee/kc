import { UserSelect } from '@/components/UserSelect';
import { updateRoute } from '@/services/route';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Alert, Button, Form, Input, Select, Space, Switch } from 'antd';
import { useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

interface UpdateRouteModalWithButtonProps {
  onSuccess: () => void;
  data: API.RouteItem;
  userOptions: Common.UserSelectOptionItem[];
}

export const UpdateRouteModalWithButton: React.FC<UpdateRouteModalWithButtonProps> = (props) => {
  const { onSuccess, data, userOptions } = props;
  const [form] = Form.useForm();
  const [selectedIsIgnore, setSelectedIsIgnore] = useState<boolean>(data.isIgnore);

  const getCompetitor = (s: string) => {
    try {
      return JSON.parse(s);
    } catch (error) {
      return {};
    }
  };

  return (
    <ModalForm
      title="路由信息编辑"
      autoFocusFirstInput
      submitTimeout={2000}
      form={form}
      modalProps={{
        destroyOnClose: true,
      }}
      trigger={<Button type="default" icon={<EditOutlined />}></Button>}
      onOpenChange={(open) => {
        if (!open) {
          form.resetFields();
        } else {
          form.setFieldsValue({
            title: data.title,
            accessibleLink: data.accessibleLink,
            user: data.user ? [data.user._id] : [],
            isNeedLogin: data.isNeedLogin,
            isIgnore: data.isIgnore,
            competitor: getCompetitor(data.competitor),
          });
          setSelectedIsIgnore(data.isIgnore);
        }
      }}
      onFinish={async (values) => {
        const _data = {
          title: values.title,
          accessibleLink: values.accessibleLink,
          isNeedLogin: values.isNeedLogin,
          isIgnore: values.isIgnore,
          user: values?.user?.[0] ?? null,
          competitor: JSON.stringify(values.competitor),
        };
        try {
          await updateRoute(data._id, _data);
          form.resetFields();
          onSuccess();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="负责人"
        name="user"
        required
        rules={[{ required: true, message: '请选择负责人' }]}
      >
        <UserSelect userOptions={userOptions} placeholder="请输入路由路径" />
      </Form.Item>

      <Form.Item
        label="页面标题"
        name="title"
        required
        rules={[{ required: true, message: '请输入页面标题' }]}
      >
        <Input placeholder="请输入页面标题" />
      </Form.Item>

      <Form.Item label="是否忽略" name="isIgnore">
        <Switch
          checkedChildren="忽略"
          unCheckedChildren="不忽略"
          onChange={(checked) => {
            setSelectedIsIgnore(checked);
            form.setFieldsValue({ accessibleLink: '' });
          }}
        />
      </Form.Item>

      <Form.Item
        label="页面可访问链接"
        name="accessibleLink"
        required={!selectedIsIgnore}
        rules={selectedIsIgnore ? [] : [{ required: true, message: '请输入路由地址' }]}
      >
        <Input placeholder="请输入路由地址" />
      </Form.Item>

      <Form.Item label="页面是否需要登录" name="isNeedLogin">
        <Switch checkedChildren="需要" unCheckedChildren="不需要" />
      </Form.Item>

      <Alert message="竞对信息" style={{ marginBottom: 15 }} />

      <Form.Item label="phemex">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'phemex', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'phemex', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="okx">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'okx', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'okx', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="binance">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'binance', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'binance', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="huobi">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'huobi', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'huobi', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="bybit">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'bybit', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'bybit', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="bitget">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'bitget', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'bitget', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="mexc">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'mexc', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'mexc', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="gate">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item name={['competitor', 'gate', 'mustLogin']} noStyle>
            <Select placeholder="是否需要登录" style={{ width: 200 }} allowClear>
              <Select.Option value={true}>需要登录</Select.Option>
              <Select.Option value={false}>不需要登录</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['competitor', 'gate', 'url']}
            rules={[
              {
                // url 的正则匹配
                pattern: new RegExp('^(https|http)://'),
                message: '请输入正确的url',
              },
            ]}
            noStyle
          >
            <Input placeholder="页面地址" allowClear />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
    </ModalForm>
  );
};
