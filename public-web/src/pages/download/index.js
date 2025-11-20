/**
 * Owner: willen@kupotech.com
 */
import { ThemeProvider } from '@kux/mui';
import { useSelector } from 'hooks/useSelector';
import DownloadPage from 'routes/DownloadPage';

export default () => {
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  return (
    <ThemeProvider theme={currentTheme}>
      <DownloadPage />
    </ThemeProvider>
  );
};
