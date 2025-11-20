import {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {ValidatePatternRules} from 'constants/public-form-field';
import useLang from 'hooks/useLang';

export const useInitForm = () => {
  const {_t} = useLang();
  const schema = useMemo(() => {
    return yup.object().shape({
      nickName: yup
        .string()
        .required(_t('3c8d81b620504000ae76'))
        .matches(ValidatePatternRules.nickName, _t('b1c50f94512d4000ae47')),
      profile: yup
        .string()
        .required(_t('6da505dd8eb04000a30e'))
        .matches(ValidatePatternRules.introduction, _t('20d12f9b8f414000a5b1')),
    });
  }, [_t]);

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return formMethods;
};
