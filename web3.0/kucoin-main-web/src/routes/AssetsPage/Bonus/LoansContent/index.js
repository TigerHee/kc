/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import { styled, Select, Spin, Pagination, Empty, Button, useResponsive } from '@kux/mui';
import { useSelector } from 'src/hooks';
import { useFetchHandle } from 'hooks';
import { Link } from 'components/Router';
import { getCouponList } from 'src/services/bonus';
import UseRules from './UseRules';
import CardList from './CardList';
import { CouponTypes, CouponTypesHash, orderTypes } from './utils';

const LoansContentWrap = styled.div`
  font-size: 14px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }
`;

const LoansContentTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 0;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;

const LeftRightComp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
  }
`;

const LoansTip = styled.div`
  padding: 16px;
  border-radius: 16px;
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover2};
`;

const LoanRuleTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const LoanRuleContent = styled.div`
  margin-top: 12px;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};

  a {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 180%;
    text-decoration-line: underline;
  }
`;

const GoBorrow = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
`;

const PaginationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 24px;
`;
const StyledPagination = styled(Pagination)`
  margin-bottom: 80px;
`;

const EmptyBox = styled.div`
  padding: 100px 0;
  text-align: center;
  width: 100%;
`;

const LoansDetailContent = memo((props) => {
  const { lg, sm } = useResponsive();
  const { fetchHandle, loading } = useFetchHandle();
  const userId = useSelector(({ user }) => user.user?.uid);

  // 计算一个合理的 PageSize（只计算一次）
  const pageSize = useMemo(() => {
    if (!sm) {
      return 0;
    }
    if (!lg) {
      return 8;
    }
    return 9;
  }, [sm, lg]);

  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [showRule, setShowRule] = useState(false);
  const [filter, setFilter] = useState({
    type: '',
  });

  const { type } = filter;

  const dataList = useMemo(() => {
    if (!type) return list;
    let filterType = CouponTypesHash[type]?.filter || type;
    filterType = Array.isArray(filterType) ? filterType : [filterType];
    return list.filter((item) => filterType.includes(item.state));
  }, [list, type]);

  const onChange = useCallback((type) => {
    setFilter((item) => ({
      ...item,
      type,
    }));
    setCurrent(1);
  }, []);

  const maxLength = dataList.length;

  const dataSource = useMemo(() => {
    if (!pageSize) return dataList;
    return dataList.slice(pageSize * (current - 1), pageSize * current);
  }, [current, pageSize, dataList]);

  const onClose = useCallback(() => {
    setShowRule(false);
  }, []);

  const queryList = useCallback(
    (params) => {
      fetchHandle(
        getCouponList({
          ...params,
          userId,
        }),
        {
          onSilenceOk(res) {
            const data = res?.data;
            if (data && typeof data === 'object') {
              const resList = [];
              orderTypes.forEach((type) => {
                const couponList = data[type];
                if (Array.isArray(couponList)) {
                  resList.push(
                    ...couponList.map((item) => ({
                      ...item,
                      _type: type,
                    })),
                  );
                }
              });
              setList(resList);
            }
          },
        },
      );
    },
    [fetchHandle, userId],
  );

  useEffect(() => {
    queryList();
  }, [queryList]);

  useEffect(() => {
    // pageSize变更可能会影响list分页的生成，所以pageSize变更后需要重置页码
    setCurrent(1);
  }, [pageSize]);

  return (
    <LoansContentWrap>
      <LeftRightComp>
        <LoansContentTitle>{_t('assets.bonus.loans')}</LoansContentTitle>
        <Link to="/trade/margin/BTC-USDT">
          <Button size={sm ? 'basic' : 'small'}>{_t('assets.margin.bonus.link')}</Button>
        </Link>
      </LeftRightComp>
      <LoansTip>
        <LoanRuleTitle>{_t('assets.margin.bonus.rules.des')}</LoanRuleTitle>
        <LoanRuleContent>
          {_tHTML('assets.margin.bonus.detail.rules.des', {
            assetUrl: addLangToPath('/assets-detail'),
            helpUrl: addLangToPath('/support/900004861643'),
          })}
        </LoanRuleContent>
      </LoansTip>
      <div className="mt-20">
        <Select
          value={filter.type}
          onChange={onChange}
          options={CouponTypes}
          style={{ width: 160 }}
        />
      </div>
      <Spin spinning={loading} size="small">
        <CardList list={dataSource} onRefresh={queryList} userId={userId} />
        {!dataSource?.length && (
          <EmptyBox>
            <Empty description={_t('4ZXsbhmZYRojKVuaUbnnec')} />
          </EmptyBox>
        )}
      </Spin>
      {Boolean(pageSize && maxLength > pageSize) && (
        <PaginationBox>
          <StyledPagination
            total={maxLength}
            current={current}
            pageSize={pageSize}
            onChange={(event, target) => setCurrent(target)}
          />
        </PaginationBox>
      )}
      {showRule && <UseRules onClose={onClose} />}
    </LoansContentWrap>
  );
});

export default LoansDetailContent;
