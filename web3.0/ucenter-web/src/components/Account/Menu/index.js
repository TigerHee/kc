/**
 * Owner: willen@kupotech.com
 */

import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { ICAssetOverviewOutlined } from '@kux/icons';
import { Menu, MenuItem, styled, useResponsive } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import escrowAccountSvg from 'static/svg_icons/escrow_account.svg';
import apiIconSvg from 'static/svg_icons/ic2_api_thin.svg';
import downloadIconSvg from 'static/svg_icons/ic2_download_thin.svg';
import kycIconSvg from 'static/svg_icons/ic2_kyc_thin.svg';
import rewardsIconSvg from 'static/svg_icons/ic2_rewardshub_thin.svg';
import securityIconSvg from 'static/svg_icons/ic2_security_thin.svg';
import subAccountIconSvg from 'static/svg_icons/ic2_subaccount_thin.svg';

const ApiIcon = () => <img src={apiIconSvg} alt="api-icon" />;
const DownloadIcon = () => <img src={downloadIconSvg} alt="download-icon" />;
const SubAccountIcon = () => <img src={subAccountIconSvg} alt="subaccount-icon" />;
const SecurityIcon = () => <img src={securityIconSvg} alt="security-icon" />;
const RewardsIcon = () => <img src={rewardsIconSvg} alt="rewards-icon" />;
const KycIcon = () => <img src={kycIconSvg} alt="kyc-icon" />;
const EscrowAccountIcon = () => <img src={escrowAccountSvg} alt="api-icon" />;

import storage from 'src/utils/storage';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';

const RedDot = styled.span`
  display: block;
  width: 6px;
  height: 6px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 100%;
  position: absolute;
  right: -8px;
  top: 0;
`;

const ExtendMenuItem = styled(MenuItem)`
  user-select: none;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-right: 0 !important;
    & .KuxMenuItem-icon {
      margin-left: 0 !important;
    }
  }
`;
/** 我的奖励入口点击时间key */
const MY_REWARDS_ENTRANCE_TIME = 'my_rewards_entrance_click_mark_time';

/** 设置我的奖励入口点击时间 */
const setMyRewardsEntranceClickMarkTime = () => {
  storage.setItem(MY_REWARDS_ENTRANCE_TIME, new Date().valueOf());
};

const AccountMenu = () => {
  const [selectedKey, setSelectedKey] = useState([]);
  const noticeStatus = useSelector((state) => state.account_security.noticeStatus);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const isSub = user?.isSub;
  // 仅对清退超级账号展示托管资产列表菜单
  const isEscrowAccount = user.type === 12;
  const needNotice = noticeStatus?.needNotice;
  const pathname = location?.pathname;
  const rv = useResponsive();
  const { multiSiteConfig } = useMultiSiteConfig();
  const downLarge = !rv?.lg;
  /** 我的奖励入口点击时间 */
  const myRewardsEntranceClickMarkTime = storage.getItem(MY_REWARDS_ENTRANCE_TIME);
  /** 我的奖励入口 */
  const MY_REWARDS = useMemo(
    () => ({
      title: (
        <span style={{ position: 'relative' }}>
          {_t('eTDTJxStkmMUQt69pX38Mm')}
          {!myRewardsEntranceClickMarkTime ? <RedDot /> : null}
        </span>
      ),
      key: 'webmyRewards',
      path: '/account/vouchers',
      locationId: 'webmyRewards',
      IconComp: RewardsIcon,
    }),
    [myRewardsEntranceClickMarkTime],
  );

  const menus = useMemo(() => {
    const { myConfig } = multiSiteConfig || {};
    const { pageDirectorys } = myConfig?.directoryConfig || {};
    const _menus = [];

    if (pageDirectorys?.includes('overview')) {
      _menus.push({
        title: _t('2X1tkNCiXcckbhpqBKQsNW'),
        key: 'overview',
        path: '/account',
        locationId: 'Overview',
        IconComp: ICAssetOverviewOutlined,
      });
    }

    if (pageDirectorys?.includes('accountsecurity')) {
      _menus.push({
        title: (
          <span style={{ position: 'relative' }}>
            {_t('gDE48m8B9gKNN6hko1pqcK')}
            {needNotice ? <RedDot /> : null}
          </span>
        ),
        key: 'security',
        path: '/account/security',
        locationId: 'Security',
        IconComp: SecurityIcon,
      });
    }

    if (pageDirectorys?.includes('kyc') && !isSub) {
      _menus.push({
        title: _t('7Bc1NgrHBNVwbkfUsRUVPf'),
        key: 'kyc',
        path: '/account/kyc?app_line=KYC&soure=DEFAULT',
        locationId: 'KYC',
        IconComp: KycIcon,
      });
    }

    if (pageDirectorys?.includes('api') && !isSub) {
      _menus.push({
        title: _t('rJChxzrJwiCWR7YYVp1eUq'),
        key: 'api',
        path: '/account/api',
        locationId: 'API',
        IconComp: ApiIcon,
      });
    }

    if (pageDirectorys?.includes('subuser') && !isSub) {
      _menus.push({
        title: _t('4Wfsb6CyuxbuqdpYwYygPz'),
        key: 'sub-account',
        path: '/account/sub',
        locationId: 'SubAccount',
        IconComp: SubAccountIcon,
      });
    }

    if (pageDirectorys?.includes('downloadcenter')) {
      _menus.push({
        title: _t('7qUgjnSzrKa3ijFn2QpxmC'),
        key: 'download',
        path: '/account/download',
        locationId: 'DownloadCenter',
        IconComp: DownloadIcon,
      });
    }

    if (pageDirectorys?.includes('myreward')) {
      _menus.push(MY_REWARDS);
    }

    // 仅对清退超级账号展示[托管资产列表菜单]
    if (isEscrowAccount) {
      _menus.push({
        title: _t('f72ec28a21274000ab44'),
        key: 'escrow-account',
        path: '/account/escrow-account',
        locationId: 'EscrowAccount',
        IconComp: EscrowAccountIcon,
      });
    }

    return _menus;
  }, [isSub, needNotice, isEscrowAccount, MY_REWARDS, multiSiteConfig]);

  useEffect(() => {
    let p = pathname;
    const apiPath = '/account/api';
    if (pathname.includes(apiPath)) {
      p = apiPath;
    }

    const selectItem = menus.find((i) => i.path.startsWith(p));
    selectItem && setSelectedKey([selectItem.key]);
    // if (pathname.includes('/account/vouchers')) {
    //   setMyRewardsEntranceClickMarkTime();
    // }
  }, [pathname, menus]);

  const handleClickItem = (path, locationId, key) => {
    trackClick(['Menu', locationId]);
    if (key === 'webmyRewards') {
      setMyRewardsEntranceClickMarkTime();
    }
    push(path);
  };

  return (
    <Menu selectedKeys={selectedKey} size={downLarge ? 'mini' : 'basic'}>
      {menus.map(({ IconComp, title, key, path, locationId }) => (
        <ExtendMenuItem
          icon={IconComp ? <IconComp /> : null}
          key={key}
          onClick={() => handleClickItem(path, locationId, key)}
        >
          {title}
        </ExtendMenuItem>
      ))}
    </Menu>
  );
};

export default AccountMenu;
