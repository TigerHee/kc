/**
 * Owner: willen@kupotech.com
 */
import { Empty, Spin, styled, Table, useResponsive } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useEffect, useState } from 'react';
import { getEscrowAssets } from 'src/services/account';
import { sentryReport } from 'src/tools/sentry';
import { _t } from 'tools/i18n';
import { getColumns } from './constants';

const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const PageTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  padding: 24px 64px;
  font-weight: 600;
  font-size: 24px;
  background: ${({ theme }) => theme.colors.overlay};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    font-size: 18px;
  }
`;

const TitleTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 64px;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
const LoadingWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

const EmptyBox = styled.div`
  padding-top: 80px;
  display: flex;
  justify-content: center;
`;

const StyledTable = styled(Table)`
  margin-top: 12px;
  thead tr th {
    padding: 11px 0 9px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
  }

  tr td {
    padding: 18px 0;
    border-bottom: none;
  }
`;

const EscrowAccount = () => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState([]);
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const fetchList = async () => {
    try {
      setListLoading(true);
      const { data = [] } = await getEscrowAssets();
      setList(data);
    } catch (error) {
      sentryReport({
        level: 'warning',
        message: `get escrow asset list error`,
        tags: {
          errorType: 'escrow_account',
        },
      });
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  let title = (
    <PageTitle>
      {isH5 ? (
        <TitleTop>
          <span>{_t('f72ec28a21274000ab44')}</span>
        </TitleTop>
      ) : (
        <span>{_t('f72ec28a21274000ab44')}</span>
      )}
    </PageTitle>
  );

  return (
    <Wrapper data-inspector="escrow_account">
      {title}
      <div>
        {listLoading ? (
          <LoadingWrapper>
            <div>
              <Spin spinning={listLoading} size="small" />
            </div>
          </LoadingWrapper>
        ) : list?.length ? (
          <Content>
            <StyledTable
              bordered
              rowKey={(record) => record.currency}
              columns={getColumns()}
              dataSource={list}
            />
          </Content>
        ) : (
          <EmptyBox>
            <Empty />
          </EmptyBox>
        )}
      </div>
    </Wrapper>
  );
};

export default withRouter()(EscrowAccount);
