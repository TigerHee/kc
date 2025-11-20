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
 * 2.目前diyContent 只支持 Roboto字体(字重600 字重400)，需要在fonts文件引入字体的base64格式文件，然后在utils里面的dom2base64方法中添加字体样式；
 * 否则会出现最后生成图片的字体样式不对
 */

// 带Dom分享弹窗
export { default as KuPosterShareWithText } from './PosterShare';
// 常用的方法
export { createDom2Base64 } from './utils';
// hooks
export { default as useShare } from './useShare';

