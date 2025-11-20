/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';

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
          `!!@svgr/webpack?+svgo,-titleProp,+ref!assets/svg_icons/${name}.svg`
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
const Icon = ({ iconId, onCompleted, onError, className, ...rest }) => {
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
    return (
      <SvgIcon
        data-name={iconId}
        fill="currentColor"
        className={className}
        style={{ width: '16px', height: '16px' }}
        {...rest}
      />
    );
  }
  return null;
};

export default Icon;
