/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect } from 'react';
import getTargetElement from 'utils/domTarget';
import useMount from './useMount';

function depsAreSame(oldDeps, deps) {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

const createEffectWithTarget = (useEffectType) => {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  const useEffectWithTarget = (effect, deps, target) => {
    const hasInitRef = React.useRef(false);

    const lastElementRef = React.useRef([]);
    const lastDepsRef = React.useRef([]);

    const unLoadRef = React.useRef();

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target];
      const els = targets.map((item) => getTargetElement(item));

      if (!hasInitRef.current) {
        hasInitRef.current = true;
        lastElementRef.current = els;
        lastDepsRef.current = deps;

        unLoadRef.current = effect();
        return;
      }

      if (
        els.length !== lastElementRef.current.length ||
        !depsAreSame(els, lastElementRef.current) ||
        !depsAreSame(deps, lastDepsRef.current)
      ) {
        unLoadRef.current?.();

        lastElementRef.current = els;
        lastDepsRef.current = deps;
        unLoadRef.current = effect();
      }
    });
    useMount(() => {
      unLoadRef.current?.();
      hasInitRef.current = false;
    });
  };

  return useEffectWithTarget;
};

const useEffectWithTarget = createEffectWithTarget(useEffect);

export default useEffectWithTarget;
