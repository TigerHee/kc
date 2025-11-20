/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/styled';
import { ICArrowRightOutlined, ICSecuritySettingOutlined } from '@kux/icons';
import { Tabs, Tooltip, useResponsive, useTheme } from '@kux/mui';
import { fade } from '@kux/mui/utils/colorManipulator';
import DeviceTable from 'components/Account/SecurityForm/TableComponets/device';
import SecurityLogTable from 'components/Account/SecurityForm/TableComponets/securityLog';
import Table from 'components/Account/SecurityForm/TableComponets/Table';
import SecurityCard from 'components/SecurityCard';
import SecurityModal from 'components/SecurityModal';
import { searchToJson } from 'helper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LEVEL_ENUMS } from 'src/constants/security/score';
import useSecurityGuard from 'src/hooks/security/useSecurityGuard';
import { push } from 'src/utils/router';
import { _t } from 'tools/i18n';

const { Tab } = Tabs;

const PageTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${({ vertical }) => (vertical ? 'column' : 'row')};
  justify-content: space-between;
  align-items: ${({ vertical }) => (vertical ? 'flex-start' : 'center')};
  gap: ${({ vertical }) => (vertical ? '12px' : '0')};
  color: ${({ theme }) => theme.colors.text};
  padding: 24px 64px;
  font-weight: 600;
  font-size: 24px;
  background: ${({ theme }) => theme.colors.overlay};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 24px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 10px 16px;
    font-size: 18px;
  }
`;

const SafeLevel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 40px;
  border-radius: 39px;
  font-weight: 600;
  font-size: 14px;
  background: ${({ theme, status }) =>
    status === 'high'
      ? theme.colors.primary8
      : status === 'medium'
      ? theme.colors.complementary8
      : theme.colors.secondary8};
  color: ${({ theme, status }) =>
    status === 'high'
      ? theme.colors.primary
      : status === 'medium'
      ? theme.colors.complementary
      : theme.colors.secondary};
  span {
    margin-left: 6px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 6px 16px;
    font-size: 12px;
  }
`;
const SafeLevelTip = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.icon};
  & .title {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
    color: ${({ theme, status }) =>
      status === 'high'
        ? theme.colors.primary
        : status === 'medium'
        ? theme.colors.complementary
        : theme.colors.secondary};
    font-weight: 500;
    font-size: 14px;
    span {
      margin-left: 6px;
    }
  }
`;
const TableWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 64px 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 16px 40px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px 20px;
  }
`;
const TableContent = styled.div`
  width: 100%;
  margin-bottom: 48px;
`;

const ExtendTabs = styled(Tabs)`
  height: 32px;
  margin-bottom: 12px;
  .KuxTabs-indicator {
    display: none;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0px 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 0px;
    padding: 0;
  }
`;
const ExtendTab = styled(Tab)`
  font-weight: 500;
  font-size: 20px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const levelMap = {
  1: { key: 'low', label: _t('eWksQrL68zMb9vQAKMNMHe') },
  2: { key: 'medium', label: _t('wxWMUAQkwANXysEK576HdS') },
  3: { key: 'high', label: _t('ffucvnB3fCkYJnRstKsT1w') },
};

const SecurityGuardBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ isH5 }) => (isH5 ? '12px' : '16px')};
  border-radius: 8px;
  cursor: pointer;
  & > div:first-child {
    gap: 4px;
    gap: 4px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    & > span {
      gap: 6px;
    }
    &,
    & > span {
      display: flex;
      align-items: center;
    }
  }
  & > div:nth-child(2) {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%; /* 19.6px */
  }
`;

const Title = ({ status, level }) => {
  const securityGuard = useSecurityGuard();
  const theme = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const securityInfo = securityGuard.enable ? (
    (() => {
      const noResult = !securityGuard.loaded || securityGuard.level;
      const isHigherThanLow = securityGuard.level && securityGuard.level !== LEVEL_ENUMS.LOW;
      const bgColor = isHigherThanLow ? fade(securityGuard.themeColor, 0.08) : theme.colors.cover4;
      const textColor = isHigherThanLow ? securityGuard.themeColor : theme.colors.text;
      const iconColor = isHigherThanLow ? securityGuard.themeColor : theme.colors.icon;
      return (
        <SecurityGuardBox
          isH5={isH5}
          style={{ background: bgColor }}
          onClick={() => push('/account/security/score')}
        >
          <div>
            {noResult ? (
              <span style={{ color: textColor }}>{securityGuard.textNode}</span>
            ) : (
              <span>{_t('securityGuard')}</span>
            )}
            <ICArrowRightOutlined color={iconColor} />
          </div>
          <div>
            {noResult ? (
              <span>{_t('securityGuard.lastStatus.desc')}</span>
            ) : (
              <span>{_t('securityGuard.lastStatus.empty.desc')}</span>
            )}
          </div>
        </SecurityGuardBox>
      );
    })()
  ) : (
    <Tooltip
      placement="bottom"
      trigger="hover"
      title={
        <SafeLevelTip status={status}>
          <div className="title">
            <ICSecuritySettingOutlined size="20" />
            <span>{level}</span>
          </div>
          {status === 'high' ? (
            <span>{_t('pkkjjhLfGru3vKYys59X4B')}</span>
          ) : (
            <span>{_t('security.top.tip')}</span>
          )}
        </SafeLevelTip>
      }
      width={312}
    >
      <SafeLevel status={status}>
        <ICSecuritySettingOutlined size="20" />
        <span>{level}</span>
      </SafeLevel>
    </Tooltip>
  );

  return (
    <PageTitle vertical={isH5 && securityGuard.enable}>
      <span>{_t('security.setting')}</span>
      {securityInfo}
    </PageTitle>
  );
};

