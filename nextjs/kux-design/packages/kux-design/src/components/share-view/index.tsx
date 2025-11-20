/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description ShareView component
 */
import ReactDom from 'react-dom';
import { copyToClipboard } from '@/common/copy-to-clipboard';
import { useEffect, useState, useRef } from 'react';
import { CloseIcon } from '@kux/iconpack';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SocialButtons, type ISocialButtonsProps } from './social-buttons';
import { clx } from '@/common/style';
import { toast } from '@/components/toast';
import { Loading } from '@/components/loading';
import { Poster, convertNode2image, savePoster, type IPosterProps } from './poster';
import { getDocumentDir } from '@/common';
import { ActionButtons } from './action-buttons';
import { useLockScroll, useZIndex } from '@/hooks';
import { Carousel } from '../carousel';

import closeThin from './assets/close-thin.svg?url';

export * from './poster';

import './style.scss';

export interface IAdsProps {
  /** 广告图片URL */
  imageUrl: string;
  /** 广告跳转链接 */
  url: string;
  /** 广告标题 */
  title: string;
  /** 广告ID */
  id: string | number;
}
export interface IShareViewProps {
  /**
   * 分享海报的id, 用于缓存
   * 若内容变化, 则需要更新此id
   */
  cacheId: string;
  /**
   * 分享对话框标题
   */
  dlgTitle?: string;
  /**
   * 分享链接的标题
   */
  title?: string;
  /**
   * 分享链接
   */
  link: string;
  /**
   * 海报配置
   */
  poster: Pick<
    IPosterProps,
    'size' | 'background' | 'children' | 'footer' | 'name' | 'className' | 'style' | 'rcode'
  >;
  /**
   * 分享按钮配置
   */
  buttons?: ISocialButtonsProps['buttons'];
  /**
   * 是否打开分享视图
   */
  isOpen: boolean;
  /**
   * 关闭分享视图
   */
  onClose?: undefined | (() => void);
  /**
   * 用户分享后的回调, 近作为统计之用
   * * 若用户点击多次, 则会多次触发
   * @param type 分享类型, 'copy', 'save', 'telegram', 'facebook', 'twitter', 'linkedin', 'vk', 'line'
   * @returns 
   */
  onShared?: (type: string) => void;
  /**
   * 海报生成失败文案提示
   */
  errorText: string;
  /**
   * 海报链接复制按钮文案
   */
  copyBtnText: string;
  /**
   * 海报保存按钮文案
   */
  saveBtnText: string;
  /**
   * 海报链接复制成功文案提示
   */
  copySuccessText: string;
  /** 广告位数据数组 */
  ads?: IAdsProps[];
  /** 广告位点击回调 */
  onAdClick?: undefined | ((item: IAdsProps) => void);
  /** 多海报分享类型 - 给app用的,app用来获取海报管理； 但是可以添加 admin用的查询接口是 https://workbench-10.sit.kucoin.net/_api/market-operation/admin/postersShowLocals
   * 类型有以下
   * CUSTOMER_INVITE 邀请海报
   * SHARE_APP 分享APP
   * NOVICE_SHARE 新人专区分享
   * AFFILIATE_APP TOB合伙人APP
   * PREMARKET_SHARE 盘前交易分享
   * SPOTLIGHT_SHARE Spotlight分享
   */
  galleryType?:
    | 'CUSTOMER_INVITE'
    | 'SHARE_APP'
    | 'NOVICE_SHARE'
    | 'AFFILIATE_APP'
    | 'PREMARKET_SHARE'
    | 'SPOTLIGHT_SHARE'
    | string;
}

/** 默认点击 */
function defaultAdClick(val: IAdsProps) {
  /** 点击广告位回调 */
  app.openLink({
    webLink: val.url,
    appLink: val.url,
    tmaLink: val.url,
    open: 'new',
  });
}

/**
 * ShareView component
 */
