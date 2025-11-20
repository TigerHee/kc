import SyncStorage, { namespace } from 'gbiz-next/syncStorage';

const storageInstance = new SyncStorage({
  namespace,
});

export default storageInstance;