const SecurityGuardFooter = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 13px;
  font-weight: 400;
  line-height: 140%; /* 18.2px */
  padding: 0 32px 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px 0;
  }
`;

const SecurityPage = (props) => {
  const { multiSiteConfig } = props;
  const baseInfo = useSelector((state) => state.accountOverview.baseInfo);
  const isGettingLogs = useSelector((state) => state.loading.effects['homepage/getLoginLogs']);
  const { pagination, deviceTable, SecurityLogs, LoginLogs } = useSelector(
    (state) => state.homepage,
  );
  const [activeTab, setActiveTab] = useState('securityLogs');

  const securityLevel = levelMap[baseInfo?.userOverviewResponse?.securityLevel]?.label || '--';
  const securityLevelStatus = levelMap[baseInfo?.userOverviewResponse?.securityLevel]?.key;

  const dispatch = useDispatch();

  // 登录信息分页
  const pageChange = (page, pageSize) => {
    dispatch({
      type: 'homepage/getLoginLogs',
      payload: {
        current: page,
        pageSize,
      },
    });
  };

  // 安全记录分页
  const spageChange = (page, pageSize) => {
    dispatch({
      type: 'homepage/getSecurityLog',
      payload: {
        pagination: {
          current: page,
          pageSize,
        },
      },
    });
  };

  // 设备分页
  const dpageChange = (page, pageSize) => {
    dispatch({
      type: 'homepage/getDeviceList',
      payload: {
        current: page,
        pageSize,
      },
    });
  };

  useEffect(() => {
    if (searchToJson()?.showLoginRecord) {
      document.querySelector('#loginRecord')?.scrollIntoView({ block: 'center' });
      setActiveTab('loginLogs');
    }

    dispatch({
      type: 'accountOverview/getUserOverviewInfo',
    });
    dispatch({
      type: 'homepage/securityDataInit',
    });
  }, [dispatch]);

  useEffect(() => {
    if (multiSiteConfig && multiSiteConfig?.securityConfig?.antiPhishingCodeOpt) {
      dispatch({
        type: 'account_security/getSafeWords',
      });
    }
    if (multiSiteConfig && multiSiteConfig?.securityConfig?.extAccountBindOpt) {
      dispatch({
        type: 'account_security/getExternalBindings',
      });
    }
  }, [dispatch, multiSiteConfig]);

  return (
    <div data-inspector="account_security_page">
      <Title status={securityLevelStatus} level={securityLevel} />
      <React.Fragment>
        <SecurityCard multiSiteConfig={multiSiteConfig} />
        <TableWrapper>
          <TableContent id="loginRecord">
            <ExtendTabs variant="line" value={activeTab} onChange={(e, val) => setActiveTab(val)}>
              <ExtendTab value="securityLogs" label={_t('sec.logs')} />
              <ExtendTab value="loginLogs" label={_t('recent.login')} />
            </ExtendTabs>
            {activeTab === 'loginLogs' ? (
              <Table
                loading={isGettingLogs}
                pagination={LoginLogs.pagination}
                dataSource={LoginLogs.records}
                onChange={pageChange}
              />
            ) : (
              <SecurityLogTable
                loading={false}
                pagination={SecurityLogs.pagination}
                dataSource={SecurityLogs.records}
                onChange={spageChange}
              />
            )}
          </TableContent>
          <TableContent>
            <DeviceTable
              dispatch={dispatch}
              loading={isGettingLogs}
              pagination={pagination}
              dataSource={deviceTable}
              onChange={dpageChange}
            />
          </TableContent>
        </TableWrapper>
      </React.Fragment>
      {window._SITE_CONFIG_.functions.security_guard ? (
        <SecurityGuardFooter>{_t('securityGuard.footer')}</SecurityGuardFooter>
      ) : null}
      <SecurityModal />
    </div>
  );
};

export default SecurityPage;
