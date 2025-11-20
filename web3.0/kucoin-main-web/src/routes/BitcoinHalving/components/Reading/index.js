/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { Ul, ArticleListWrap } from './index.style';

const Reading = ({list,topicMap}) => {

  if(!list || (list && list.length === 0)){
    return null;
  }

  return (
    <ArticleListWrap>
      <Ul>
        {list?.map((article, idx) => (
          <li key={`${article?.title + idx}`}>
            <ArticleCard
              info={article}
              index={idx}
              topicMap={topicMap}
              blockid={`learn${idx + 1}`}
            />
          </li>
        ))}
      </Ul>
    </ArticleListWrap>
  );
};

export default Reading;
