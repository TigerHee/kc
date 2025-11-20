/**
 * Owner: larvide.peng@kupotech.com
 */

import { styled } from '@kux/mui';
import { ICArrowLeftOutlined, ICArrowRightOutlined } from '@kufox/icons';
import history from '@kucoin-base/history';
import { articles } from 'src/components/SecurityMenu/config';
import { _t } from 'src/tools/i18n';

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid ${(props) => props.theme.colors.cover8};
  margin: 32px 0;
`;
const Prev = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  cursor: pointer;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
  .ico {
    [dir='rtl'] & {
      transform: rotate(-180deg);
    }
  }

  &:hover {
    .article-name {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;
const Next = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  cursor: pointer;
  margin-top: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }

  .ico {
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }

  &:hover {
    .article-name {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;
const ArticleNav = styled.div`
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;
const ArticleName = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

const Footer = ({ article }) => {
  const { prev, next } = article.articleNavigation;
  const { title: prevTitle, children: prevChildren } = prev ? articles[Number(article.id) - 2] : {};
  const { title: nextTitle, children: nextChildren } = next ? articles[Number(article.id)] : {};

  const handleChangeArticle = (path) => {
    history.push(path);
  };

  return (
    <FlexBox>
      <Prev onClick={() => prev && handleChangeArticle(prevChildren[0].path)}>
        <ICArrowLeftOutlined className="ico" size={16} />
        {prev ? (
          <ArticleNav>
            {_t('f2e4a9a1d64e4000a1a0')}
            <ArticleName className="article-name">{_t(prevTitle)}</ArticleName>
          </ArticleNav>
        ) : (
          <span>{_t('a5dd634a700a4000ae11')}</span>
        )}
      </Prev>
      <Next onClick={() => next && handleChangeArticle(nextChildren[0].path)}>
        {next ? (
          <ArticleNav>
            {_t('f9f491b5cdfc4000a0f4')}
            <ArticleName className="article-name">{_t(nextTitle)}</ArticleName>
          </ArticleNav>
        ) : (
          <span>{_t('719780cd575e4000a0a9')}</span>
        )}
        <ICArrowRightOutlined className="ico" size={16} />
      </Next>
    </FlexBox>
  );
};

export default Footer;
