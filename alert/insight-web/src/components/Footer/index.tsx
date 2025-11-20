import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'insight',
          title: 'insight',
          blankTarget: true,
          href: '',
        },
        {
          key: 'bitbucket',
          title: <GithubOutlined />,
          blankTarget: true,
          href: '',
        },
        {
          key: 'Insight Web',
          title: 'Ant Design',
          blankTarget: true,
          href: '',
        },
      ]}
    />
  );
};

export default Footer;
