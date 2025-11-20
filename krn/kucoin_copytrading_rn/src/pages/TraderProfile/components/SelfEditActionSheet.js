/**
 * Owner: mike@kupotech.com
 */
import {useMemoizedFn} from 'ahooks';
import React from 'react';

import {RouterNameMap} from 'constants/router-name-map';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import ChooseActionSheet from './ChooseActionSheet';

const makeOptions = ({_t, leaderDetail}) => {
  const {reviewStatus, reviewAvatar, reviewIntroduce, reviewNickName} =
    leaderDetail || {};

  return [
    {
      label: _t('f9088bf1a76a4000a82b'),
      icon: 'NickNameIcon',
      value: 'name',
      routeName: RouterNameMap.NickName,
      status: !!reviewNickName && reviewStatus,
    },
    {
      label: _t('866774222fd64000aa9f'),
      icon: 'AvatarIcon',
      value: 'avatar',
      routeName: RouterNameMap.UpdateAvatar,
      status: !!reviewAvatar && reviewStatus,
    },
    {
      label: _t('61335114436f4000a0e1'),
      icon: 'HeadIcon',
      value: 'profile',
      routeName: RouterNameMap.Profile,
      status: !!reviewIntroduce && reviewStatus,
    },
  ];
};

/** 修改个人交易员信息菜单 */
const SelfTraderProfile = ({
  show,
  toggleSheet,
  status,
  leaderDetail,
  leadStatus,
}) => {
  const {push} = usePush();
  const {_t} = useLang();
  const options = makeOptions({_t, leaderDetail});
  const onSelected = useMemoizedFn(value => {
    const routeName = options.find(el => el.value === value)?.routeName;
    push(RouterNameMap[routeName]);
  });

  return (
    <ChooseActionSheet
      status={status}
      leadStatus={leadStatus}
      title={_t('b4ff83e6dbc64000a1b8')}
      toggleSheet={toggleSheet}
      options={options}
      show={show}
      onSelected={onSelected}
    />
  );
};

export default SelfTraderProfile;
