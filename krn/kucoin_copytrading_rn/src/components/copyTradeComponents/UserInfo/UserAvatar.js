import {useMemoizedFn, useToggle} from 'ahooks';
import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {getPathname} from 'utils/helper';
import {getUserFlag} from 'utils/user';
import {AvatarImg, AvatarTextBox, AvatarTextBoxInnerText} from './styles';
const MemoAvatarImg = memo(({url, style, markImgLoadFail}) => {
  const [showUrl, setShowUrl] = useState(url);
  const loadedImageMap = useRef({});

  const optimizeSameImage = useCallback(async () => {
    const baseUrl = getPathname(url);

    if (!baseUrl) {
      setShowUrl('');
      return;
    }
    if (loadedImageMap.current?.[baseUrl]) {
      return;
    }

    setShowUrl(url);
  }, [url]);

  const handleOnLoad = useMemoizedFn(() => {
    const baseUrl = getPathname(showUrl);
    loadedImageMap.current = {
      ...(loadedImageMap.current || {}),
      [baseUrl]: true,
    };
  });

  useLayoutEffect(() => {
    optimizeSameImage();
  }, [optimizeSameImage]);

  return (
    <AvatarImg
      onError={markImgLoadFail}
      onLoad={handleOnLoad}
      style={style}
      source={{
        uri: showUrl,
      }}
    />
  );
});

const UserAvatar = ({userInfo, styles}) => {
  const {avatarUrl} = userInfo || {};
  const [isImgLoadFail, {toggle: markImgLoadFail}] = useToggle(false);

  return useMemo(() => {
    const {avatar = {}, avatarText = {}, avatarTextBox = {}} = styles || {};
    const showAvatarText = getUserFlag(userInfo);

    if (avatarUrl && typeof avatarUrl === 'string' && !isImgLoadFail) {
      return (
        <MemoAvatarImg
          markImgLoadFail={markImgLoadFail}
          style={avatar}
          url={avatarUrl}
        />
      );
    }

    return (
      <AvatarTextBox style={avatarTextBox}>
        <AvatarTextBoxInnerText style={avatarText}>
          {showAvatarText}
        </AvatarTextBoxInnerText>
      </AvatarTextBox>
    );
  }, [avatarUrl, isImgLoadFail, markImgLoadFail, styles, userInfo]);
};

export default memo(UserAvatar);
