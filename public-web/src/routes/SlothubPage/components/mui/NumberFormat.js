/*
 * @Date: 2024-06-12 14:27:52
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 16:59:49
 */
/*
 * @owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';

export default (props) => {
  const { currentLang } = useLocale();
  return <NumberFormat lang={currentLang} {...props} />;
};
