/**
 * Owner: tiger@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import FilterTable from 'components/NewFilterTable';
import record from 'hocs/record';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transferCreator } from '../config';

const Transfer = (props) => {
  const dispatch = useDispatch();
  const { accountList, pagination } = useSelector((state) => state.sub_history_transfer);
  const { user } = useSelector((state) => state.user);
  const [cards, setCards] = useState(transferCreator({ user }));

  useEffect(() => {
    if (accountList.length) {
      setCards(transferCreator({ accountList, user }));
    }
  }, [accountList, user]);

  useEffect(() => {
    dispatch({
      type: 'sub_history_transfer/getAccountList',
    });
  }, []);

  return (
    <FilterTable
      {...props}
      size="medium"
      cards={cards}
      hasPaginate={pagination?.total > pagination?.pageSize}
    />
  );
};

export default injectLocale(
  record({ namespaceDict: { transfer: 'sub_history_transfer' } })(Transfer),
);
