/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useState, FC } from 'react';
import { Divider } from '@kux/design';
import clsx from 'clsx';
import loadable from '@loadable/component';
import { kcsensorsClick } from '../../../common/tools';
import LoaderComponent from '../../../components/LoaderComponent';
import { long_language } from '../../config';
import AnimateDropdown from '../../AnimateDropdown';
import { useHeaderStore } from '../../model';
import userBoxStyles from '../../UserBox/styles.module.scss';

const Overlay = loadable(() => import('./Overlay'));

// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
const getUserFlag = (user, isSub = false) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (nicknameStr[1] && nicknameStr[0].charCodeAt(0) <= 255 && nicknameStr[1].charCodeAt(0) <= 255) {
        userFlag += nicknameStr[1];
      }
    } else if (isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};

interface UserBoxProps {
  currentLang: string;
  userInfo: any;
  isSub?: boolean;
  inDrawer?: boolean;
  onClose?: () => void;
  [key: string]: any;
}

const UserBox: FC<UserBoxProps> = props => {
  const { currentLang, userInfo, isSub = false, inDrawer, onClose } = props;
  const [dropState, setState] = useState(false);
  const logout = useHeaderStore(state => state.logout);

  const isLong_language = long_language.indexOf(currentLang) > -1;

  const handleLogout = e => {
    kcsensorsClick(['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8']);
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    logout?.({ to, spm: ['person', '9'] });
  };

  const onVisibleChange = useCallback(v => {
    setState(v);
  }, []);

  const overlayProps = {
    inDrawer,
    isLong_language,
    currentLang,
    onClose,
    isSub,
    handleLogout,
  };

  return (
    <div className={userBoxStyles.root}>
      <AnimateDropdown
        className={userBoxStyles.dropdown}
        visible={dropState}
        trigger="hover"
        overlay={
          <LoaderComponent show={dropState}>
            <Overlay
              {...overlayProps}
              fallback={
                <div
                  className={clsx(userBoxStyles.overlayWrapper, {
                    [userBoxStyles.overlayWrapperInDrawer]: inDrawer,
                    [userBoxStyles.overlayWrapperLongLanguage]: !inDrawer && isLong_language,
                  })}
                />
              }
            />
          </LoaderComponent>
        }
        placement="bottom"
        anchorProps={{ style: { display: 'block' } }}
        inDrawer={inDrawer}
        keepMounted
        onVisibleChange={onVisibleChange}
      >
        <div className={clsx(userBoxStyles.userFlag)}>{getUserFlag(userInfo, isSub)}</div>
      </AnimateDropdown>
      <Divider className={userBoxStyles.divider} />
    </div>
  );
};

export default UserBox;
