/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import LocaleProvider from '@kc/gbiz-base/lib/LocaleProvider';

export default (props) => {
  return (
    <LocaleProvider locale={props.locale} ns="@kc/entrance">
      {props.children}
    </LocaleProvider>
  );
};
