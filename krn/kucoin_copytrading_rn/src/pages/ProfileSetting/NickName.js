/**
 * Owner: mike@kupotech.com
 */
import {useToggle} from 'ahooks';
import {usePullMyLeaderDetailQuery} from 'pages/TraderProfile/hooks/usePullMyLeaderDetailQuery';
import React, {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import Field from 'components/Common/Form/Field';
import Form from 'components/Common/Form/Form';
import Input from 'components/Common/Input';
import {MaxLengthMap, ValidatePatternRules} from 'constants/public-form-field';
import useLang from 'hooks/useLang';
import {Loading} from './components/Loading';
import ProfileSettingPageLayout from './components/ProfileSettingPageLayout';
import SaveButton from './components/SaveButton';
import {Box, ErrorMessage, Title} from './styles';

const Content = ({onChange, value, error}) => {
  const [isFocus, {setLeft, setRight}] = useToggle(true);
  const {_t} = useLang();
  return (
    <Box>
      <Title>{_t('84895fb7fb9b4000a026')}</Title>
      <Input
        maxLength={MaxLengthMap.modifyTraderNickName}
        colorType={isFocus && 'success'}
        label={_t('84895fb7fb9b4000a026')}
        originInputProps={{
          onFocus: setLeft,
          onBlur: setRight,
          autoFocus: true,
          placeholder: _t('3c8d81b620504000ae76'),
          multiline: false,
        }}
        value={value}
        onChange={onChange}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Box>
  );
};
const NickName = () => {
  const {data: leaderDetailResp, isLoading} = usePullMyLeaderDetailQuery({
    refetchOnFocus: false,
  });
  const {_t} = useLang();
  const {nickName} = leaderDetailResp?.data || {};
  const schema = useMemo(() => {
    return yup.object().shape({
      nickName: yup
        .string()
        .required(_t('3c8d81b620504000ae76'))
        .matches(ValidatePatternRules.nickName, _t('b1c50f94512d4000ae47')),
    });
  }, [_t]);

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nickName,
    },
  });

  return (
    <ProfileSettingPageLayout
      content={
        isLoading ? (
          <Loading />
        ) : (
          <Form formMethods={formMethods}>
            <Field hiddenErrorMsg name={'nickName'}>
              {register => (
                <Content
                  {...register}
                  maxLength={MaxLengthMap.modifyTraderNickName}
                />
              )}
            </Field>
          </Form>
        )
      }
      footer={<SaveButton formMethods={formMethods} />}
    />
  );
};

export default NickName;
