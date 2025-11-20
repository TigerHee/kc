import {useMemo, useState} from 'react';

import {BaseLayoutContext} from 'layouts/index';

const BaseLayout = ({children}) => {
  const [lang, setLang] = useState('en-us');

  const contextValue = useMemo(() => {
    return {lang, setLang};
  }, [lang, setLang]);

  return (
    <BaseLayoutContext.Provider value={contextValue}>
      {children}\
    </BaseLayoutContext.Provider>
  );
};

export default BaseLayout;
