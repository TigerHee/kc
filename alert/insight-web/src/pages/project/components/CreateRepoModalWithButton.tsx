import { getReposByProjectKeyFromBitbucket } from '@/services/bitbucket';
import { createRepo } from '@/services/repos';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Form, Select } from 'antd';
import { useState } from 'react';
import { API } from 'types';
import { Common } from 'types/common';

interface CreateRepoModalWithButtonProps {
  onSuccess: () => void;
  groupOptions: Common.SelectOptionItem[];
}

export const CreateRepoModalWithButton: React.FC<CreateRepoModalWithButtonProps> = (props) => {
  const { onSuccess, groupOptions } = props;
  const [form] = Form.useForm();
  const [currentGroupForReposOptions, setCurrentGroupForReposOptions] = useState<API.ReposItem[]>(
    [],
  );
  return (
    <ModalForm
      title="从远程同步仓库"
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      trigger={
        <Button type="primary" icon={<PlusOutlined />}>
          从远程同步仓库
        </Button>
      }
      onOpenChange={(open) => {
        console.log('onOpenChange', open);
        if (!open) {
          form.resetFields();
          setCurrentGroupForReposOptions([]);
        }
      }}
      onFinish={async (values) => {
        console.log(values);
        const remoteRepoInfo = currentGroupForReposOptions.find(
          (item) => item.slug === values?.remote,
        );
        const _data = {
          group: values?.group,
          ...remoteRepoInfo,
        };
        console.log('_data', _data);
        try {
          await createRepo(_data as API.ReposItem);
          setCurrentGroupForReposOptions([]);
          onSuccess();
          form.resetFields();
          return true;
        } catch (error) {}
      }}
    >
      <Form.Item
        label="仓库分组"
        name="group"
        required
        rules={[{ required: true, message: '请选择仓库分组' }]}
      >
        <Select
          options={groupOptions}
          placeholder="选择仓库分组"
          showSearch
          onChange={(value) => {
            if (value) {
              setCurrentGroupForReposOptions([]);
              getReposByProjectKeyFromBitbucket(value).then((res) => {
                setCurrentGroupForReposOptions(res);
              });
            } else {
              setCurrentGroupForReposOptions([]);
            }
          }}
        />
      </Form.Item>

      {currentGroupForReposOptions.length > 0 && (
        <Form.Item
          label="远程仓库"
          name="remote"
          required
          rules={[{ required: true, message: '请选择远程仓库' }]}
        >
          <Select
            options={currentGroupForReposOptions.map((item) => ({
              label: item.name + ' ' + item.description,
              value: item.slug,
            }))}
            placeholder="选择远程仓库"
          />
        </Form.Item>
      )}
    </ModalForm>
  );
};
