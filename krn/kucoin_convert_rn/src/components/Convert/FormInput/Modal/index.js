/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
// import {SheetManager} from 'react-native-actions-sheet';
import styled from '@emotion/native';
import {Confirm} from '@krn/ui';

const ExtendConfirm = styled(Confirm)`
  border-radius: 16px;
  background-color: ${({theme}) => theme.colorV2.layer};
  padding: 32px 24px;
`;

const Message = styled.Text`
  font-size: 14px;
  line-height: 22px;
  /* margin-bottom: 16px; */
  color: ${({theme}) => theme.colorV2.complementary60};
`;

export default ({
  id = 'defaultConfirm',
  show,
  message,
  // confirmText,
  // onConfirm,
  ...restProps
}) => {
  // useEffect(() => {
  //   if (show) SheetManager.show(id);
  //   else SheetManager.hide(id);
  // }, [show, id]);

  return (
    <ExtendConfirm
      id={id}
      show={show}
      // onConfirm={onConfirm}
      // title={<Title>{title}</Title>}
      message={
        <>
          <Message>{message}</Message>
          {/* <Button onPress={onConfirm}>{confirmText}</Button> */}
        </>
      }
      {...restProps}
      // confirmText={confirmText}
    />
  );
};
