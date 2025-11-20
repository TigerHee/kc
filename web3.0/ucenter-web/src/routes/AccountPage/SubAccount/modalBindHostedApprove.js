/**
 * Owner: tiger@kupotech.com
 * 托管子账号绑定审批
 */
import styled from '@emotion/styled';
import { Button, Dialog, Table, useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import { separateNumber } from 'helper';
import { useEffect, useState } from 'react';
import { agreeBindToTradeTem, disagreeBindToTradeTem, getHostedApplyList } from 'services/account';
import { _t } from 'tools/i18n';

const BindHostedApproveMain = styled.div`
  thead {
    th {
      padding: 0 12px 6px;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      background-color: transparent;
      border-bottom: 0;
    }
  }

  tbody {
    td {
      padding: 6px 12px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      border-bottom: 0;

      &:first-child {
        width: 20px;
        color: ${({ theme }) => theme.colors.text30};
      }
    }
  }

  .KuxButton-root {
    height: fit-content;
  }
`;
const NameBox = styled.div`
  max-width: 200px;
  word-wrap: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100px;
  }
`;
const IndexNo = styled.span`
  margin-right: 12px;
`;
const SubName = styled.span`
  color: ${({ theme }) => theme.colors.text60};
`;
const Amount = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;
const AllowQueryTrade = styled.span`
  color: ${({ theme }) => theme.colors.text};
  &.disagree {
    color: ${({ theme }) => theme.colors.text40};
  }
`;

export default ({ open, onCancel, dispatchWrapper }) => {
  const { message } = useSnackbar();
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getList = () => {
    dispatchWrapper('getTradeTeamsInfo');
    setLoading(true);
    getHostedApplyList({ currentPage: 1, pageSize: 100 })
      .then((res) => {
        setList(res?.items || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getList();
  }, []);

  const onRefresh = () => {
    getList();
    dispatchWrapper('getAccountList', {
      refreshAmount: true,
    });
    dispatchWrapper('getTradeTeamsInfo');
  };

  const onSubmit = (item, agree) => {
    const fn = agree ? agreeBindToTradeTem : disagreeBindToTradeTem;
    fn({ subUid: item.uid })
      .then(({ success }) => {
        if (success) {
          onRefresh();
        }
      })
      .catch((err) => {
        err?.msg && message.error(err?.msg);
      });
  };

  // 同意全部
  // const onAgreeAll = () => {
  //   if (list.length === 0) {
  //     return;
  //   }
  //   agreeAllBindToTradeTem()
  //     .then(({ success }) => {
  //       if (success) {
  //         message.success(_t('operation.succeed'));
  //         onRefresh();
  //       }
  //     })
  //     .catch((err) => {
  //       err?.msg && message.error(err?.msg);
  //     });
  // };

  const columns = [
    // {
    //   title: '',
    //   key: 'idx',
    //   render(recode, item, index) {
    //     return index + 1;
    //   },
    // },
    {
      title: _t('tyKXpo4XFnMEZhiKHwfcuy'),
      dataIndex: 'subName',
      render(val, item, index) {
        return (
          <NameBox>
            <IndexNo>{index + 1}</IndexNo>
            <SubName>{val}</SubName>
          </NameBox>
        );
      },
    },
    {
      title: _t('h1i8gDKGSKNFki9GjWL9PZ'),
      align: 'right',
      dataIndex: 'allowQueryTrade',
      render: (val) => {
        return (
          <AllowQueryTrade
            className={classnames({
              disagree: !val,
            })}
          >
            {val ? _t('4wgNeWH9fJyvJDdDYcTKsA') : _t('vFLB1pW25u7nBLqWUuZbLq')}
          </AllowQueryTrade>
        );
      },
    },
    {
      title: _t('firmAEuKWAZSscY6kL798i', { currency: window._BASE_CURRENCY_ }),
      align: 'right',
      dataIndex: 'asset',
      render: (val) => {
        return <Amount>{separateNumber(val?.totalAssets)}</Amount>;
      },
    },
    {
      title: _t('u7fSiTLu7mVsRuUjPk3Ckc'),
      align: 'right',
      dataIndex: 'address',
      render: (val, item) => {
        return (
          <>
            <Button onClick={() => onSubmit(item, false)} type="secondary" variant="text" as="a">
              {_t('dbxTVKhwEeMLd4P35Kcc94')}
            </Button>
            <Button onClick={() => onSubmit(item, true)} className="ml-12" variant="text" as="a">
              {_t('rQAT9Jusji9CKFAD267Srh')}
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onCancel={onCancel}
      style={{ margin: 24 }}
      title={_t('xj4s3nB7U4T1oEnFBQPSKy')}
      cancelText={_t('sXGEPgErKtN1LofWCZ7AtR')}
      okText={null}
      size="large"
    >
      <BindHostedApproveMain>
        <Table
          rowKey="uid"
          dataSource={list}
          columns={columns}
          scroll={
            list.length > 6
              ? {
                  y: 200,
                }
              : {}
          }
          loading={isLoading}
        />
      </BindHostedApproveMain>
    </Dialog>
  );
};
