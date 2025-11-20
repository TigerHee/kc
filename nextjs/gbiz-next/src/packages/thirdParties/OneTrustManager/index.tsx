// TODO: Evaluate import 'client only'
import React from 'react';

import { bootConfig } from 'kc-next/boot';

export type OneTrustParams = {
  nonce?: string;
};

export const oneTrustHash = {
  TH: '0195cca8-1219-7fbd-b261-d0769fd2ca4b',
  TR: '01922868-a01b-7ea1-8904-4fc14a307b94',
  AU: '01982ba5-747a-748a-9561-42694876daf3',
  EU: '01983f61-f230-7dc2-bb8a-9be87c2612b3',
};
export const oneTrustBrands = Object.keys(oneTrustHash);

export function OneTrustManager(props: OneTrustParams) {
  const { nonce } = props;
  const brandSite = bootConfig._BRAND_SITE_;

  if (!oneTrustBrands.includes(brandSite)) return null;
  const hash = oneTrustHash[brandSite];

  const otAutoBlockUrl = `https://cdn.cookielaw.org/consent/${hash}/OtAutoBlock.js`;
  const otSDKStubUrl = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

  return (
    <>
      <script src={otAutoBlockUrl} nonce={nonce} />
      <script
        src={otSDKStubUrl}
        nonce={nonce}
        data-document-language='true'
        type='text/javascript'
        // charSet="UTF-8"
        data-domain-script={hash}
      />
      <script
        id='kc-next-onetrust-init'
        dangerouslySetInnerHTML={{
          __html: `
					// 初始化 oneTrust
					function initOneTrust() {
						try {
							// 默认先隐藏 oneTrust 的 UI，等语言准备好之后再展示，防止闪烁，先出现英文，再出现目标语言
							var style = document.createElement('style');
							style.id = 'custom-onetrust-style';
							style.innerHTML = '#onetrust-pc-sdk, #onetrust-consent-sdk { display: none !important; }';
							document.head.appendChild(style);

							let isOneTrustLoaded = false;
							const listeners = [];
							// oneTrust 首次加载完成，以及用户设置变化后，都会触发 OptanonWrapper 函数
							// 我们只需要首次触发，用来更新语言
							window.OptanonWrapper = function () {
								if (isOneTrustLoaded) {
									return;
								}
								isOneTrustLoaded = true;
								listeners.forEach(listener => listener());
							}
							window.onOneTrustLoaded = function (callback) {
								if (isOneTrustLoaded) {
									callback();
									return;
								}
								listeners.push(callback);
							}
						} catch (e) {
							console.error('OneTrust error', e);
						}
					}
					initOneTrust();`,
        }}
        nonce={nonce}
      />
    </>
  );
}
