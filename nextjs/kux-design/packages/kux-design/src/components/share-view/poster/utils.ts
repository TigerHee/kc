import { cacheManager } from '@/common/cache-manager';
/**
 * 保存文件
 * @param uri 文件地址, base64 或者相对路径
 * @param filename 文件名
 */
export function saveFile (uri: string, filename: string) {
  const link = document.createElement('a');
  if (app.is(link.download, 'string')) {
    document.body.appendChild(link); // Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); // remove the link when done
  } else {
    window.open(uri);
  }
}

export interface IGeneratePosterOptions {
  /**
   * 图片 id, 用于缓存海报图片
   */
  cacheId: string;
  /**
   * 图片格式, 格式为 image/jpeg, image/png 等
   */
  mimeType?: string;
  /**
   * 图片尺寸
   */
  size: {
    width: number;
    height: number;
  }
}

/**
 * 最大缓存时间 90s
 */
const MAX_CACHE_TIME = 90 * 1000;

/**
 * 将 dom 节点转换为图片
 * @param node 要生成图片的dom节点
 * @param options 选项参数
 * @returns 图片 base64
 */
export async function convertNode2image (node: HTMLDivElement, options: IGeneratePosterOptions) {
  const img = cacheManager.get<string>(options.cacheId);
  if (img) return img;
  const dpr = window.devicePixelRatio || 2;
  const html2canvas = await import('html2canvas').then((module) => module.default);
  const canvas = await html2canvas(node, {
    scale: dpr,
    width: options.size.width,
    height: options.size.height,
    backgroundColor: null,
    // cacheBust: true,
    useCORS: true,
    ignoreElements: function (el) {
      // 忽略懒加载的图片，就算懒加载的图片不在node里也要忽略
      // 不忽略的话会导致 html2canvas 停留在 clone dom不往下运行！！！
      // fix 方案参考的 https://github.com/niklasvh/html2canvas/issues/3053
      return el.getAttribute('loading') === 'lazy';
    },
  });
  const dataURI = canvas.toDataURL(options.mimeType || 'image/jpeg', 1);
  cacheManager.add(options.cacheId, dataURI, MAX_CACHE_TIME);
  return dataURI;
}

export async function savePoster(node: HTMLDivElement, options: IGeneratePosterOptions & { filename?: string | undefined}) {
  const canvas = await convertNode2image(node, options);
  saveFile(canvas, options.filename || `poster_${Date.now()}`);
}