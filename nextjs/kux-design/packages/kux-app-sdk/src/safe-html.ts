/**
 * html 安全处理
 */
import { is } from './is';
/**
 * xss 过滤选项
 */
export interface IXssOptions {
  /**
   * 允许使用的标签, allowTags 和 ignoreTags 同时存在时, 优先使用 allowTags
   */
  allowTags?: string[];
  /**
   * 禁用的标签
   */
  ignoreTags?: string[];
  /**
   * 允许的属性, allowAttrs 和 ignoreAttrs 同时存在时, 优先使用 allowAttrs
   */
  allowAttrs?: string[];
  /**
   * 禁用的属性
   */
  ignoreAttrs?: string[];
  /**
   * 允许的事件, 为空则全部禁用
   */
  allowEvents?: string[];
  /**
   * URL协议白名单, 避免 javascript: 等危险协议
   */
  allowProtocols?: string[];
}

const defaultXssOptions: IXssOptions = {
  ignoreTags: ['script', 'style', 'iframe'],
  allowProtocols: ['http', 'https', 'mailto', 'tel', 'data'],
}

const attributeWithProtocol = ['src', 'href', 'data', 'action', 'formaction', 'xlink:href', 'manifest'];

function hasProtocol(value: string) {
  return /^[a-z\d-]+\:/i.test(value)
}

/**
 * 是否为禁止的属性
 * @param name 属性名
 * @param value 属性值
 * @param tagName 标签名
 */
function isForbiddenAttribute(name: string, value: string, tagName: string) {
  if (name === 'style') {
    // style 属性中禁止使用 expression
    return /\bexpression\s*\(/i.test(value)
      || /\burl\s*\(\s*javascript\s*:/i.test(value);
  }
  if (tagName === 'meta' && name === 'http-equiv') {
    // 禁止使用 http-equiv 改变页面行为
    return true
  }
}

/**
 * html xss filter
 *   * 使用 html template tag 过滤 html
 * @param html html string
 * @param options 过滤选项
 */
export function filterXssHTML(html: string, options: IXssOptions = defaultXssOptions) {
  const { allowTags, ignoreTags, allowAttrs, ignoreAttrs, allowEvents, allowProtocols } = options;
  const template = document.createElement('template');
  template.innerHTML = html;
  // 转变为数组, 避免 childNodes 的 live list 特性
  const elements = Array.from(template.content.childNodes);
  const isIgnoreTag = allowTags && allowTags.length > 0
    ? (tag: string) => !allowTags.includes(tag)
    : (tag: string) => !ignoreTags ? false : ignoreTags.includes(tag);

  const isIgnoreAttr = allowAttrs && allowAttrs.length > 0
    ? (attr: string) => !allowAttrs.includes(attr)
    : (attr: string) => !ignoreAttrs ? false : ignoreAttrs.includes(attr);

  const isForbiddenProtocol = allowProtocols && allowProtocols.length > 0
    ? (name: string, value: string) => attributeWithProtocol.includes(name)
      && hasProtocol(value) && !allowProtocols.some(p => value.startsWith(`${p}:`))
    : () => false;
  
  // 规范化事件名称, 统一为小写
  const normalizedAllowEvents = allowEvents ? allowEvents.map(e => e.toLowerCase()) : [];
  const isForbiddenEvent = normalizedAllowEvents && normalizedAllowEvents.length > 0
    ? (name: string) => {
      const val = name.startsWith('on') && !normalizedAllowEvents.includes(name);
      return val;
    }
    : (name: string) => name.startsWith('on');

  const filterNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (isIgnoreTag(element.tagName.toLowerCase())) {
        element.remove();
        return;
      }
      for (const attr of Object.values(element.attributes)) {
        const attrName = attr.name.toLowerCase();
        if (isIgnoreAttr(attrName)
          || isForbiddenEvent(attrName)
          || isForbiddenProtocol(attrName, attr.value)
          || isForbiddenAttribute(attrName, attr.value, element.tagName.toLowerCase())) {
          element.removeAttribute(attr.name);
          continue;
        }
        attr.value = attr.value && escapeHtml(attr.value);
      }
      for (const child of element.childNodes) {
        filterNode(child);
      }
      return
    }
    // 其他类型的节点直接移除, 比如注释节点
    node.parentNode?.removeChild(node);
  }

  for (const element of elements) {
    filterNode(element);
  }
  return template.innerHTML;
}

/**
 * 转译特殊HTML字符
 */
export function escapeHtml(str: string) {
  if (!is(str, 'string')) return str;
  return str.replace(/[&<>'"]/g, (i) => '&#'+i.charCodeAt(0)+';')
}
