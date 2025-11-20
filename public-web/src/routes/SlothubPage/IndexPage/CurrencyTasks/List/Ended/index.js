/*
 * owner: borden@kupotech.com
 * desc: 往期回顾，支持条件查找且h5需要支持滚动加载
 */
import { Checkbox, styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import ShareHistoryGainScore from './ShareHistoryGainScore';

const Table = loadable(() => import('./Table'));
const MTable = loadable(() => import('./MTable'));

const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;
const StyledCheckbox = styled(Checkbox)`
  display: inline-flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  .KuxCheckbox-inner {
    width: 16px;
    height: 16px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    span {
      font-size: 12px;
      line-height: 120%;
    }
  }
`;

const Ended = ({ searchText }) => {
  const { sm } = useResponsive();
  const isLogin = useSelector((state) => state.user.isLogin);

  const [checked, setChecked] = useState(false);

  const fetchParams = useMemo(() => {
    return {
      currency: searchText,
      mySelf: checked ? 1 : 0,
    };
  }, [checked, searchText]);

  const handleChange = useCallback((e) => {
    setChecked(e.target.checked);
  }, []);

  return (
    <>
      <Filter>
        {isLogin && (
          <StyledCheckbox
            size="small"
            checked={checked}
            onChange={handleChange}
            checkOptions={{
              type: 2,
              checkedType: 1,
            }}
          >
            {_t('04e299bcb1f44000a1b3')}
          </StyledCheckbox>
        )}

        <ShareHistoryGainScore isCheckedJoin={checked} />
      </Filter>
      {sm ? <Table fetchParams={fetchParams} /> : <MTable fetchParams={fetchParams} />}
    </>
  );
};

export default React.memo(Ended);
