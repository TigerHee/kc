/**
 * Owner: victor.ren@kupotech.com
 */
import { FormProvider, useWatch } from 'rc-field-form';
import FormItem from './FormItem';
import withForm from './withForm';
import Form from './Form';
import useForm from './formHooks/useForm';
import useFormInstance from './formHooks/useFormInstance';

Form.FormItem = FormItem;
Form.FormProvider = FormProvider;
Form.withForm = withForm;
Form.useForm = useForm;
Form.useWatch = useWatch;
Form.useFormInstance = useFormInstance;

export { Form, useForm, FormProvider, withForm, useWatch, FormItem, useFormInstance };

export default Form;
