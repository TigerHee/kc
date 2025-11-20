/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import ChatWindowModel from './components/ChatWindow/model';

const modelDict = {
  ChatWindowModel,
};

export const httpTool = Http.create('@kc/im');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}
