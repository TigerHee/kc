import React from 'react';

import Button from 'components/Common/Button';
import useLang from 'hooks/useLang';
import {useHandleSaveForm} from '../hooks/useHandleSaveForm';

const SaveButton = props => {
  const {formMethods} = props;
  const {handleSubmit, formState} = formMethods;
  const disabled = !formState?.isValid;

  const {_t} = useLang();
  const {changeMyTraderInfo, isLoading} = useHandleSaveForm();

  return (
    <Button
      disabled={disabled}
      onPress={handleSubmit(changeMyTraderInfo)}
      loading={isLoading}>
      {_t('74584193cddd4000a5d9')}
    </Button>
  );
};

export default SaveButton;
