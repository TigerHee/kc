/*
 * owner: borden@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import { noop } from 'lodash';

export const useDynamicSVGImport = (name, options = {}) => {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { fileName, onCompleted, onError, keepOrigin } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        const { default: SvgComponent } = keepOrigin
          ? await import(
              `!!@svgr/webpack?-svgo,-titleProp,+ref,+memo!@/assets/${fileName}/${name}.svg`
            )
          : await import(
              `!!@svgr/webpack?+svgo,-titleProp,+ref,+memo!@/assets/${fileName}/${name}.svg`
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
  }, [fileName, keepOrigin, name, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
};

/**
 * Simple wrapper for dynamic SVG import hook. You can implement your own wrapper,
 * or even use the hook directly in your components.
 */
const SvgComponent = ({
  type,
  width,
  height,
  onError,
  className,
  size = 16,
  style = {},
  keepOrigin, // 保持Svg图片原本的颜色
  onCompleted,
  onClick = noop,
  fileName = 'icons',
  color = 'currentColor',
}) => {
  const { error, loading, SvgIcon } = useDynamicSVGImport(type, {
    onError,
    fileName,
    keepOrigin,
    onCompleted,
  });
  if (error) {
    return 'load error';
  }

  width = width || size;
  height = height || size;

  if (loading) {
    // Placeholder
    return (
      <div
        style={{
          width,
          height,
          display: 'inline-flex',
          boxSizing: 'content-box',
          ...style,
        }}
        className={className}
      />
    );
  }
  if (SvgIcon) {
    return (
      <SvgIcon
        fill={color}
        width={width}
        style={style}
        height={height}
        data-name={type}
        onClick={onClick}
        className={className}
      />
    );
  }
  return null;
};

export default React.memo(SvgComponent);
