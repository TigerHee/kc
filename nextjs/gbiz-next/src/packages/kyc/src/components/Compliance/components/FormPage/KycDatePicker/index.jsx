/**
 * Owner: tiger@kupotech.com
 */
import { DatePicker } from '@kux/mui';
import H5Picker from './H5Picker';
import useCommonData from '../../../hooks/useCommonData';
import GlobalStyle from './style';

export default props => {
  const { inApp } = useCommonData();

  return (
    <>
      {inApp ? <H5Picker {...props} /> : <DatePicker {...props} />}
      <GlobalStyle />
    </>
  );
};
