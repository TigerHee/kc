/**
 * Owner: willen@kupotech.com
 */
import fetch from 'isomorphic-fetch';

const _fetchPull = (url, options = {}) => {
  options.mode = options.mode || 'cors';
  options.credentials = options.credentials || 'include';
  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  };
  options.method = 'GET';
  return fetch(url, options).then((response) => {
    return response.json();
  });
};

//

let prrFix = 'https://assets.staticimg.com/cms';

export function getJobs() {
  return _fetchPull(`${prrFix}/jobs/jobs.json`);
}

export function getJobCategory() {
  return _fetchPull(`${prrFix}/jobs/job_category.json`);
}
