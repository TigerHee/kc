import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { assign } from 'lodash-es';

function withI18nReady(WrappedComponent: React.FunctionComponent<any>, ns: string) {
  function I18nReadyComponent(props: any) {
    const { ready, i18n } = useTranslation(ns);

    useEffect(() => {
      if (window._useSSG) {
        i18n.reloadResources([i18n.language], [ns]);
      }
    }, [i18n]);

    if (window._useSSG && window.initialGbizNextI18nStore) {
      return <WrappedComponent {...props} />;
    }
    return ready ? <WrappedComponent {...props} /> : null;
  }

  assign(I18nReadyComponent, WrappedComponent);

  return I18nReadyComponent;
}

export default withI18nReady;
