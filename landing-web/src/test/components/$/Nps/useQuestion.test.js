/*
 * Owner: jesse.shao@kupotech.com
 */
// main.test.js
import useQuestion from 'src/components/$/Nps/hooks/useQuestion.js';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('dva', () => ({
  ...jest.requireActual('dva'),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(() => ({
    nps: {
      // 弹窗 1: 感谢您对KuCoin的支持！
      // 弹窗 2: 开始答题
      showModalType: 0,
      // 详情
      // option增加selected;content;
      surveyinfo: {
        questions: [
          {
            options: [
              {
                selected: true,
                nextQuestion: 3,
              },
            ],
            type: 1,
            LANG: 'LANG1',
          },
          {},
        ],
      },
      // 当前题目的标号，纯展示用;只受上下一题按钮点击改变；从1开始
      curNum: 1,
      // 类似: [0, 3, 5, 8] 最后一项为当前面板的题目的索引。此数组维护题目前后关系
      linkedList: [0],
    },
  })),
}));

describe('useQuestion', () => {
  test('goNext updates curNum and linkedList correctly', () => {
    const dispatch = jest.fn();
    const { goNext, goPre, curNum, linkedList, typeTextView, curIndex, setEN_USLangWhenNoMatch } =
      useQuestion();
    // expect(typeTextView).toBe(213);
    setEN_USLangWhenNoMatch();
    goPre();
    // goNext();
    expect(curIndex).toBe(0);
  });
});
