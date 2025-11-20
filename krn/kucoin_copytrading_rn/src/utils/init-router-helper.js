import qs from 'qs';

export const getInitialParams = initRouter => {
  const [name, query] = decodeURIComponent(initRouter).split('?');
  return {
    name,
    query,
    params: qs.parse(query),
  };
};
