/*
 * @Date: 2024-06-12 14:27:52
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 17:04:47
 */
/*
 * @owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat } from '@kux/mui';

export default (props) => {
  const { currentLang } = useLocale();
  return (
    <DateTimeFormat
      lang={currentLang}
      {...props}
      options={{
        timeZone: 'UTC', // gemslot前端显示日期指定时区为 UTC
      }}
    />
  );
};
