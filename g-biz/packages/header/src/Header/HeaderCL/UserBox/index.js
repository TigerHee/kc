/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import loadable from '@loadable/component';
import { kcsensorsClick } from '../../../common/tools';
import LoaderComponent from '../../../components/LoaderComponent';
import { long_language } from '../../config';
import { namespace } from '../../model';
import { Divider, Dropdown, OverlayWrapper, Root, UserFlag } from '../../UserBox/styled';

const Overlay = loadable(() => import('./Overlay'));

// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
const getUserFlag = (user, isSub = false) => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (
        nicknameStr[1] &&
        nicknameStr[0].charCodeAt() <= 255 &&
        nicknameStr[1].charCodeAt() <= 255
      ) {
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

export default (props) => {
  const { currentLang, userInfo, isSub = false, inDrawer, onClose } = props;
  const [dropState, setState] = useState(false);

  const isLong_language = long_language.indexOf(currentLang) > -1;

  const dispatch = useDispatch();

  const handleLogout = (e) => {
    kcsensorsClick(['person', !(currentLang.indexOf('zh_') === 0) && !isSub ? '9' : '8']);
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    const to = '';
    dispatch({ type: `${namespace}/logout`, payload: { to, spm: ['person', '9'] } });
  };

  const onVisibleChange = useCallback((v) => {
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
    <Root>
      <Dropdown
        visible={dropState}
        trigger="hover"
        overlay={
          <LoaderComponent show={dropState}>
            <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
          </LoaderComponent>
        }
        placement="bottom"
        anchorProps={{ style: { display: 'block' } }}
        inDrawer={inDrawer}
        keepMounted
        onVisibleChange={onVisibleChange}
      >
        <UserFlag>{getUserFlag(userInfo, isSub)}</UserFlag>
      </Dropdown>
      <Divider />
    </Root>
  );
};
