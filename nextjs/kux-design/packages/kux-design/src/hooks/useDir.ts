import { createSingletonListener, getDocumentDir, DIR_ATTRIBUTE_NAME } from '@/common';


const subscribeDir = (onUpdate: () => void) => {
  // 兼容 SSR 场景
  if (!app.global.document) return () => {};
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mut) => mut.attributeName === DIR_ATTRIBUTE_NAME)) {
      onUpdate();
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [DIR_ATTRIBUTE_NAME] });
  return () => observer.disconnect();
};

const dirListener = createSingletonListener(subscribeDir, getDocumentDir);

export const useDir = dirListener.useValue;