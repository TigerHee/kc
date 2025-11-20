/**
 * Owner: vijay.zhou@kupotech.com
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { getNewcomerConfig, getNewcomerTaskStatus } from '../../services';

const Context = createContext({ config: null, taskList: null });

const pullConfig = async (callback) => {
  try {
    const { data, success, msg } = await getNewcomerConfig();
    if (success) {
      callback(data);
    } else {
      throw new Error(msg);
    }
  } catch (err) {
    callback(null);
    console.error(err);
  }
};

const pullTaskList = async (callback) => {
  try {
    const { data, success, msg } = await getNewcomerTaskStatus();
    if (success) {
      callback(data);
    } else {
      throw new Error(msg);
    }
  } catch (err) {
    callback(null);
    console.error(err);
  }
};

export const DataProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [taskList, setTaskList] = useState(null);

  useEffect(() => {
    pullConfig((config) => {
      setConfig(config);
    });
    pullTaskList((taskList) => {
      setTaskList(taskList);
    });
  }, []);

  return <Context.Provider value={{ config, taskList }}>{children}</Context.Provider>;
};

export const useCtx = () => {
  return useContext(Context);
};
