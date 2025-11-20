import { NAMESPACE } from './config';

function report(options = {}) {
  if (!options.message) {
    throw new Error('options.message must exist ');
  }
  if (!options.biz) {
    throw new Error('options.biz must exist ');
  }
  if (options.level) {
    delete options.level;
  }
  const { message, biz, tags = {}, ...others } = options;
  return window[NAMESPACE].captureEvent({
    message,
    level: 'fatal',
    tags: {
      ...tags,
      biz,
    },
    ...others,
  });
}

export default report;
