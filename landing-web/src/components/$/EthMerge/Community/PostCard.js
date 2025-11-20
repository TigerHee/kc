/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { addLangToPath } from 'src/utils/lang';
import { sensors } from 'src/utils/sensors';
import { KUCOIN_HOST } from 'utils/siteConfig';
import {
  CardLink,
  CardBody,
  CardContent,
  CardHeader,
  CardTitle,
  StyledArrowRight,
  StyledCirclesIcon,
} from './StyledComps';

const PostCard = ({ post }) => {
  const { postContent, postId, postTitle } = post;
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      sensors.trackClick(['V3', '1']);
      window.open(addLangToPath(`${KUCOIN_HOST}/kucoins/bbs/post/${postId}`));
      window.opener = null;
    },
    [postId],
  );
  const textContent = useMemo(
    () => {
      return postContent.find(item => item?.type === 'TEXT')?.text;
    },
    [postContent],
  );

  return (
    <CardLink href={addLangToPath(`${KUCOIN_HOST}/kucoins/bbs/post/${postId}`)} onClick={handleClick}>
      <CardHeader>
        <StyledCirclesIcon />
        <StyledArrowRight fill="currentColor" />
      </CardHeader>
      <CardBody>
        <CardTitle>
          <span className='mr-8'>#</span>
          <h4>{postTitle}</h4>
        </CardTitle>
        <CardContent>{textContent}</CardContent>
      </CardBody>
    </CardLink>
  );
};

export default React.memo(PostCard);
