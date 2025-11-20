/**
 * Owner: melono@kupotech.com
 */
/**
 * 业务组件，动态海报分享
 */
import React, { useState, forwardRef, useMemo, useEffect } from 'react';
import NewShare from 'components/$/MarketCommon/NewShare';
import { getLinkByScene } from 'components/$/MarketCommon/config';
import { useSelector, useDispatch } from 'dva';
import { SHARE_APP_HOST } from 'config';
import { useLogin } from 'src/hooks';
import { addLangToPath, _t, _tHTML } from 'utils/lang';
import { searchToJson } from 'helper';
import { fixLabel } from './config';
import qs from 'qs';

// 固定使用.com域名
const _KUCOIN_HOST = SHARE_APP_HOST;

const PosterShare = (props, ref) => {
  const [shareLoading, setShareLoading] = useState(false); // 分享按钮loading
  const dispatch = useDispatch();
  const { inviteCode, config, newShareImg, newSharePictures } = useSelector(
    (state) => state.legoActivityPage,
  );
  const { isInApp, currentLang, appInfo } = useSelector((state) => state.app);

  const { channelCode, subject } = config || {};
  const { isLogin } = useLogin();
  // 获取邀请码
  useEffect(() => {
    if (!isLogin) return;
    dispatch({ type: 'legoActivityPage/getInviteCode' });
  }, [isLogin]);

  const searchParams = searchToJson();
  const queryValue = {
    rcode: searchParams.rcode,
    utm_source: searchParams.utm_source,
  };
  const queryParams = qs.stringify(queryValue);
  const query = queryParams ? `?${queryParams}` : '';
  // 分享链接
  const shareLink = useMemo(
    () =>
      getLinkByScene({
        rcode: isLogin ? inviteCode : undefined,
        utm_source: channelCode,
        scene: 'share',
        needConvertedUrl: addLangToPath(`${_KUCOIN_HOST}/land/activity/${subject}${query}`),
      }),
    [inviteCode, channelCode, subject, query, isLogin],
  );

  const shareTexts = useMemo(() => {
    let {
      positionY_top = 598 + 10,
      positionY_bottom = 608 + 32,
      firstWidth = 230,
      titleX = 60,
    } = fixLabel ? fixLabel({ currentLang }) || {} : {};
    return [
      {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 5,
        wordSpace: 2,
        text: _t('3YsmEk8KUmWNHdvczMcFND'),
        x: titleX,
        y: positionY_top,
        firstWidth,
        maxWidth: firstWidth,
        needCompute: true,
        newLine: true,
        independent: true,
      },
      {
        color: '#b8c6d8',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 5,
        wordSpace: 2,
        text: _t('gZqLEqKyq84cU822LDVBGm'),
        x: titleX,
        y: positionY_bottom,
        firstWidth,
        maxWidth: firstWidth,
        needCompute: true,
        newLine: true,
        independent: true,
      },
    ];
  }, [currentLang]);

  return (
    <React.Fragment>
      <NewShare
        ref={ref}
        shareLink={shareLink}
        needQrCode
        shareImg={newShareImg}
        shareTexts={shareTexts}
        imgs={newSharePictures}
        setShareLoading={(val) => setShareLoading(val)}
        needInit
        customFooterElement
      />
    </React.Fragment>
  );
};

export default forwardRef(PosterShare);
