/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useMemo, useCallback } from 'react';
import defaultArticleBg from 'static/bitcoin-halving/learn.svg';
import { trackClick } from 'utils/ga';
import { Card } from './ArticleCard.style';
import { difficultyMap } from './config';
import TutorialTag from './TutorialTag';
import moment from 'moment';
import { map } from 'lodash';
import { addLangToPath } from 'tools/i18n';
import { kcsensorsManualExpose } from 'src/utils/ga';

const TagsDisplay = ({ tags = [], max = 1 }) => {
  const displayTags = tags?.slice(0, max);
  const extraTagsCount = tags?.length > max ? tags.length - max : 0;
  return (
    <>
      {map(displayTags, (tag) => (
        <span key={tag} className="tag is-info">
          {tag}
        </span>
      ))}
      {extraTagsCount > 0 && <span className="tag is-info"> +{extraTagsCount}</span>}
    </>
  );
};

const ArticleCard = ({ topicMap, info, maxTagNum = 2, index = -1, blockid }) => {
  const topics = useMemo(() => {
    return info?.topics?.map((i) => topicMap[i]).filter((i) => i);
  }, [info?.topics, topicMap]);

  const time = info?.updatedAt ?? info?.publishingTime;
  const isTutorial = info?.isTutorial ?? info?.tutorial;
  const title = info?.articleDetailTitle ?? info?.title;
  const isFeatured = index === -1;
  useEffect(() => {
    if (info) {
      kcsensorsManualExpose(
        [index > -1 ? 'Article' : 'featuredArticle', index > -1 ? `${index + 1}` : '1'],
        {
          url: info?.articleUrl,
          ArticleCode: info?.articleId,
        },
      );
    }
  }, [info, index]);

  const handleClick = useCallback((blockid) => {
    if (blockid) {
      trackClick([blockid, '1']);
    }
  }, []);

  return (
    <article className="article-card">
      <Card
        className="card is-rounded"
        featured={isFeatured}
        onClick={() => {
          handleClick(blockid);
        }}
      >
        <div className="wrapper">
          <div className="tags is-overlay customized">
            <TagsDisplay tags={topics} max={maxTagNum} />
          </div>
          <TutorialTag isTutorial={isTutorial} />
          <div className="card-image customized-image">
            <a href={addLangToPath(info?.articleUrl)}>
              <picture className="image is-4by3">
                <img src={info?.picUrl ?? defaultArticleBg} alt={info?.picAlt} />
              </picture>
            </a>
          </div>
          {!!info?.progress && (
            <progress
              className="progress is-link is-small ml-0"
              value={info?.progress ?? 0}
              max="100"
            >
              {info?.progress + '%'}
            </progress>
          )}
        </div>
        <div className="content">
          <a href={addLangToPath(info?.articleUrl)}>
            <span className="modal-card-title is-size-3" title={title}>
              {title}
            </span>
          </a>
          <div className="content-tag">
            {difficultyMap[info?.difficulty]?.content && (
              <span className="tag is-success" style={difficultyMap[info?.difficulty]}>
                {difficultyMap[info?.difficulty]?.content}
              </span>
            )}
            {!!time && <time dateTime={time}>{moment(time).format('LL')}</time>}
          </div>
        </div>
      </Card>
    </article>
  );
};

export default ArticleCard;
