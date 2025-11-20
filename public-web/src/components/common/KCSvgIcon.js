/*
 * @Date: 2024-05-27 14:36:01
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com * @LastEditTime: 2024-05-28 17:41:05
 */
/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';

function useDynamicSVGImport(name, options = {}) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        const { default: SvgComponent } = await import(
          `!!@svgr/webpack?+svgo,-titleProp,+ref!static/svg_icons/${name}.svg`
        );
        ImportedIconRef.current = SvgComponent;
        if (onCompleted) {
          onCompleted(name, ImportedIconRef.current);
        }
      } catch (err) {
        if (onError) {
          onError(err);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}

/**
 * Simple wrapper for dynamic SVG import hook. You can implement your own wrapper,
 * or even use the hook directly in your components.
 */
const Icon = ({ iconId, onCompleted, onError, ...rest }) => {
  const { error, loading, SvgIcon } = useDynamicSVGImport(iconId, {
    onCompleted,
    onError,
  });
  if (error) {
    return 'load error';
  }
  if (loading) {
    return null;
  }
  if (SvgIcon) {
    return <SvgIcon {...rest} />;
  }
  return null;
};

export default Icon;
