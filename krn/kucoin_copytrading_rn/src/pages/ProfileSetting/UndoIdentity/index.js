/**
 * Owner: mike@kupotech.com
 */
import React, {memo, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {css} from '@emotion/native';
import {yupResolver} from '@hookform/resolvers/yup';

import Button from 'components/Common/Button';
import Field from 'components/Common/Form/Field';
import Form from 'components/Common/Form/Form';
import Input from 'components/Common/Input';
import useLang from 'hooks/useLang';
import {safeArray} from 'utils/helper';
import {Loading} from '../components/Loading';
import ProfileSettingPageLayout from '../components/ProfileSettingPageLayout';
import {usePullRevertReasons} from '../hooks/usePullRevertReasons';
import {Box, Desc, Title} from '../styles';
import {useSubmitHandler} from './hooks/useSubmitHandler';
import SelectReason from './SelectReason';
import {ButtonRow, InputLimit, RevertInputWrap} from './styles';
import UndoConfirmPopup from './UndoConfirmPopup';

const Content = memo(() => {
  const {_t} = useLang();

  const {data: reasonResp, isLoading} = usePullRevertReasons();

  const options = useMemo(
    () =>
      safeArray(reasonResp?.data)
        .map(i => ({
          ...i,
          label: i.message,
        }))
        ?.sort((a, b) => a.sequence - b.sequence),
    [reasonResp],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Title>{_t('f5a79cd6f0734000a5b5')}</Title>
      <Desc>{_t('1a82b21698e44000a034')}</Desc>

      <Field name={'cancelReasonIds'}>
        {register => <SelectReason options={options} {...register} />}
      </Field>

      <RevertInputWrap>
        <Desc>{_t('bf8c208989d24000a781')}</Desc>
        <Field name={'suggestContent'}>
          {register => (
            <>
              <Input
                originInputProps={{
                  multiline: true,
                  maxLength: 100,
                  textAlignVertical: 'top',
                }}
                styles={{
                  exInput: css`
                    height: 110px;
                  `,
                  inputContainer: css`
                    margin: 8px 0;
                  `,
                }}
                autoFocus
                {...register}
              />
              <InputLimit>{register.value?.length || 0}/100</InputLimit>
            </>
          )}
        </Field>
      </RevertInputWrap>
    </Box>
  );
});

const ButtonGroup = ({
  onFeedback,
  onUndo,
  isFeedBackLoading,
  isUndoLoading,
}) => {
  const {_t} = useLang();
  return (
    <ButtonRow>
      <Button
        loading={isUndoLoading}
        type="secondary"
        onPress={onUndo}
        style={{marginRight: 16, flex: 1}}>
        {_t('8e217baeadd14000a1a9')}
      </Button>
      <Button
        loading={isFeedBackLoading}
        onPress={onFeedback}
        style={{flex: 1}}>
        {_t('c86adbb662874000af52')}
      </Button>
    </ButtonRow>
  );
};

const UndoIdentity = () => {
  const [showConfirm, setConfirmShow] = useState(false);
  const schema = yup.object();

  const formMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const {onUndo, onFeedback, onFinalSubmit, loading, equityInfo} =
    useSubmitHandler({
      formMethods,
      setConfirmShow,
    });

  const {isPullEquityLoading, isSubmitReasonLoading, isApplyRevertLoading} =
    loading;

  return (
    <>
      <ProfileSettingPageLayout
        content={
          <Form formMethods={formMethods}>
            <Content />
          </Form>
        }
        footer={
          <ButtonGroup
            isFeedBackLoading={isSubmitReasonLoading}
            isUndoLoading={isPullEquityLoading}
            onFeedback={onFeedback}
            onUndo={onUndo}
          />
        }
      />
      <UndoConfirmPopup
        showConfirm={showConfirm}
        setConfirmShow={setConfirmShow}
        onFinalSubmit={onFinalSubmit}
        equityInfo={equityInfo}
        isApplyRevertLoading={isApplyRevertLoading}
      />
    </>
  );
};

export default UndoIdentity;
