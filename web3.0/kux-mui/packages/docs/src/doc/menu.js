/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Menu, MenuItem, Divider, Box as VaexBox, useTheme } from '@kux/mui';
import {
  ICAssetOverviewOutlined,
  ICFundAccountOutlined,
  ICTradeOutlined,
  ICDepositOutlined,
  ICWithdrawOutlined,
  ICHistoryOutlined,
} from '@kux/icons';
import styled from '@emotion/styled';
import Wrapper from './wrapper';

const Container = styled.div`
  display: flex;
`;

const Box = styled(VaexBox)`
  height: 100vh;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.background};
`;

const CusMenu = styled(Menu)`
  padding-top: 8px;
  ${(props) => props.theme.breakpoints.down('xl')} {
    padding-top: 8px;
  }
`;

const Doc = () => {
  const theme = useTheme();
  return (
    <Box mr={40} theme={theme}>
      <Menu defaultSelectedKeys={['4']} onSelect={(v) => console.log('basic', v)}>
        <MenuItem key="1" icon={<ICAssetOverviewOutlined size={20} />}>
          Assets Overview
        </MenuItem>
        <MenuItem key="2" icon={<ICFundAccountOutlined size={20} />}>
          Funding Account
        </MenuItem>
        <MenuItem key="3" icon={<ICTradeOutlined size={20} />}>
          Trading Account
        </MenuItem>
        <MenuItem key="4" icon={<ICDepositOutlined size={20} />}>
          Deposit
        </MenuItem>
        <MenuItem key="5" icon={<ICWithdrawOutlined size={20} />}>
          Withdraw
        </MenuItem>
        <Divider style={{ margin: '16px 0' }} />
        <MenuItem key="6" icon={<ICHistoryOutlined size={20} />}>
          History
        </MenuItem>
        <MenuItem key="7">Default Icon</MenuItem>
      </Menu>
    </Box>
  );
};

const Doc1 = () => {
  const theme = useTheme();
  return (
    <Box theme={theme} mr={40} style={{ display: 'flex', justifyContent: 'center' }}>
      <Menu defaultSelectedKeys={['1']} size="mini" onSelect={(v) => console.log('mini', v)}>
        <MenuItem key="1" icon={<ICAssetOverviewOutlined size={20} />}>
          Assets
        </MenuItem>
        <MenuItem key="2" icon={<ICFundAccountOutlined size={20} />}>
          Funding
        </MenuItem>
        <MenuItem key="3" icon={<ICTradeOutlined size={20} />}>
          Trading
        </MenuItem>
        <MenuItem key="4" icon={<ICDepositOutlined size={20} />}>
          Deposit
        </MenuItem>
        <MenuItem key="5" icon={<ICWithdrawOutlined size={20} />}>
          Withdraw Plugins
        </MenuItem>
        <Divider style={{ margin: '16px auto', width: '80%' }} />
        <MenuItem key="6" icon={<ICHistoryOutlined size={20} />}>
          History
        </MenuItem>
        <MenuItem key="7">Default</MenuItem>
      </Menu>
    </Box>
  );
};

const Doc2 = () => {
  const theme = useTheme();
  return (
    <Box theme={theme} mr={40}>
      <CusMenu
        theme={theme}
        showIcon={false}
        defaultSelectedKeys={['1-1-2']}
        onSelect={(v) => console.log('sub menu', v)}
        search
        searchOptions={[
          { label: 'Sropdown', key: '1' },
          { label: 'Sropdown', key: '2' },
          { label: 'Sropdown', key: '3' },
          { label: 'Sropdown', key: '4' },
          { label: 'Sropdown', key: '5' },
          { label: 'Sropdown', key: '6' },
          { label: 'Sropdown', key: '7' },
          { label: 'Sropdown', key: '8' },
          { label: 'Sropdown', key: '9' },
          { label: 'Sropdown', key: '10' },
          { label: 'Sropdown', key: '11' },
          { label: 'Sropdown', key: '12' },
        ]}
        onSearch={(e) => console.log('search: ', e)}
      >
        <Menu.SubMenu title="新手教程" key="1" icon={<ICAssetOverviewOutlined size={20} />} defaultExpand>
          <Menu.SubMenu title="身份验证" key="1-1" defaultExpand={false}>
            <MenuItem key="1-1-1">
              如何下载KuCoin App & 如何下载KuCoin & 如何下载KuCoin App & 如何下载KuCoin
            </MenuItem>
            <MenuItem key="1-1-2">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
            <MenuItem key="1-1-3">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
          </Menu.SubMenu>
          <MenuItem key="1-2">安全设置</MenuItem>
          <MenuItem key="1-3">KYC实名认证</MenuItem>
          <MenuItem key="1-4">新手常见问题</MenuItem>
          <MenuItem key="1-5">KuCoin Review</MenuItem>
        </Menu.SubMenu>
        <Menu.SubMenu title="新手教程" key="2" icon={<ICWithdrawOutlined size={20} />} defaultExpand={false}>
          <Menu.SubMenu title="身份验证" key="2-1" defaultExpand={false}>
            <MenuItem key="2-1-1">
              如何下载KuCoin App & 如何下载KuCoin & 如何下载KuCoin App & 如何下载KuCoin
            </MenuItem>
            <MenuItem key="2-1-2">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
            <MenuItem key="2-1-3">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
          </Menu.SubMenu>
          <MenuItem key="2-2">安全设置</MenuItem>
          <MenuItem key="2-3">KYC实名认证</MenuItem>
          <MenuItem key="2-4">新手常见问题</MenuItem>
          <MenuItem key="2-5">KuCoin Review</MenuItem>
        </Menu.SubMenu>
        <MenuItem key="3" icon={<ICTradeOutlined size={20} />}>
          Trading
        </MenuItem>
        <MenuItem key="4" icon={<ICDepositOutlined size={20} />}>
          Deposit
        </MenuItem>
        <MenuItem key="5" icon={<ICWithdrawOutlined size={20} />}>
          Withdraw Plugins
        </MenuItem>
      </CusMenu>
    </Box>
  );
};

