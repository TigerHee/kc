/**
 * Owner: vijay.zhou@kupotech.com
 */
import { TOTAL_FIELD_INFOS, TOTAL_FILE_FIELDS } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';

const useRules = ({ name, required, formData }) => {
  const { companyType } = formData ?? {};
  const label = TOTAL_FIELD_INFOS[name]?.title?.({ companyType });

  return [
    {
      required,
      message: TOTAL_FILE_FIELDS[name]
        ? _t('c893a1dd01684800a7b3', { documents: label })
        : _t('kyc.form.required'),
    },
  ];
};

export default useRules;
