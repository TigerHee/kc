/**
 * Owner: tiger@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import FilterTable from 'components/NewFilterTable';
import record from 'hocs/record';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginCreator } from '../config';

const Login = (props) => {
  const dispatch = useDispatch();
  const { subAccountList, pagination } = useSelector((state) => state.sub_history_login);

  const [cards, setCards] = useState(loginCreator({}));

  useEffect(() => {
    if (subAccountList) {
      loginCreator({});
      setCards(loginCreator({ subAccountList }));
    }
  }, [subAccountList]);

  useEffect(() => {
    dispatch({
      type: 'sub_history_login/getSubAccountListWithoutPage',
    });
  }, []);

  return (
    <section>
      <FilterTable
        {...props}
        size="medium"
        cards={cards}
        hasPaginate={pagination?.total > pagination?.pageSize}
      />
    </section>
  );
};
export default injectLocale(record({ namespaceDict: { login: 'sub_history_login' } })(Login));
