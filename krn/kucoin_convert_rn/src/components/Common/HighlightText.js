/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import styled from '@emotion/native';

const Highlight = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
`;

export const highlight = (allText = '', keywords = '', style) => {
  if (!allText) return '';
  let parts = allText.split(new RegExp(`(${keywords})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part?.toLowerCase() === keywords?.toLowerCase() ? (
          <Highlight key={i} style={style}>
            {part}
          </Highlight>
        ) : (
          part
        ),
      )}
    </>
  );
};

/**
 * HighlightText
 */
const HighlightText = memo(props => {
  const {allText, keywords, style} = props;
  return highlight(allText, keywords, style);
});

export default HighlightText;
