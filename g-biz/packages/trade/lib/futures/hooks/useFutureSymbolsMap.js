/*
 * @owner: Tank@kupotech.com
 */
import { useEffect, useMemo } from 'react';
import { useFuturesDispatch } from '../components/FuturesProvider';
import { UPDATE } from '../components/FuturesProvider/reducer';
export const useSetFutureSymbolsMap = ({ symbolsMap, theme }) => {
    const dispatch = useFuturesDispatch();
    const payload = useMemo(() => {
        const result = {};
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
