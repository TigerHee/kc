/**
 * Owner: jesse.shao@kupotech.com
 */
import { createContext, useContext } from 'react';

/**
 * 共享全局变量和方法、逻辑等
 */
export const QuizContext = createContext();

export const useQuizContext = () => {
  return useContext(QuizContext);
};
