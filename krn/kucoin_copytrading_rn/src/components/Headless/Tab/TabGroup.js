import {memo} from 'react';

import {useTabContext} from './useStore';

const InnerTabGroup = memo(({children, onChange, value}) => {
  const {createProvider} = useTabContext({onChange, value});
  return createProvider(children);
});

export default memo(InnerTabGroup);
