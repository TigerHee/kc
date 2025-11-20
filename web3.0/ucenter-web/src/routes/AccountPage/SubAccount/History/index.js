/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { Breadcrumb, CssBaseline, px2rem, Tabs } from '@kux/mui';
import { Link } from 'components/Router';
import { useCallback, useMemo, useState } from 'react';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import { HISTORY_TYPES, HISTORY_TYPES_MAP } from './typeConfig';

const { Tab } = Tabs;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 12px;
  }
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: ${px2rem(20)};
  & a {
    color: ${(props) => props.theme.colors.text60};
  }
`;

const ExTabs = styled(Tabs)`
  margin-bottom: 24px;
  .KuxTab-container:not(:first-of-type) {
    margin-right: 0;
    margin-left: 24px;
  }
`;

export default (props) => {
  const { match } = props;
  const [type, setType] = useState(match?.params?.type || HISTORY_TYPES[0].key);

  const onChange = useCallback((e, val) => {
    setType(val);
    push(`/account/sub/history/${val}`);
  }, []);

  const curRenderItem = useMemo(() => HISTORY_TYPES_MAP[type], [type]);

  return (
    <Wrapper data-inspector="account_sub_history_page">
      <StyledBreadcrumb>
        <Breadcrumb.Item key="subaccount">
          <Link to={'/account/sub'}>{_t('subaccount.subaccount')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item key="login">{_t(curRenderItem.label)}</Breadcrumb.Item>
      </StyledBreadcrumb>

      <ExTabs value={type} onChange={onChange} size="small">
        {HISTORY_TYPES.map(({ label, key }) => (
          <Tab label={_t(label)} value={key} key={key} />
        ))}
      </ExTabs>

      {curRenderItem.component()}
      <CssBaseline />
    </Wrapper>
  );
};
