/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description LottiePlayer component
 */
import { useRef, useEffect,
  useState, type CSSProperties, 
  type ReactElement} from 'react'
import { getConfig } from '@/setup'
import { cacheManager, waitLCPReady, clx } from '@/common'
import './style.scss'

/**
 * 获取 Lottie JSON 数据, 默认支持缓存
 * @description 使用方可以手动调用该方法来提前缓存 Lottie JSON 数据
 * @param path Lottie JSON 文件路径
 * @returns Promise<any> 返回 Lottie JSON 数据
 */
export function getLottieJson(path: string | Record<string, any>): Promise<any> {
  if (app.is(path, 'object')) return Promise.resolve(path);
  return cacheManager.tryGetCache(
    path,
    () => fetch(path).then(res => res.json()),
    // 浏览器本身会缓存静态资源, 这里设置一个较短的缓存时间
    1000 * 60 * 2
  );
}


export interface ILottiePlayerProps {
  /**
   * 是否立即渲染动画, 为 false 则会等到页面 LCP 就绪后再渲染动画
   * * 若页面已经渲染完毕, 即使 immediate 为false 也会立即渲染动画
   * @default false
   */
  immediate?: boolean
  /**
   * 动画未播放前的占位图
   * * 可以是图片地址, 也可以是 ReactElement(自定义的占位节点, 如 <Loading />)
   * @description 该图片会在动画加载完成后被移除
   */
  poster?: ReactElement | string
  /**
   * 循环播放动画
   * @default true
   */
  loop?: boolean
  /**
   * 渲染方式
   * @default 'svg'
   */
  renderer?: 'svg' | 'canvas' | 'html'
  /**
   * 自动播放动画, 仅初设置有效
   * @default true
   */
  autoplay?: boolean
  /**
   * json文件路径
   */
  path: string
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: CSSProperties
  /**
   * 动画运行完成后的回调函数, 仅当 loop 为 false 时有效
   */
  onComplete?: () => void
  /**
   * 动画加载失败后的回调函数
   * @param error 错误信息
   */
  onError?: (error: Error) => void
  /**
   * 动画加载完成后的回调函数, lottie 实例会作为参数传入, 注意若持有这个实例需注意在组件卸载时清理
   * @param animation Lottie animation 实例
   */
  onReady?: (animation: any) => void
}

/**
 * LottiePlayer component
 */
export function LottiePlayer(props: ILottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const propsRef = useRef<ILottiePlayerProps>(props);
  propsRef.current = props;

  useEffect(() => {
    let isUnmounted = false;
    let animation: any = null;
    const init = async () => {
      const [lottie, animationData] = await Promise.all([
        getConfig('getLottie', true),
        getLottieJson(props.path),
        // 如果 immediate 为 true 则立即渲染动画, 否则等待 LCP 就绪
        propsRef.current.immediate ? 
          Promise.resolve() :
          waitLCPReady(),
      ]).catch((err) => {
        console.error('LottiePlayer: Failed to load lottie animation', err);
        // 调用错误回调函数
        propsRef.current.onError?.(err);
        return []
      });
      const container = containerRef.current;
      if (isUnmounted || !container || !animationData || !lottie) return;

      animation = lottie.loadAnimation({
        container: container,
        renderer: propsRef.current.renderer || 'svg',
        loop: propsRef.current.loop !== false,
        autoplay: propsRef.current.autoplay !== false,
        animationData: animationData,
      });

      // 调用 onReady 回调函数
      propsRef.current.onReady?.(animation);

      const onComplete = () => {
        if (propsRef.current.onComplete) {
          propsRef.current.onComplete();
        }
      }

      const onError = (error: Error) => {
        if (propsRef.current.onError) {
          propsRef.current.onError(error);
        }
      }

      /**
       * 监听动画加载完成/失败事件
       */
      animation.addEventListener('complete', onComplete);
      animation.addEventListener('error', onError);
      setIsReady(true);
    }
  
    init();
  
    return () => {
      isUnmounted = true;
      if (animation) {
        animation.destroy();
        animation = null;
      }
    }
  }, [props.path])
  
  return (
    <div
      ref={containerRef}
      style={props.style}
      className={clx('kux-lottie-player', props.className)}>
        {!isReady && props.poster && (
          app.is(props.poster, 'string') ? (
          <img
            className="kux-lottie-player-poster"
            src={props.poster} />
          ): props.poster)}
    </div>
  )
}
