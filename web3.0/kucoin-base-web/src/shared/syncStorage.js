import SyncStorage, { namespace } from '@kucoin-biz/syncStorage';

const storageInstance = new SyncStorage({
  namespace,
});

export default storageInstance;
