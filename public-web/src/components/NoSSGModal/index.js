/**
 * Owner: willen@kupotech.com
 */
import { Dialog } from '@kufox/mui';
import NoSSG from '../NoSSG';

export default function NoSSGModal({ children, ...props }) {
  return (
    <NoSSG>
      <Dialog {...props}>{children}</Dialog>
    </NoSSG>
  );
}
