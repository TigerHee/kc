/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

let globalId = 0;
export default function useId(idOverride) {
  const [defaultId, setDefaultId] = React.useState(idOverride);
  const id = idOverride || defaultId;
  React.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`kuFox-${globalId}`);
    }
  }, [defaultId]);
  return id;
}
