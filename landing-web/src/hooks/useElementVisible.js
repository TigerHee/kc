/**
 * Owner: terry@kupotech.com
 */
import { useState, useEffect } from 'react';

export const useElementVisible = (parentDomId, childrenId) => {
  const [info, updateInfo] = useState({});
  useEffect(() => {
    const parentDom = document.getElementById(parentDomId);
    if (!MutationObserver || !parentDom) return;
    const callback = (mutations) => {
      mutations?.forEach((mutation) => {
        const addNodes = Array.from(mutation.addedNodes || []);
        const removeNodes = Array.from(mutation.removedNodes || []);
        const addNode = addNodes.find((i) => i.id === childrenId);
        const removeNode = removeNodes.find((i) => i.id === childrenId);
        if (addNode) {
          updateInfo({
            el: addNode,
            show: true,
          });
        } else if (removeNode) {
          updateInfo({
            el: null,
            show: false,
          });
        }
      });
    };
    const config = {
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      subtree: false,
      childList: true,
    };
    const mutation = new MutationObserver(callback);
    mutation.observe(parentDom, config);
    return () => {
      mutation?.disconnect();
    };
  }, [parentDomId, childrenId]);
  
  return info;
};