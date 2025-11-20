/**
 * Owner: tiger@kupotech.com
 */
import { DatePicker, styled } from '@kux/mui';
import { ICArrowDownOutlined } from '@kux/icons';
import H5Picker from './H5Picker';
import useCommonData from '../../../hooks/useCommonData';
import GlobalStyle from './style';

const DownIcon = styled(ICArrowDownOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

export default (props) => {
  const { inApp } = useCommonData();

  return (
    <>
      {inApp ? <H5Picker {...props} /> : <DatePicker {...props} suffixIcon={<DownIcon />} />}
      <GlobalStyle />
    </>
  );
};