const Doc3 = () => {
  const theme = useTheme();
  return (
    <Box theme={theme} mr={40}>
      <CusMenu
        theme={theme}
        showIcon
        defaultSelectedKeys={['1-1-2']}
        onSelect={(v) => console.log('sub menu', v)}
        search
        searchOptions={[
          { label: 'Sropdown', key: '1' },
          { label: 'Sropdown', key: '2' },
          { label: 'Sropdown', key: '3' },
          { label: 'Sropdown', key: '4' },
          { label: 'Sropdown', key: '5' },
          { label: 'Sropdown', key: '6' },
          { label: 'Sropdown', key: '7' },
          { label: 'Sropdown', key: '8' },
          { label: 'Sropdown', key: '9' },
          { label: 'Sropdown', key: '10' },
          { label: 'Sropdown', key: '11' },
          { label: 'Sropdown', key: '12' },
        ]}
        onSearch={(e) => console.log('search: ', e)}
      >
        <Menu.SubMenu title="新手教程" key="1" icon={<ICAssetOverviewOutlined size={20} />} defaultExpand>
          <Menu.SubMenu title="身份验证" key="1-1" defaultExpand={false}>
            <MenuItem key="1-1-1">
              如何下载KuCoin App & 如何下载KuCoin & 如何下载KuCoin App & 如何下载KuCoin
            </MenuItem>
            <MenuItem key="1-1-2">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
            <MenuItem key="1-1-3">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
          </Menu.SubMenu>
          <MenuItem key="1-2">安全设置</MenuItem>
          <MenuItem key="1-3">KYC实名认证</MenuItem>
          <MenuItem key="1-4">新手常见问题</MenuItem>
          <MenuItem key="1-5">KuCoin Review</MenuItem>
        </Menu.SubMenu>
        <Menu.SubMenu title="新手教程" key="2" icon={<ICWithdrawOutlined size={20} />} defaultExpand={false}>
          <Menu.SubMenu title="身份验证" key="2-1" defaultExpand={false}>
            <MenuItem key="2-1-1">
              如何下载KuCoin App & 如何下载KuCoin & 如何下载KuCoin App & 如何下载KuCoin
            </MenuItem>
            <MenuItem key="2-1-2">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
            <MenuItem key="2-1-3">如何下载KuCoin App & 如何下载KuCoin & ...</MenuItem>
          </Menu.SubMenu>
          <MenuItem key="2-2">安全设置</MenuItem>
          <MenuItem key="2-3">KYC实名认证</MenuItem>
          <MenuItem key="2-4">新手常见问题</MenuItem>
          <MenuItem key="2-5">KuCoin Review</MenuItem>
        </Menu.SubMenu>
        <MenuItem key="3" icon={<ICTradeOutlined size={20} />}>
          Trading
        </MenuItem>
        <MenuItem key="4" icon={<ICDepositOutlined size={20} />}>
          Deposit
        </MenuItem>
        <MenuItem key="5" icon={<ICWithdrawOutlined size={20} />}>
          Withdraw Plugins
        </MenuItem>
      </CusMenu>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <Container>
        <Doc />
        <Doc1 />
        <Doc2 />
        <Doc3 />
      </Container>
    </Wrapper>
  );
};
