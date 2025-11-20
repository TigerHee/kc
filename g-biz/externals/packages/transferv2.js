/**
 * Owner: solar@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import Transfer from '@packages/transfer/src/transferv2';
import { TransferEvent } from '@packages/transfer/src/event';

export const TransferModal = withI18nReady(Transfer, 'transfer');

export { TransferEvent };
