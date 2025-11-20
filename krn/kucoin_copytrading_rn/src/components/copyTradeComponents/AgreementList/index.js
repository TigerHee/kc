import React, {Fragment} from 'react';
import styled from '@emotion/native';
import {Loading} from '@krn/ui';

import {useAgreementListQuery} from 'hooks/copyTrade/queries/useAgreementListCenter';
import {openH5Link} from 'utils/native-router-helper';
export const AttentionText = styled.Text`
  font-size: 16px;
  line-height: 22.4px;
  color: ${({theme}) => theme.colorV2.text60};
`;

export const GuideLinkText = styled(AttentionText)`
  color: ${({theme}) => theme.colorV2.text};
  text-decoration-line: underline;
`;

export const AgreementList = ({style, scene}) => {
  const {data, isLoading} = useAgreementListQuery({scene});

  if (!scene) {
    return null;
  }

  if (isLoading) {
    return <Loading size="small" spin />;
  }

  return (
    <>
      {data?.map((item, idx) => {
        const isEnd = idx === data.length - 1;
        return (
          <Fragment key={item.articleId}>
            <GuideLinkText
              style={style}
              onPress={() => {
                openH5Link(item.url);
              }}>
              {item.title}
            </GuideLinkText>
            {!isEnd && <AttentionText>,</AttentionText>}
          </Fragment>
        );
      })}
    </>
  );
};
