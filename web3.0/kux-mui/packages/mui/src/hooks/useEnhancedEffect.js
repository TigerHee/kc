/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default useEnhancedEffect;
