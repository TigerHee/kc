import { toast } from '@kux/design';
import { Captcha } from 'packages/captcha';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';

export default async function captcha() {
  const container = document.createElement('div');
  container.setAttribute('data-testid', 'verification-captcha-root');
  document.body.append(container);

  /** ReactDOM 由业务工程注入，版本大于 18 时使用 createRoot，否则使用 ReactDOM.render */
  const root = ReactDOM.version.split('.')[0] >= 18 ? createRoot(container) : null;
  try {
    const renderPromise = new Promise((resolve) => {
      const content = <Suspense fallback={null}>
        <Captcha
          open={true}
          bizType="RISK_VALIDATION_CENTER"
          onValidateSuccess={() => resolve(true)}
          onValidateError={() => resolve(false)}
          />
      </Suspense>
      root ? root.render(content) : ReactDOM.render(content, container);
    });
    return await renderPromise;
  } catch (error: any) {
    toast.error(error?.msg || error?.message);
    return false;
  } finally {
    root ? root.unmount() : ReactDOM.unmountComponentAtNode(container);
    container.remove();
  }
}