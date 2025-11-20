/**
 * Owner: odan.ou@kupotech.com
 */
import { Form } from '@kux/mui';
import { useCallback, useMemo } from 'react';
import { FormList } from '../../Components';
import { useLegalUserVerify } from '../../useFetchConf';
import { fileParamsHandle, FileRules, _t } from '../../utils';

const { useForm } = Form;
// 核验身份

const VerifyID = (props) => {
  const { onVerifyRefresh, token } = props;
  const [form] = useForm();
  const { run, loading } = useLegalUserVerify(onVerifyRefresh);
  const list = useMemo(() => {
    return [
      {
        label: _t('dycqQS5yeBUGL9hNiMPjiU', '所在国家'),
        name: 'country',
        max: 200,
      },
      {
        label: _t('fWYAKUEYEsfehLdDD92rP7', '执法机构全称'),
        name: 'lawEnforcementAgencyFullName',
        max: 50,
      },
      {
        label: _t('mCEwiE6zqjtUSr18R4RtKW', '执法机构邮箱地址'),
        name: 'lawEnforcementAgencyEmail',
        max: 255,
      },
      {
        label: _t(
          '19NrkgUJN3zinAtW62LVhx',
          '执法官员在执法机构身份证明，例如：含警徽的证件照片或类似的身份证明',
        ),
        name: 'identificationProof',
        itemType: 'file',
        retro: true,
        rules: FileRules,
        itemProps: {
          maxFiles: 2,
        },
        formItemProps: { validateTrigger: ['onSubmit'] },
      },
    ];
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      run(fileParamsHandle({ ...values, token }, 'identificationProof'));
    },
    [run, token],
  );

  return (
    <div>
      <FormList
        onFinish={handleSubmit}
        list={list}
        loading={loading}
        form={form}
        title={_t('sKhUQ44D8pKdePsk3GsRe9', '核验身份')}
        commonItemProps={{
          token,
        }}
      />
    </div>
  );
};

export default VerifyID;
