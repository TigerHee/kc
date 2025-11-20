import Tip from './Tip';
import { HeaderStoreProvider } from '../Header/model';

export default () => {
  return (
    <HeaderStoreProvider>
      <Tip />
    </HeaderStoreProvider>
  );
};
