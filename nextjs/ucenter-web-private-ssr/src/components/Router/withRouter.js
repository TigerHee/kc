import React from 'react';
import { useRouter } from 'kc-next/router';

export default () => (Component) => {
  return (props) => {
    const router = useRouter();
    const asPath = router?.asPath;

    const routerProps = React.useMemo(() => {
      return {
        currentRoute: asPath,
      };
    }, [asPath]);

    return <Component {...props} {...router} {...routerProps} />;
  };
};
