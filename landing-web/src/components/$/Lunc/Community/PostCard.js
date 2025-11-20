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
  const url = addLangToPath(`${KUCOIN_HOST}/kucoins/bbs/post/${postId}`);
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      sensors.trackClick(['V3', '1']);
      window.open(url);
      window.opener = null;
    },
    [url],
  );
  const textContent = useMemo(
    () => {
      return postContent.find(item => item?.type === 'TEXT')?.text;
    },
    [postContent],
  );

  return (
    <CardLink href={url} onClick={handleClick}>
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
