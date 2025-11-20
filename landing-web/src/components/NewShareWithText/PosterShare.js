/**
 * Owner: melono@kupotech.com
 */
/**
 * 业务组件，基于NewShare分享组件的支持多语言文案的分享海报分享组件
 * 实现的思路逻辑参考了Tom弟弟年度账单的实现 感谢Tom弟弟🙏🙏🙏
 * 传入分享组件的图片由两部分组成
 * 1.shareImg 正常的分享图片 - 置于底部
 * 2.imgs 需要写在分享图上的多语言文案 - 使用dom2base64 将文案和样式生成一张背景透明的图片，覆盖在置于底部的分享图片上面
 * 最后在分享组件里面生成的图片就会由底部分享图片+固定在上层多语言文案合二为一
 * 这样就可以生成海报上带有多语言的自定义Dom文案
 * 不用每次都让UX同学做全语种的分享图
 * 需要注意的是
 * 1.使用dom2base64 只会复制utils文件里面的 CSS_RULES 里面的样式, 如果diyContent的样式没有生效，请检查一下样式属性名称是否在CSS_RULES里面
 * 2.目前diyContent 只支持 Roboto字体(字重600 字重400)，如果要加入新的字体，需要在fonts文件引入字体的base64格式文件，然后在utils里面的dom2base64方法中添加字体样式；
 * 否则会出现最后生成图片的字体样式不对
 */

import React, { useState, forwardRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import NewShare from 'components/$/MarketCommon/NewShare';
import { getLinkByScene } from 'components/$/MarketCommon/config';
import { useSelector, useDispatch } from 'dva';
import { useLogin } from 'src/hooks';
import { addLangToPath, _t, _tHTML } from 'utils/lang';
import { fixLabel } from './config';
import { styled } from '@kufox/mui/emotion';

const GbizShareModuleLoadable = loadable.lib(() => System.import('@remote/share'));

export const Wrapper = styled.div`
  font-family: 'Roboto';
  position: absolute;
  visibility: hidden;
  z-index: -1;
  width: 375px; // 写定 375px 不然会出现生成base64图片时分享文案错位的问题！！！
  height: 585px; // 写定 585px 不然会出现生成base64图片时分享文案错位的问题！！！
  top: 0;
  left: 0; // 这是为了让dom不被看到
`;
export const ShareTextWrapper = styled.div`
  font-family: 'Roboto';
  width: 375px;
  height: 585px;
`;

export const DiyWrapper = styled.div`
  font-family: 'Roboto';
  max-width: 375px;
  width: 100%;
  max-height: 100%;
  word-break: break-word;
`;

/**
 * 分享图的 dom2base64 分享文案的 Dom 结构，用于生成分享图的宣传文案
 */
export const ShareText = ({ diyContent, id = 'KuShare_diy_text_wrapper' }) => {
  return (
    <Wrapper>
      <ShareTextWrapper id={id} className="KuShare_shareTextWrapper">
        <DiyWrapper className="KuShare_diyWrapper">{diyContent}</DiyWrapper>
      </ShareTextWrapper>
    </Wrapper>
  );
};

ShareText.propTypes = {
  diyContent: PropTypes.any, // 自定义文案内容
  id: PropTypes.string, // 自定义分享文案Dom结构的class id
};

ShareText.defaultProps = {
  diyContent: '',
  id: 'KuShare_diy_text_wrapper',
};

const _PosterShare = (
  {
    shareTexts,
    utm_source,
    shareImg,
    shareUrl,
    needInit,
    shareDiyTextClassId,
    children,
    onVisibleChange,
    needQrCode,
    GbizShareModule,
    ...otherProps
  },
  ref,
) => {
  const [shareLoading, setShareLoading] = useState(false); // 分享按钮loading
  const dispatch = useDispatch();
  const { currentLang } = useSelector((state) => state.app);
  const { inviteCode, newSharePictures } = useSelector((state) => state.kcCommon);
  const { isLogin } = useLogin();

  // v3 统一逻辑
  const shareV3 = GbizShareModule?.useShareV3?.();

  // 获取邀请码
  useEffect(() => {
    if (!isLogin) return;
    dispatch({
      type: 'kcCommon/getInviteCode', // 获取邀请码
      payload: {},
    });
  }, [isLogin, dispatch]);
  // 分享链接
  const shareLink = useMemo(() => {
    const originShareLink = getLinkByScene({
      rcode: isLogin ? inviteCode : undefined,
      utm_source,
      scene: 'share',
      needConvertedUrl: addLangToPath(`${shareUrl}`),
    });
    if (shareV3?.updateToShareV3UniversalRcode) {
      const v3UniversalLink = shareV3?.updateToShareV3UniversalRcode?.(originShareLink);
      return v3UniversalLink;
    }
    return originShareLink;
  }, [inviteCode, isLogin, shareUrl, utm_source, shareV3]);

  // 默认的底部分享文案
  const defaultShareTexts = useMemo(() => {
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
        text: _t('h9R4kRwywdGpFRVeBWBizW'),
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
        text: _t('aCXvZk9FbrkS9BWvfsDAuB'),
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

  if (!shareV3?.isReady) {
    return null;
  }

  return (
    <React.Fragment>
      <NewShare
        ref={ref}
        shareLink={shareLink}
        shareImg={shareImg}
        shareTexts={shareTexts || defaultShareTexts}
        imgs={newSharePictures}
        setShareLoading={(val) => setShareLoading(val)}
        needInit={needInit}
        onVisibleChange={onVisibleChange}
        needQrCode={needQrCode}
        {...otherProps}
      />
      <ShareText id={shareDiyTextClassId} diyContent={children} />
    </React.Fragment>
  );
};

_PosterShare.propTypes = {
  ref: PropTypes.any,
  shareTexts: PropTypes.array, // 底部的文案 一般是 扫描二维码相关的
  utm_source: PropTypes.string, // 运营来源
  shareImg: PropTypes.string, // 分享底图
  shareUrl: PropTypes.string, // 分享链接
  needInit: PropTypes.bool, // 是否需要重新渲染
  children: PropTypes.any, // 自定义渲染内容
  shareDiyTextClassId: PropTypes.string, // 自定义分享文案Dom结构的class id
  needQrCode: PropTypes.bool, // 是否显示底部带二维码的footer 默认false
};

_PosterShare.defaultProps = {
  ref: {},
  children: '',
  needInit: false,
  shareDiyTextClassId: 'KuShare_diy_text_wrapper',
  needQrCode: false, // 是否显示底部带二维码的footer 默认false 如果使用App的footer的话
};

const PosterShare = forwardRef(_PosterShare);

const PosterShareLoadable = forwardRef((props, ref) => {
  const { children, ...rest } = props || {};
  return (
    <GbizShareModuleLoadable>
      {(module) => {
        return (
          <PosterShare
            {...rest}
            ref={ref}
            GbizShareModule={module}
          >
            {children}
          </PosterShare>
        )
      }}
    </GbizShareModuleLoadable>
  )
});

export default PosterShareLoadable;
