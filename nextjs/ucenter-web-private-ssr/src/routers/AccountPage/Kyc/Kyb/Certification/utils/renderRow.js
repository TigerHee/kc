/**
 * Owner: vijay.zhou@kupotech.com
 */
import { isArray } from 'lodash-es';
import { VERIFY_CONTAINER_CLASS_NAME } from '../../../config';
import { Layout, LayoutLeft, LayoutRight } from '../components/styled';

export default (row) => {
  const children = isArray(row) ? row.map((col) => col.render()) : row.render();
  if (row.withoutLayout) {
    return children;
  } else {
    return (
      <Layout className="kucoinpay-kyb-certification-render-row">
        <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>{children}</LayoutLeft>
        <LayoutRight />
      </Layout>
    );
  }
};
