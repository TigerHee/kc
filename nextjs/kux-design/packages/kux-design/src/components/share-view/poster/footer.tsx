import { isValidElement, useState, useEffect, lazy, Suspense } from 'react';
import { Spacer } from '@/components/spacer';

import { getBrandMiniLogo } from '@/common';

// 使用懒加载方式引入 qrcode.react 组件
const QRCodeCanvas = lazy(() => import('qrcode.react').then(res => ({ default: res.QRCodeCanvas })));

/**
 * 默认 footer 配置
 */
export interface IPosterFooter {
  /**
   * logo 图地址
   * @default kc 主站 logo 地址
   */
  logo?: string;
  /**
   * 主标题
   */
  title?: string | Promise<string> | null;
  /**
   * 副标题
   */
  subtitle?: string;
  /**
   * 二维码链接, 此处无需单独配置, 使用公共配置中的 link 即可
   */
  // link: string;
}

export interface IFooterExtraOptions {
  /**
   * 二维码链接
   */
  link: string;
  /**
   * 邀请码
   */
  rcode?: string | undefined;
}

export interface IPosterFooterProps extends IPosterFooter, IFooterExtraOptions {}

export function PosterFooter(props: IPosterFooterProps) {
  const title = usePosterFooterTitle(props.title || '');
  const subtitle = usePosterFooterSubTitle(props.subtitle);
  const defaultBrandLogo= getBrandMiniLogo();

  return (
    <div className="kux-poster_footer">
      <div className="kux-poster_footer-leading">
        <img
          alt="logo"
          src={props.logo || defaultBrandLogo}
          className="kux-poster_footer-logo"
          crossOrigin="anonymous"
        />
        <Spacer direction="horizontal" length={10} />
        <div className="kux-poster_footer-text">
          <div className="kux-poster_footer-title">{title}</div>
          {subtitle && <div className="kux-poster_footer-subtitle">{subtitle}</div>}
        </div>
      </div>
      <Spacer direction="horizontal" length={4} />
      <div className="kux-poster_footer-trailing">
        <Suspense fallback="Loading...">
          <QRCodeCanvas size={256} value={props.link} id="qrCode-id" level="Q" />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * 渲染 footer, 如果是 ReactNode 直接返回, 否则使用默认配置
 */
export function renderFooter(
  options: false | null | undefined | IPosterFooter | React.ReactNode,
  extra: IFooterExtraOptions,
) {
  if (isValidElement(options)) {
    return options;
  }
  // 传空值, null, false 等( 非 undefined ) 时不渲染 footer
  // * 非 undefined 时, 表示为传值, 使用默认行为
  if (!options && !app.is(options, 'undefined')) return null;
  const props = Object.assign({}, options, extra) as IPosterFooterProps;
  return <PosterFooter {...props} />;
}

const getTitleFunc = async (title: string | Promise<string>) => {
  if (!title) return '';
  return title;
};

function usePosterFooterTitle(defaultTitle: string | Promise<string>) {
  const [title, setTitle] = useState('');
  useEffect(() => {
    const init = async () => {
      const _title = await getTitleFunc(defaultTitle);
      if (_title) setTitle(_title);
    };
    init();
  }, [defaultTitle]);
  // 文案: 立即注册领欢迎礼包
  return title;
}

// 保留 hook 实现, 以后可能会用到
function usePosterFooterSubTitle(defaultTitle: string | undefined) {
  // 默认文案: 邀请码: xxx
  return defaultTitle;
}
