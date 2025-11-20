/**
 * Owner: corki@kupotech.com
 */

import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';
import Drawer from './Drawer';

const TaxInvoiceDrawer = loadable(() => import('./TaxInvoiceDrawer'));

export default function (props) {
  return (
    <>
      {tenantConfig.download.showNormalDrawer ? <Drawer {...props} /> : null}
      {tenantConfig.download.showTaxInvoiceDrawer ? <TaxInvoiceDrawer {...props} /> : null}
    </>
  );
}
