/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ArticleListWrap = styled.div`
  margin-top: 24px;
  .content {
    position: relative !important;
    margin-bottom: 0 !important;
  }
  .card-image {
    position: relative !important;
    picture {
      display: block;
      width: 100%;
      height: 100%;
    }
    img {
      object-fit: cover;
    }
  }
  .article-card {
    margin-bottom: 16px;
  }
`;

export const Ul = styled.ul`
  margin-bottom: 24px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-gap: 16px;
    grid-template-columns: 1fr;
  }
`;
