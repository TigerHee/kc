/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import USDsvg from 'assets/svg/icons/USD.svg';

function useDynamicSVGImport(name, options = {}) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        const { default: SvgComponent } = await import(`!!@svgr/webpack?-svgo,+titleProp,+ref!assets/svg/icons/${name}.svg`);
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
const DefaultIcon = ({ className, ...rest }) => {
  const { error, loading, SvgIcon } = useDynamicSVGImport('USD');
  if (error || loading) {
    return <img src={USDsvg} {...rest} />;
  }
  if (SvgIcon) {
    return <SvgIcon fill="currentColor" className={className} {...rest} />;
  }
  return null;
};
const Icon = ({ iconId, onCompleted, onError, className, ...rest }) => {
  const { error, loading, SvgIcon } = useDynamicSVGImport(iconId, {
    onCompleted,
    onError,
  });
  if (error) {
    return <DefaultIcon className={className} {...rest} />;
  }
  if (loading) {
    return null;
  }
  if (SvgIcon) {
    return <SvgIcon fill="currentColor" className={className} {...rest} />;
  }
  return null;
};

export default Icon;
