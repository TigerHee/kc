/**
 * Owner: larvide.peng@kupotech.com
 */
import { styled } from '@kux/mui';
import BreadCrumbs from 'components/KcBreadCrumbs';
import { _t } from 'tools/i18n';

const BreadWrapper = styled(BreadCrumbs)`
  .Item-Child > a {
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-family: Roboto;
    font-style: normal;
    line-height: 130%;
  }

  .Item-Child > span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    font-family: Roboto;
    font-style: normal;
    line-height: 130%;
  }
`;

const SecurityBreadcrumb = ({ article }) => {
  const breadCrumbs = [
    {
      label: _t('45814d1e153e4000ac97'),
      url: '/security',
    },
    {
      label: _t(article.title),
    },
  ];

  return <BreadWrapper breadCrumbs={breadCrumbs} />;
};

export default SecurityBreadcrumb;
