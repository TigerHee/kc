/**
 * Owner: tiger@kupotech.com
 */
import { Checkbox } from '@kux/mui';

export default (props) => {
  const { componentTitle, onChange, value } = props;

  return (
    <Checkbox
      size="basic"
      checked={value === '1'}
      onChange={(e) => onChange(e.target.checked ? '1' : '0')}
      checkOptions={{
        type: 2,
        checkedType: 1,
      }}
    >
      {componentTitle}
    </Checkbox>
  );
};