export function ShareView(props: IShareViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const posterContainerRef = useRef<HTMLDivElement>(null);
  const posterWrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const zIndex = useZIndex(isVisible);
  useEffect(() => {
    if (props.isOpen) {
      setIsVisible(true);
      let rafId: number;
      // 窗口变化缩放海报
      const onResize = () => {
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          if (!posterWrapperRef.current || !posterContainerRef.current) return;
          const { width, height } = posterContainerRef.current.getBoundingClientRect();
          const { width: posterWidth, height: posterHeight } = props.poster.size;
          let scale = 1;
          if (width < posterWidth || height < posterHeight) {
            // leave some space for the poster
            const spacing = 20;
            scale = Math.min((width - spacing) / posterWidth, (height - spacing) / posterHeight);
          }
          posterWrapperRef.current.style.transform = `scale(${scale})`;
        });
      };
      if (app.global.ResizeObserver) {
        const observer = new app.global.ResizeObserver(onResize);
        setTimeout(() => {
          observer.observe(posterContainerRef.current!);
        }, 0);
        return () => {
          observer.disconnect();
          cancelAnimationFrame(rafId);
        };
      }
      window.addEventListener('resize', onResize);
      setTimeout(() => {
        onResize();
      }, 0);
      return () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(rafId);
      }
    }
    const timer = setTimeout(() => setIsVisible(false), 300);
    return () => clearTimeout(timer);
  }, [props.isOpen, props.poster.size]);

  const onSave = () => {
    if (!posterRef.current) return;
    return savePoster(posterRef.current, {
      cacheId: props.cacheId,
      size: props.poster.size,
      filename: props.poster.name,
    })
    .then(() => {
      // 触发用户分享回调
      props.onShared?.('save');
    })
    .catch((err) => {
      console.error('save poster failed', err);
    })
  }

  const onCopy = () => {
    copyToClipboard(props.link);
    // 触发用户分享回调
    props.onShared?.('copy');
    // 复制成功，快去分享给好友吧!
    toast.success(props.copySuccessText);
  };
  // 默认文案: 分享给您的好友
  const dlgTitle = props.dlgTitle || '--';

  if (!isVisible) return null;

  const classPrefix = 'kux-share-view';
  return (
    <div className={clx(`${classPrefix}`, { 'is-mobile': isMobile })} style={{ zIndex }}>
      <div className={clx(`${classPrefix}_mask`, { open: props.isOpen })} onClick={props.onClose} />
      <div className={clx(`${classPrefix}_modal`, { open: props.isOpen })}>
        {!isMobile && (
          <ShareViewHeader
            title={dlgTitle}
            onClose={props.onClose}
            onAdClick={props.onAdClick || defaultAdClick}
          />
        )}
        <div className={`${classPrefix}_content`} ref={posterContainerRef}>
          <div
            data-html2canvas-usechild
            className={`${classPrefix}_poster`}
            style={{ ...props.poster.size }}
            ref={posterWrapperRef}
          >
            <Poster {...props.poster} link={props.link} ref={posterRef} />
          </div>
        </div>
        <div
          className={clx(`${classPrefix}_footer`, {
            'footer-with-ads': props.ads && props.ads.length > 0,
          })}
        >
          {isMobile && (
            <ShareViewHeader
              title={dlgTitle}
              onClose={props.onClose}
              isMobile
              ads={props.ads}
              onAdClick={props.onAdClick || defaultAdClick}
            />
          )}
          <div className={`${classPrefix}_button-list`}>
            <SocialButtons
              link={props.link}
              isMobile={isMobile}
              title={props.title}
              onShared={props.onShared}
              buttons={props.buttons}/>
            <ActionButtons
              link={props.link}
              isMobile={isMobile}
              onSave={onSave}
              onCopy={onCopy}
              copyBtnText={props.copyBtnText}
              saveBtnText={props.saveBtnText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 带广告位走马灯的header */
function ShareViewHeaderWithAds(props: {
  /** 广告位数据数组 */
  ads: IAdsProps[];
  /** 广告位点击回调 */
  onAdClick: (item: IAdsProps) => void;
  /** 关闭分享视图 */
  onClose: undefined | (() => void);
}) {
  const classPrefix = 'kux-share-view';
  return (
    <div className={`${classPrefix}_header`}>
      {/* 广告位走马灯 */}
      <div className={`${classPrefix}_ads-list`}>
        <Carousel autoplay hideControls hideIndicators autoplayInterval={5000}>
          {props.ads.map((item) => {
            return (
              <div
                className={`${classPrefix}_ads-list-item`}
                key={item.id}
                onClick={() => props.onAdClick(item)}
              >
                <img className="slideImg" src={item.imageUrl} alt={item.title} key={item.url} />
              </div>
            );
          })}
        </Carousel>
      </div>
      {/* 关闭按钮 */}
      <div className={`${classPrefix}_close`} onClick={props.onClose}>
        {/* {
          props.isMobile ? <img src={closeThin} alt='close' /> : <CloseIcon size='tiny' />
        } */}
        <img src={closeThin} alt="close" />
      </div>
    </div>
  );
}

/** 分享视图的header */
function ShareViewHeader(
  props: Pick<IShareViewProps, 'title' | 'onClose'> & {
    isMobile?: boolean;
    ads?: IAdsProps[];
    onAdClick: (item: IAdsProps) => void;
  },
) {
  const classPrefix = 'kux-share-view';
  /** 带广告位的走马灯显示 - 小尺寸 & 传入了广告列表 */
  if (props.isMobile && props.ads && props.ads.length > 0) {
    return (
      <ShareViewHeaderWithAds ads={props.ads} onAdClick={props.onAdClick} onClose={props.onClose} />
    );
  }
  return (
    <div className={`${classPrefix}_header`}>
      <div className={`${classPrefix}_title`}>{props.title}</div>
      <div className={`${classPrefix}_close`} onClick={props.onClose}>
        {props.isMobile ? <img src={closeThin} alt="close" /> : <CloseIcon size="tiny" />}
      </div>
    </div>
  );
}

// 预加载二维码组件
const preloadQrCode = () => import('qrcode.react');

export type ISharePosterOptions = Omit<IShareViewProps, 'isOpen'>;

/**
 * sharePoster, use functional
 *
 */
export async function sharePoster(options: ISharePosterOptions) {
  // 支持 telegram app 分享
  if (app.isTMA) {
    const params: Record<string, string> = {};
    if (options.poster.rcode) {
      params.rcode = options.poster.rcode;
    }
    window.Tma.actions.share({
      startapp: window.Tma.helper.getWebViewParam(location.pathname, params),
    });
    return Promise.resolve();
  }
  // 预加载二维码组件
  await preloadQrCode();

  return new Promise<void>((resolve) => {
    // 使用画廊分享的条件是app版本支持多海报分享 和传递了分享海报类型
    if (app.isInApp && app.appMeta.supportGallery && options.galleryType) {
      app.hybrid.call('share', {
        category: 'gallery',
        rcode: options.poster.rcode,
        data: JSON.stringify({
          galleryType: options.galleryType, // 分享海报类型
          galleryLink: options.link,
          needQrCode: true,
        }),
      });
      return;
    }

    const div = document.createElement('div');
    // 获取内容区 dir, 使用 fallbackLang(为空则默认使用当前语言)
    div.dir = getDocumentDir();
    document.body.appendChild(div);
    const onClose = () => {
      ReactDom.unmountComponentAtNode(div);
      div.parentElement?.removeChild(div);
      resolve();
    };

    if (app.isInApp) {

      const PosterContent = () => {
        const ref = useRef<HTMLDivElement>(null);
        useLockScroll(true);
        useEffect(() => {
          if (!ref.current) return;
          // 使用单图分享
          convertNode2image(ref.current, { cacheId: options.cacheId, size: options.poster.size })
            .then((dataURI) => {
              app.hybrid.call('share', {
                category: 'img',
                title: options.title || '',
                link: options.link,
                pic: dataURI,
                /**
                 * 是否使用客户端生成的海报 footer(包含 二维码, logo, 文案, rcode)
                 * *iOS app store 版本(v3.109.0)会出现无法正确获取 rcode 问题, 故此处依旧使用 web 的footer
                 */
                needQrCode: false,
                qrCodeUrl: options.link,
              });
              // 延迟关闭, 延迟触发 resolve, 避免 App 内频繁点击的问题
              setTimeout(() => {
                onClose();
              }, 100);
            })
            .catch((err) => {
              console.error('generate poster failed', err);
              // 默认文案: 活动过于火爆, 请稍后再试
              toast.info(options.errorText);
              onClose();
            });
          return () => {
            onClose();
          };
        }, []);

        return (
          <>
            <Loading fullScreen />
            {/* 保证海报DOM生成在视口外 */}
            <div style={{ position: 'fixed', right: '-1000%' }}>
              <Poster {...options.poster} link={options.link} ref={ref} />
            </div>
          </>
        );
      };
      // app 端开始生成海报时即resolve, 避免相关按钮一直等到对话框关闭才隐藏loading的问题
      // 生成海报时有全屏loading接替
      resolve();
      ReactDom.render(<PosterContent />, div);
      return;
    }

    const PosterView = (props: ISharePosterOptions) => {
      const [isOpen, setIsOpen] = useState(true);
      // web 端分享海报展示后即resolve, 避免相关按钮一直等到对话框关闭才隐藏loading的问题
      useEffect(() => {
        setTimeout(() => {
          resolve();
        }, 300);
      }, [])
      useLockScroll(isOpen);
      
      const closeDlg = () => {
        setIsOpen(false);
        // 动画结束后关闭对话框
        setTimeout(() => {
          onClose();
        }, 400);
      }
      return (
        <ShareView
          isOpen={isOpen}
          onClose={closeDlg}
          {...props}
        />
      )
    }
    ReactDom.render(<PosterView {...options} />, div);
  });
}
