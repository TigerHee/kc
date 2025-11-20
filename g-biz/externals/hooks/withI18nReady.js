import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import _assign from 'lodash/assign';

function withI18nReady(WrappedComponent, ns) {
  function I18nReadyComponent(props) {
    const { ready, i18n } = useTranslation(ns);

    useEffect(() => {
      if (window._useSSG) {
        i18n.reloadResources([i18n.language], [ns]);
      }
    }, [i18n]);

    if (window._useSSG && window.initialI18nStore) {
      return <WrappedComponent {...props} />;
    }
    return ready ? <WrappedComponent {...props} /> : null;
  }

  _assign(I18nReadyComponent, WrappedComponent);

  return I18nReadyComponent;
}

export default withI18nReady;
