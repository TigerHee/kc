/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Dialog } from '@kux/mui';
import { NoSSG } from '../../common/tools';

export default function NoSSGModal({ children, ...props }) {
  return (
    <NoSSG>
      <Dialog {...props}>{children}</Dialog>
    </NoSSG>
  );
}
