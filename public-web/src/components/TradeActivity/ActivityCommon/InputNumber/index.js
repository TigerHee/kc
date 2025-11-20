/**
 * Owner: solar.xia@kupotech.com
 */
import { Input } from '@kux/mui';
import withNumberInput from './withNumberInput';

const InputComp = (props) => {
  return <Input {...props} />;
};

export default withNumberInput(InputComp);
