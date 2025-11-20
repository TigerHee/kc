/**
 * Owner: solar.xia@kupotech.com
 */
import { Form as OriginForm } from '@kux/mui';
import { StyledForm } from './styledComponents';

const extendsKeys = ['FormItem', 'useForm'];

extendsKeys.forEach((key) => {
  StyledForm[key] = OriginForm[key];
});

export default StyledForm;
