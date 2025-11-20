/**
 * Owner: mike@kupotech.com
 */
import {usePullMyLeaderDetailQuery} from 'pages/TraderProfile/hooks/usePullMyLeaderDetailQuery';
import React, {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {css} from '@emotion/native';
import {yupResolver} from '@hookform/resolvers/yup';

import Field from 'components/Common/Form/Field';
import Form from 'components/Common/Form/Form';
import Input from 'components/Common/Input';
import {MaxLengthMap, ValidatePatternRules} from 'constants/public-form-field';
import useLang from 'hooks/useLang';
import {Loading} from './components/Loading';
import ProfileSettingPageLayout from './components/ProfileSettingPageLayout';
import SaveButton from './components/SaveButton';
import {Box, Desc, ErrorMessage, Title} from './styles';

const Content = ({value, onChange, maxLength, error}) => {
  const {_t} = useLang();
  return (
    <Box>
      <Title>{_t('61335114436f4000a0e1')}</Title>
      {!!maxLength && (
        <Desc>
          {_t('c893b12a67744000a23a', {
            cur: value?.length || 0,
            max: maxLength,
          })}
        </Desc>
      )}
      <Input
        originInputProps={{
          autoFocus: true,
          placeholder: '',
          multiline: true,
          maxLength: MaxLengthMap.modifyTraderIntro,
          numberOfLines: 4,
          textAlignVertical: 'top',
        }}
        styles={{
          exInput: css`
            min-height: 116px;
            max-height: 232px;
          `,
        }}
        autoFocus
        value={value}
        onChange={onChange}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Box>
  );
};

const Profile = () => {
  const {data: leaderDetailResp, isLoading} = usePullMyLeaderDetailQuery({
    refetchOnFocus: false,
  });
  const {_t} = useLang();
  const {introduce} = leaderDetailResp?.data || {};

  const schema = useMemo(() => {
    return yup.object().shape({
      profile: yup
        .string()
        .required(_t('6da505dd8eb04000a30e'))
        .matches(ValidatePatternRules.introduction, _t('20d12f9b8f414000a5b1')),
    });
  }, [_t]);

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      profile: introduce,
    },
  });

  return (
    <ProfileSettingPageLayout
      content={
        isLoading ? (
          <Loading />
        ) : (
          <Form formMethods={formMethods}>
            <Field name={'profile'} hiddenErrorMsg>
              {register => (
                <Content
                  {...register}
                  maxLength={MaxLengthMap.modifyTraderIntro}
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

export default Profile;
