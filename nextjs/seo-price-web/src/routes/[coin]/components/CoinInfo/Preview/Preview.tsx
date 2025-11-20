/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useCallback } from 'react';

import Content from './components/Content';
import Link from './components/Link';
import MainTitle from './components/MainTitle';
import RichText from './components/RichText';
import Tag from './components/Tag';
import Wrap from './components/Wrap';
import { bootConfig } from 'kc-next/boot';

const IS_TR_SITE = bootConfig._BRAND_SITE_ === 'TR';

const ComponentMap = {
  TITLE: MainTitle,
  TEXT: Content,
  WRAP: Wrap,
  LINK: Link,
  CURRENCY: Tag,
  RICHTEXT: RichText,
  REACTTEXT: Content,
};

export default ({ content = [], withStyle = false, position }: {
  content?: { type: string; id: string }[];
  withStyle?: boolean;
  position?: string;
}) => {
  const handleClick = useCallback((event) => {
    // 土耳其站不跳转
    if (IS_TR_SITE && event) {
      event.preventDefault();
    }
  }, []);

  return content.map((item, index) => {
    if (!item.type) return null;
    const ArticleContentItem = ComponentMap[item.type.toUpperCase()];
    if (!ArticleContentItem) return null;
    return (
      <ArticleContentItem
        info={item}
        key={item.id || index}
        withStyle={withStyle}
        position={position}
        isFaq
        onClick={handleClick}
      />
    );
  });
};
