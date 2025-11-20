import {useDebounceFn} from 'ahooks';
import React, {useCallback, useState} from 'react';
import styled, {css} from '@emotion/native';
import {takePicture} from '@krn/bridge';

import UploadAddIc from 'assets/common/upload-add-icon.svg';
import {RowWrap} from 'constants/styles';

const ShowImage = styled.Image`
  width: 90px;
  height: 90px;
  margin-right: 12px;
  border-radius: 12px;
`;

const FillUploadBox = styled.View`
  width: 90px;
  height: 90px;
  margin-right: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background: ${({theme}) => theme.colorV2.cover2};
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  margin-bottom: 12px;
`;

const FillUploadImg = styled.Image`
  width: 40px;
  height: 40px;
`;

const PARAMS_DEFAULT = {
  capture: true,
  maxCount: 3,
};

const Container = styled(RowWrap)`
  flex-wrap: wrap;
`;

const UploadProve = props => {
  const {value, onChange, maxCount = 3} = props;
  const [imgList, setImgList] = useState(value || []);

  const handleSelectPhoto = useCallback(async () => {
    const {photos = []} =
      (await takePicture({
        ...PARAMS_DEFAULT,
        maxCount: maxCount - imgList?.length,
      })) || {};
    const newList = [...imgList, ...photos];
    setImgList(newList);

    onChange(newList);
  }, [imgList, maxCount, onChange]);

  const {run} = useDebounceFn(handleSelectPhoto, {
    wait: 300,
  });

  return (
    <Container>
      {imgList?.map((i, idx) => (
        <ShowImage
          key={idx}
          source={i}
          style={
            (idx + 1) % 3 === 0 &&
            css`
              margin-right: 0px;
            `
          }
        />
      ))}

      <FillUploadBox>
        {maxCount > imgList?.length && (
          <UploadAddIc onPress={run} width={40} height={40} />
        )}
        {/* <FillUploadImg source={UploadAddIc} /> */}
      </FillUploadBox>
    </Container>
  );
};

export default UploadProve;
