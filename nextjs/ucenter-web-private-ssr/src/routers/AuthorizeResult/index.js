/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import AuthorizeResultPage from 'routes/AuthorizeResultPage';
import AuthLayout from './_layout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

export default React.memo(() => {
  return (
    <ErrorBoundary scene={SCENE_MAP.authorizeResult.index}>
      <AuthLayout>
        <AuthorizeResultPage />
      </AuthLayout>
    </ErrorBoundary>
  );
});
