import SyncStorage, { namespace } from '../syncStorage';

const storageInstance = new SyncStorage({
  namespace,
});

export default storageInstance;
