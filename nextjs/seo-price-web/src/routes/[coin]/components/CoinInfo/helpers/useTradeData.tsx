/**
 * Owner: kevyn.yu@kupotech.com
 */
// import { useParams } from 'react-router-dom';
// import asyncSocket from 'tools/asyncSocket';

const useTradeData = () => {
  // const { tradingPairs, coinInfo } = useSelector((state) => state.coinDetail);
  // const { coin } = useParams();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!tradingPairs.length) return;
  //   const tradingSymbols = uniq(tradingPairs.map((item) => item.symbol)).join(',');
  //   asyncSocket((socket) => {
  //     socket.subscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
  //     socket.topicMessage(
  //       `/quicksilver/symbol-stats`,
  //       'quicksilver.symbol.stats',
  //     )((result) => {
  //       if (Array.isArray(result) && result.length > 0) {
  //         dispatch({
  //           type: 'coinDetail/handleTradeDataSocket',
  //           payload: {
  //             result,
  //           },
  //         });
  //       }
  //     });
  //   });

  //   return () => {
  //     asyncSocket((socket) => {
  //       socket.unsubscribe(`/quicksilver/symbol-stats:${tradingSymbols}`);
  //     });
  //   };
  // }, [dispatch, tradingPairs]);
};

export default useTradeData;
