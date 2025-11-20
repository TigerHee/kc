/**
 * Owner: odan.ou@kupotech.com
 */
import { Form } from '@kux/mui';
import { useCallback, useMemo } from 'react';
import { FormList } from '../../Components';
import { useLegalRequestForm } from '../../useFetchConf';
import {
  banRemarkList,
  fileParamsHandle,
  FileRules,
  LegalOtherTypeKey,
  legalTypes,
  requestsTypes,
  userCommitmentList,
  yesOrNoRadio,
  _t,
} from '../../utils';

const { useForm, useWatch } = Form;

const LegalForm = (props) => {
  const { token, onEnd } = props;
  const [form] = useForm();
  const { run, loading } = useLegalRequestForm(onEnd);
  const isFreeze = useWatch('isFreeze', form);
  const caseReason = useWatch('caseReason', form);
  const freezed = isFreeze === 1;

  const isOtherCaseReason = useMemo(() => {
    return caseReason === LegalOtherTypeKey;
  }, [caseReason]);

  const list = useMemo(() => {
    return [
      {
        label: _t('jQEnvKBVWfbmjS1KrgX4Wu', '案件名称'), // '案件名称',
        name: 'caseName',
        max: 255,
      },
      // {
      //   label: _t('13ZheVoKarfzcTZs6EGfmQ', '执法机构所在国家'), // '执法机构所在国家',
      //   name: 'country',
      //   max: 255,
      // },
      // {
      //   label: _t('fWYAKUEYEsfehLdDD92rP7', '执法机构全称'), // '执法机构全称',
      //   name: 'lawEnforcementAgencyFullName',
      //   max: 255,
      // },
      {
        label: _t('rHxZ5xXGaVqeie72Ai81iA', '案由'), // '案由',
        options: legalTypes,
        name: 'caseReason',
      },
      {
        label: _t('6uWBexyCrZfsdu5zMeAFjD', '请求类型'), // '请求类型',
        options: requestsTypes,
        name: 'requestType',
      },
      {
        label: _t('3ex7S93wXayCDPbhmuktkq', '书面执法请求、法庭令或传票、授权证明'), // '书面执法请求、法庭令或传票、授权证明',
        name: 'authorizingProof',
        itemType: 'file',
        tip: _t('7PLgzTFk9mTu9WTckSEtKV'),
        rules: FileRules,
        itemProps: {
          maxFiles: 4,
        },
        formItemProps: { validateTrigger: ['onSubmit'] },
      },
      {
        label: _t('usuobmduz17K4K2W5zRQ8n', '资金流向分析图'), // '资金流向分析图',
        itemType: 'file',
        name: 'fundFlowAnalysisChart',
        tip: _t('puPKdcTr5LteEGESVp9pe3'),
        rules: FileRules,
        itemProps: {
          maxFiles: 3,
        },
        formItemProps: { validateTrigger: ['onSubmit'] },
      },
      {
        label: _t('pBQx7naeURLgtDhvrznLJ6', '需要调取的信息'), // '需要调取的信息',
        name: 'retrieveInformation',
        tip: _t('6913Qkp9Dqt3bf8jFQC5zQ'),
        max: 2000,
        itemType: 'textarea',
      },
      {
        label: _t('3XKx28MVHsyEoxryGYYFR4', '是否需要冻结'), // '是否需要冻结',
        options: yesOrNoRadio,
        itemType: 'radio',
        name: 'isFreeze',
      },
      {
        label: _t('5wmnmNE9xtQ26y9UYeU2zD', '冻结期限'), // '冻结期限',
        name: 'freezePeriod',
        show: freezed,
        tip: _t('rvoFnsidhr9s7x7XXTWq1E'),
        max: 255,
      },
      {
        label: _t('pnHmDVb22zetMzFCo3JH4r', '冻结原因是否可以告知涉案用户'), // '冻结原因是否可以告知涉案用户',
        options: yesOrNoRadio,
        itemType: 'radio',
        name: 'freezeReasonInformUser',
        show: freezed,
      },
      {
        label: _t('jYofzLNMQw3LAesngt3b36', '警方联系方式是否可以向用户披露'), // '警方联系方式是否可以向用户披露',
        options: yesOrNoRadio,
        itemType: 'radio',
        name: 'policeContactInformUser',
        show: freezed,
      },
      {
        label: _t('q47aLC6cbN8TSpCewqNDgi', '冻结令'), // '冻结令',
        name: 'freezeOrder',
        itemType: 'file',
        show: freezed,
        tip: _t('7PLgzTFk9mTu9WTckSEtKV'),
        rules: FileRules,
        formItemProps: { validateTrigger: ['onSubmit'] },
      },
      // {
      //   label: _t('mCEwiE6zqjtUSr18R4RtKW', '执法机构邮箱地址'), // '执法机构邮箱地址',
      //   name: 'lawEnforcementAgencyEmail',
      // },
      // {
      //   label: _t('ctHBqowQLR3a6PA2LN8bnb', '执法官员在执法机构的在职证明或身份证明'), // '执法官员在执法机构的在职证明或身份证明',
      //   itemType: 'file',
      //   name: 'identificationProof',
      //   tip: _t('89NWJdY2h9BKg1y6iZ6wXq'),
      //   rules: FileRules,
      // },
      {
        label: _t('kbp6vwX5Dr1P8ihoQKba9K', '备注'), // '备注',
        name: 'remark',
        itemType: 'textarea',
        max: 500,
        required: isOtherCaseReason,
        placeholder: isOtherCaseReason ? _t('7d774c2d0f614000a1ab') : undefined,
        rules: [
          {
            validator(rule, value) {
              if (!isOtherCaseReason || !value) {
                return Promise.resolve();
              }
              const val = String(value).trim();
              if (/^\d+$/.test(val)) {
                return Promise.reject(_t('978886359b154000a2a8'));
              }
              if (banRemarkList.includes(val)) {
                return Promise.reject(_t('08f1b13162e84000a794', { reason: `"${val}"` }));
              }
              return Promise.resolve();
            },
          },
        ],
      },
      {
        label: '', // 承诺
        name: 'userPromise', // 未传递给后端，后端不使用
        options: userCommitmentList,
        itemType: 'checkbox',
        rules: [
          {
            validator(rule, value) {
              if (value?.[0] === userCommitmentList[0].value) {
                return Promise.resolve();
              }
              return Promise.reject(_t('kM2apKkoR5Gw6wAaBcQCTX'));
            },
          },
        ],
      },
    ].filter((item) => item.show !== false);
  }, [freezed, isOtherCaseReason]);

  const handleSubmit = useCallback(
    (values) => {
      run(
        fileParamsHandle(
          { ...values, token },
          list.filter((item) => item.itemType === 'file').map((item) => item.name),
        ),
      );
    },
    [run, token, list],
  );

  const retroMode = true;

  return (
    <div>
      <FormList
        onFinish={handleSubmit}
        list={list}
        loading={loading}
        form={form}
        retro={retroMode}
        commonItemProps={{
          token,
        }}
      />
    </div>
  );
};

export default LegalForm;
