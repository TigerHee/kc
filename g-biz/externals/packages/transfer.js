/**
 * Owner: solar@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import Transfer from '@packages/transfer/src/transferv2';

export const TransferModal = withI18nReady(Transfer, 'transfer');

export { TransferEvent } from '@packages/transfer/src/event';
