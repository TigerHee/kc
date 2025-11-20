/*
 * @Date: 2024-06-05 01:58:33
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 00:43:24
 */
/*
 * Owner: harry.lai@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { ContentImgMap, SceneContentConfigMap } from '../constant';
import {
  AvatarArea,
  BottomBgIcon,
  Logo,
  StyledAvatar,
  TopLeftEdgeIcon,
  TopRightEdgeIcon,
  UserInfo,
  UserName,
  Wrap,
} from './styled';
import { useAutoFitContentRefVisualRate } from './useAutoFitContentRefVisualRate';

const Content = (props) => {
  const { scene, data, className } = props;
  const domRef = useAutoFitContentRefVisualRate();
  const { isLogin, userInfo } = useSelector((state) => ({
    isLogin: state.user.isLogin,
    userInfo: state.user.user,
  }));

  const { ContentComp, hiddenEdgeIcon = false } = SceneContentConfigMap[scene] || {};
  const showName = useMemo(() => {
    const str = userInfo?.nickname || userInfo?.email || '';
    return str.length > 12 ? str.slice(0, 11) + '...' : str;
  }, [userInfo]);

  return (
    <Wrap ref={domRef} className={className}>
      <AvatarArea>
        {isLogin && (
          <UserInfo>
            <StyledAvatar />
            <UserName>{showName} </UserName>
          </UserInfo>
        )}
        <Logo alt="share-logo" src={ContentImgMap.logoIcon} />
      </AvatarArea>
      {ContentComp ? <ContentComp data={data} /> : null}

      {!hiddenEdgeIcon && (
        <>
          <TopRightEdgeIcon
            className="horizontal-flip-in-arabic"
            alt="icon"
            src={ContentImgMap.TopRightEdgeIcon}
          />
          <TopLeftEdgeIcon
            className="horizontal-flip-in-arabic"
            alt="icon"
            src={ContentImgMap.TopLeftEdgeIcon}
          />
        </>
      )}
      <BottomBgIcon src={ContentImgMap.BottomBgIcon} className="horizontal-flip-in-arabic" />
    </Wrap>
  );
};

export default Content;
