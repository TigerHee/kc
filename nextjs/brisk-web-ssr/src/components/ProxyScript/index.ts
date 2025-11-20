/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2025-05-07 14:54:16
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-05-26 19:46:07
 * @FilePath: /brisk-web/src/routes/HomePage/Service/ProxyScript.js
 * @Description: https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/843059038/KC,第三方脚本，BD推广作用
 */
import { useEffect } from 'react';

const ProxyScript = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 检查是否为 HTTPS 协议
    if (window.location.protocol === 'https:') {
      // 加载第一个脚本
      const script1 = document.createElement('script');
      script1.setAttribute(
        'src',
        'https://scripts.coolretargeting.com/scripts/digi_kucoin.js'
      );
      script1.setAttribute('async', 'true');
      script1.setAttribute('referrerPolicy', 'origin-when-cross-origin');
      script1.setAttribute('id', 'digi_kucoin');
      script1.setAttribute('crossorigin', 'anonymous');
      script1.setAttribute(
        'integrity',
        'sha384-tg3N6U5cPzM9cCZtbIcJniK0eFuu5lX0VFnf4QZ1teqPN4CdrDtDM4jcnz7oE079'
      );
      document.body.appendChild(script1);

      // 加载第二个脚本
      const script2 = document.createElement('script');
      script2.setAttribute(
        'src',
        'https://adscool.net/resources/content/kucoin.js'
      );
      script2.setAttribute('async', 'true');
      script2.setAttribute('crossorigin', 'anonymous');
      script2.setAttribute(
        'integrity',
        'sha384-2qadsLX6OEs3Ra4V62cLyV/ksp05ViAOB+Ymk6+KDH1QycWOrIqczBt07MtP+d2G'
      );
      script2.setAttribute('id', 'adscool_kucoin');

      // 直接添加到 body 末尾
      document.body.appendChild(script2);

      return () => {
        // 清理两个脚本
        if (script1.parentNode) {
          script1.parentNode.removeChild(script1);
        }
        if (script2.parentNode) {
          script2.parentNode.removeChild(script2);
        }
      };
    }
  }, []);

  return null;
};

export default ProxyScript;
