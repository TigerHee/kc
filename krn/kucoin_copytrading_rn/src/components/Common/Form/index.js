import Field from './Field';
import FormComp from './Form';
export {default as FormLabel} from './FormLabel';
export {default as InputField} from './InputField';
export {default as FormField} from './Field';

const Form = FormComp;
Form.Field = Field;

export default Form;
