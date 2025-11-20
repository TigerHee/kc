/*
 * @owner: Tank@kupotech.com
 */
import { useEffect, useMemo } from 'react';
import { useFuturesDispatch } from '../components/FuturesProvider';
import { AppState } from '../types/contract';
import { UPDATE } from '../components/FuturesProvider/reducer';

export const useSetFutureSymbolsMap = ({ symbolsMap, theme }: AppState) => {
  const dispatch = useFuturesDispatch();

  const payload = useMemo(() => {
    const result: AppState = {};
    if (symbolsMap) {
      result.symbolsMap = symbolsMap;
    }
    if (theme) {
      result.theme = theme;
    }
    return result;
  }, [symbolsMap, theme]);

  useEffect(() => {
    dispatch({
      type: UPDATE,
      payload,
    });
  }, [payload, dispatch]);
};
