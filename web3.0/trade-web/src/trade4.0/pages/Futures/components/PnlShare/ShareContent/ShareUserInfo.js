/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo, useState, useEffect } from 'react';

import { useSelector } from 'dva';
import { greaterThanOrEqualTo } from 'utils/operation';

import { useGetControlDisplay } from '../hook';
import { getUserFlag } from '../utils';

const DynamicImage = ({ level }) => {
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    let imageName = 'v-1.png';
    if (level) {
      imageName = greaterThanOrEqualTo(level)(12) ? 'v-12.png' : `v-${level}.png`;
    }
    import(`@/assets/share/pnlShare/${imageName}`)
      .then((image) => {
        setImagePath(image.default);
      })

      .catch((err) => {
        console.error('Error loading image:', err);
      });
  }, [level]);

  if (!imagePath) {
    return <div>{level}</div>;
  }

  return <img src={imagePath} alt="vip-icon" />;
};

const ShareUserInfo = () => {
  const vipInfo = useSelector((state) => state.futuresCommon.vipInfo);
  const userInfo = useSelector((state) => state.user.user);
  const { shareDisplayName } = useGetControlDisplay();

  const userName = useMemo(() => {
    const { nickname = '', email = '', phone = '', subAccount = '' } = userInfo || {};
    return nickname || subAccount || email || phone || 'Player';
  }, [userInfo]);

  if (!shareDisplayName) return null;

  return (
    <div className="user-info">
      <div className="avatar">{getUserFlag(userInfo, userInfo?.isSub)}</div>
      <div className="vip-info">
        <div className="name">{userName}</div>
        <div className="vip">
        <DynamicImage level={vipInfo?.userLevel} />
          <span className="text">{`VIP Lv.${vipInfo?.userLevel || 0}`}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShareUserInfo);
