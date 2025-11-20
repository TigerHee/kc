import { ThemeProvider } from '@kux/mui';
import Tip from './Tip';

export default () => {
  return (
    <ThemeProvider theme="dark">
      <Tip />
    </ThemeProvider>
  );
};
