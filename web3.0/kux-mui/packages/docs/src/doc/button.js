/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Button, useTheme } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const ButtonDoc = () => {
  const theme = useTheme();
  return (
    <>
      <div
        style={{
          paddingBottom: 34,
          borderBottom: `1px solid ${theme.colors.divider8}`,
          fontSize: 48,
          color: theme.colors.text,
        }}
      >
        Button
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: theme.colors.text, marginBottom: 24 }}>
        Contained
      </div>
      <div style={{ display: 'flex' }}>
        <Button htmlType="submit" variant="contained" mr={20}>
          Primary
        </Button>
        <Button variant="contained" mr={20} loading as="a">
          loading
        </Button>
        <Button variant="contained" mr={20} disabled>
          disabled
        </Button>
        <Button variant="contained" type="default" mr={20}>
          default
        </Button>
        <Button variant="contained" type="default" mr={20} loading>
          default
        </Button>
        <Button variant="contained" type="default" mr={20} disabled>
          default
        </Button>
        <Button variant="contained" type="secondary" mr={20}>
          secondary
        </Button>
        <Button variant="contained" type="secondary" mr={20} loading>
          secondary
        </Button>
        <Button variant="contained" type="secondary" mr={20} disabled>
          secondary
        </Button>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: theme.colors.text, marginBottom: 24 }}>
        Outlined
      </div>
      <div style={{ display: 'flex' }}>
        <Button variant="outlined" mr={20} type={'primary'}>
          正常态
        </Button>
        <Button variant="outlined" mr={20} loading>
          加载态
        </Button>
        <Button variant="outlined" mr={20} disabled>
          不可点击态
        </Button>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: theme.colors.text, marginBottom: 24 }}>
        Text
      </div>
      <div style={{ display: 'flex' }}>
        <Button variant="text" mr={20} as="a" type={'primary'}>
          正常态
        </Button>
        <Button variant="text" mr={20} as="a" type={'brandGreen'}>
          品牌绿
        </Button>
        <Button variant="text" mr={20} loading>
          加载态
        </Button>
        <Button variant="text" mr={20} disabled>
          不可点击态
        </Button>
        <Button type="secondary" variant="text" mr={20} as="a">
          正常态
        </Button>
        <Button type="secondary" variant="text" mr={20} loading>
          加载态
        </Button>
        <Button type="secondary" variant="text" mr={20} disabled>
          不可点击态
        </Button>
      </div>

      <div style={{ marginTop: 30, fontSize: 32, color: theme.colors.text, marginBottom: 24 }}>
        Icon
      </div>
      <div style={{ display: 'flex' }}>
        <Button startIcon={<ICSearchOutlined />}>Icon User</Button>
        <Button startIcon={<ICSearchOutlined />}>Icon User</Button>
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: theme.colors.text, marginBottom: 24 }}>
        Size: mini small basic large
      </div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Button mr={20} size="mini">
          Mini Button
        </Button>
        <Button mr={20} size="mini">
          Mini Button
        </Button>
        <Button mr={20} size="mini">
          Mini Button
        </Button>
      </div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Button mr={20} size="small">
          Small Button
        </Button>
        <Button mr={20} size="small">
          Small Button
        </Button>
        <Button mr={20} size="small">
          Small Button
        </Button>
      </div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Button mr={20} size="basic">
          Basic Button
        </Button>
        <Button mr={20} size="basic">
          Basic Button
        </Button>
        <Button mr={20} size="basic">
          Basic Button
        </Button>
      </div>
      <div style={{ display: 'flex', marginBottom: 24 }}>
        <Button mr={20} size="large">
          Large Button
        </Button>
        <Button mr={20} size="large">
          Large Button
        </Button>
        <Button mr={20} size="large">
          Large Button
        </Button>
      </div>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <ButtonDoc />
    </Wrapper>
  );
};
