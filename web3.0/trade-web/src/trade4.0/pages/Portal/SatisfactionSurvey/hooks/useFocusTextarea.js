/**
 * Owner: harry.lai@kupotech.com
 */
import { useRef, useEffect } from 'react';

export const useFocusTextarea = ({ visible }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const length = textareaRef.current.value?.length;

    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(length, length);
  }, [visible]);

  return { textareaRef };
};
