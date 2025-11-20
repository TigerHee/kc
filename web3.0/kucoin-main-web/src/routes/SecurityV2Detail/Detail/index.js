/**
 * Owner: larvide.peng@kupotech.com
 */
import { memo, useEffect } from 'react';
import { styled, useMediaQuery } from '@kux/mui';
import { Element, scroller } from 'react-scroll';
import { useLocation } from 'react-router-dom';
import { map } from 'lodash';
import { useRestrictNotice } from 'src/hooks/useRestrictNotice';
import { _t } from 'tools/i18n';
import { Article } from './styled';
import Footer from './Footer';

const ElementWrap = styled(Element)`
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 24px;
  }
`;
const Details = ({ article }) => {
  const { hash } = useLocation();
  const { isShowRestrictNotice, restrictNoticeHeight } = useRestrictNotice();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  // 吸顶距离
  const offset = (isShowRestrictNotice ? restrictNoticeHeight : 0) + (isSm ? 80 : 100);
  const { children } = article;

  useEffect(() => {
    const Anchor = hash.replace('#', '') || '1-1';
    scroller.scrollTo(Anchor, {
      offset: -offset,
    });
  }, [article]);

  return (
    <Article>
      <section className="article-content">
        {map(children, ({ title, id, children }) => {
          return (
            <section key={id} id={`ContainerElement_${id}`} className="article-section">
              {title ? (
                <ElementWrap id={id} name={id}>
                  {_t(title)}
                </ElementWrap>
              ) : null}
              {map(children, ({ content, title: titleH2, id }) => {
                return (
                  <section key={id} id={id}>
                    {titleH2 && title !== titleH2 ? <h2>{_t(titleH2)}</h2> : null}
                    <p>{_t(content)}</p>
                  </section>
                );
              })}
            </section>
          );
        })}
      </section>
      <Footer article={article} />
    </Article>
  );
};

export default memo(Details);
