/**
 * Owner: herin.yao@kupotech.com
 */
import { useEffect } from 'react';
import { getPathByLang } from 'src/utils/langTools';
import { useSelector } from 'dva';

/**
 * 监听状态中的语言变化，设置html标签的lang属性
 */
export default function useHtmlLang() {
  const currentLang = useSelector(state => state.app.currentLang);

  useEffect(() => {
    if (document && document.documentElement) {
      const langPath = getPathByLang(currentLang);
      document.documentElement.setAttribute('lang', langPath);
    }
  }, [currentLang]);
};
