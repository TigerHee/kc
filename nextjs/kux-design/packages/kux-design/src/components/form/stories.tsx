/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Form stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormItem, useForm } from './index';
import { Button } from '../button';

const meta: Meta<typeof Form> = {
  title: 'Form/Form',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础表单示例
export const Basic: Story = {
  render: () => {
    const [form] = useForm();

    const onFinish = (values: any) => {
      console.log('Form values:', values);
    };

    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <FormItem
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <input placeholder="请输入用户名" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <input type="password" placeholder="请输入密码" />
        </FormItem>
        <FormItem>
          <Button type="submit">提交</Button>
        </FormItem>
      </Form>
    );
  },
};

// 水平布局表单
export const Horizontal: Story = {
  render: () => {
    const [form] = useForm();

    const onFinish = (values: any) => {
      console.log('Form values:', values);
    };

    return (
      <Form 
        form={form} 
        onFinish={onFinish} 
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <FormItem
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <input placeholder="请输入用户名" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <input type="password" placeholder="请输入密码" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="submit">提交</Button>
        </FormItem>
      </Form>
    );
  },
};

// 带帮助信息的表单
export const WithHelp: Story = {
  render: () => {
    const [form] = useForm();

    const onFinish = (values: any) => {
      console.log('Form values:', values);
    };

    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <FormItem
          name="email"
          label="邮箱"
          help="请输入有效的邮箱地址"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <input placeholder="请输入邮箱" />
        </FormItem>
        <FormItem
          name="phone"
          label="手机号"
          help="请输入11位手机号码"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
          ]}
        >
          <input placeholder="请输入手机号" />
        </FormItem>
        <FormItem>
          <Button type="submit">提交</Button>
        </FormItem>
      </Form>
    );
  },
};
