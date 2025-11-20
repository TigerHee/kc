/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ErrorPage from 'routes/ErrorPage';
import _ from 'lodash';
import { replace } from 'utils/router';
import { report404 } from 'tools/sentry';

export default (props) => {
  const {
    location: { pathname },
  } = props;
  useEffect(() => {
    report404();
    if (!_.startsWith(pathname, '/404')) {
      replace('/404');
    }
  }, [pathname]);
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ErrorPage statusCode="404" />
    </>
  );
};
